/**
 * dsh-token-stats — node half.
 *
 * Aggregates provider-reported token usage from every durable session log
 * (plus any live in-memory sessions) into per-local-day buckets, estimates
 * the cost at DeepSeek's official off-peak prices, and serves:
 *
 *   GET /api/token-stats   -> JSON report consumed by the web settings UI
 *
 * Usage attribution follows the same semantics as the built-in token meter:
 * for each (turn, step) the LAST usage sample wins (an assistant/message
 * replaces its step's earlier usage chunks), and the step's usage is charged
 * to the local day of that sample's event time. The model/provider come from
 * the most recent request/header event before the sample.
 *
 * @module @dsh-local/token-stats
 */
import { readFile, stat } from "node:fs/promises";
import { zstdDecompressSync } from "node:zlib";

/** Cordis plugin name. */
export const name = "token-stats";
/** Required services: the route registry and the durable session-log store. */
export const inject = ["webServer", "sessionPersistence"];

/** Zstandard frame magic (little-endian 0xFD2FB528). */
const ZSTD_MAGIC = Buffer.from([0x28, 0xb5, 0x2f, 0xfd]);

/**
 * Run `fn` over `items` with at most `limit` concurrent invocations, keeping
 * result order aligned with input order.
 * @template T
 * @template R
 * @param {T[]} items - inputs.
 * @param {number} limit - concurrency cap.
 * @param {(item: T, index: number) => Promise<R>} fn - async mapper.
 * @returns {Promise<R[]>} results in input order.
 */
export async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const index = next;
      next += 1;
      if (index >= items.length) return;
      results[index] = await fn(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

/**
 * Decompress a session artifact that is a concatenation of zstd frames (the
 * JSONL persistence appends one frame per batch). Node's "async" zstd API
 * turns out to block the event loop anyway (measured: it does not use the
 * threadpool), so this uses the synchronous decompressor and yields to the
 * event loop every N frames — a large cold read never blocks the server's
 * request handling. Plain-text logs pass through unchanged.
 * @param buffer - raw artifact bytes.
 * @param isZstd - whether the artifact is zstd-compressed.
 * @param framesPerYield - frames decompressed between event-loop yields.
 * @returns the decoded UTF-8 log text.
 */
export async function decodeSessionArtifactAsync(buffer, isZstd, framesPerYield = 300) {
  if (!isZstd) return buffer.toString("utf8");
  const frames = [];
  let start = buffer.indexOf(ZSTD_MAGIC);
  if (start === -1) return "";
  while (start !== -1) {
    const next = buffer.indexOf(ZSTD_MAGIC, start + 1);
    const end = next === -1 ? buffer.length : next;
    frames.push(buffer.subarray(start, end));
    if (next === -1) break;
    start = next;
  }
  let text = "";
  for (let i = 0; i < frames.length; i++) {
    text += zstdDecompressSync(frames[i]).toString("utf8");
    if (i % framesPerYield === 0) await new Promise((resolve) => setImmediate(resolve));
  }
  return text;
}

/**
 * Synchronous variant of {@link decodeSessionArtifactAsync} (kept for tests
 * and the offline tooling path).
 * @param buffer - raw artifact bytes.
 * @param isZstd - whether the artifact is zstd-compressed.
 * @returns the decoded UTF-8 log text.
 */
export function decodeSessionArtifact(buffer, isZstd) {
  if (!isZstd) return buffer.toString("utf8");
  let text = "";
  let start = buffer.indexOf(ZSTD_MAGIC);
  if (start === -1) return "";
  while (start !== -1) {
    const next = buffer.indexOf(ZSTD_MAGIC, start + 1);
    const end = next === -1 ? buffer.length : next;
    text += zstdDecompressSync(buffer.subarray(start, end)).toString("utf8");
    if (next === -1) break;
    start = next;
  }
  return text;
}

/**
 * Parse a session log's JSONL text into event records, skipping torn lines.
 * @param text - decoded log text.
 * @returns parsed event objects.
 */
export function parseLogText(text) {
  const events = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;
    try {
      events.push(JSON.parse(trimmed));
    } catch {
      // A torn tail line (crash mid-append) is skipped; the fold stays valid.
    }
  }
  return events;
}

/**
 * Fast parse of only the event lines the token fold can consume: request
 * headers and usage-bearing assistant records. Every other line (chunks,
 * permissions, tool results, …) is skipped without a JSON.parse — usage
 * events are a small fraction of a log, so this avoids parsing thousands of
 * records per session on every cold read. Matching is by the literal `type`
 * field, so a tool result quoting those strings is only parsed (wasted, then
 * ignored), never misread.
 * @param text - decoded log text.
 * @returns parsed relevant event objects.
 */
export function parseLogRelevant(text) {
  const events = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;
    if (!trimmed.includes('"assistant/chunk"')
      && !trimmed.includes('"assistant/message"')
      && !trimmed.includes('"request/header"')) continue;
    try {
      events.push(JSON.parse(trimmed));
    } catch {
      // torn tail line — skip
    }
  }
  return events;
}

/**
 * Chunked async variant of {@link parseLogRelevant} used by the plugin's
 * background refresh: yields to the event loop every N lines so a large cold
 * read never blocks the server's request handling (the fold cache serves the
 * UI from memory regardless, but a blocked loop would delay every response).
 * @param text - decoded log text.
 * @param yieldEvery - lines between event-loop yields.
 * @returns parsed relevant event objects.
 */
export async function parseLogRelevantAsync(text, yieldEvery = 4000) {
  const events = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.length === 0) continue;
    if (!trimmed.includes('"assistant/chunk"')
      && !trimmed.includes('"assistant/message"')
      && !trimmed.includes('"request/header"')) continue;
    try {
      events.push(JSON.parse(trimmed));
    } catch {
      // torn tail line — skip
    }
    if (i % yieldEvery === 0) await new Promise((resolve) => setImmediate(resolve));
  }
  return events;
}

/**
 * Local calendar day key (YYYY-MM-DD) of a millisecond epoch in the server's
 * local timezone — the same day boundary a user reading a cost report sees.
 * @param ms - epoch milliseconds.
 * @returns the day key.
 */
export function localDayKey(ms) {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Fold one session event batch into a persistent fold state. The state is a
 * plain object `{ header, steps }` where `steps` maps "turn|step" to the
 * last-seen usage sample — the same replace-don't-double-count rule as the
 * token meter, so folding an appended tail over an existing state is exactly
 * equivalent to folding the whole log from scratch. `header` carries the most
 * recent request/header config across batches.
 * @param state - the fold state to mutate ({ header, steps }).
 * @param events - session events in log order.
 * @param from - index to start folding at (incremental tail).
 */
export function foldRange(state, events, from) {
  for (let i = from; i < events.length; i++) {
    const event = events[i];
    if (event.type === "request/header") {
      const config = event.data?.header?.config;
      if (config !== undefined) {
        state.header = { provider: config.provider, model: config.model };
      }
      continue;
    }
    let usage;
    let turn;
    let step;
    if (event.type === "assistant/chunk" && event.data?.chunk?.type === "usage") {
      ({ turn, step } = event.data);
      usage = event.data.chunk.usage;
    } else if (event.type === "assistant/message" && event.data?.usage !== undefined) {
      ({ turn, step, usage } = event.data);
    }
    if (usage === undefined || usage === null) continue;
    if (typeof turn !== "number" || typeof step !== "number") continue;
    state.steps.set(`${turn}|${step}`, {
      usage,
      time: typeof event.time === "number" ? event.time : Date.now(),
      model: state.header?.model,
      provider: state.header?.provider
    });
  }
}

/**
 * Fold one session's events into the authoritative per-step usage samples
 * (one-shot convenience over {@link foldRange}; the plugin's hot path uses a
 * persistent state instead).
 * @param events - session events in log order.
 * @returns a Map of "turn|step" -> { usage, time, model, provider }.
 */
export function foldSessionEvents(events) {
  const state = { header: undefined, steps: new Map() };
  foldRange(state, events, 0);
  return state.steps;
}

/**
 * Pure bucketing core: fold per-session usage samples into per-day buckets,
 * per-day model shares, and per-session totals. Shared by the one-shot
 * {@link aggregate} (which folds whole logs) and the plugin's incremental
 * path (which folds persistent states).
 * @param sessions - array of { id, steps } where steps is a usage-sample Map.
 * @returns the raw aggregate (dates in local calendar order).
 */
function bucketSteps(sessions) {
  const days = new Map();
  const sessionTotals = new Map();
  const sessionFirst = new Map();
  const sessionLast = new Map();
  for (const session of sessions) {
    if (typeof session?.id !== "string" || !(session.steps instanceof Map)) continue;
    let sessionTotal = 0;
    for (const sample of session.steps.values()) {
      const usage = sample.usage;
      const buckets = {
        input: Number.isFinite(usage.inputTokens) ? usage.inputTokens : 0,
        output: Number.isFinite(usage.outputTokens) ? usage.outputTokens : 0,
        cacheRead: Number.isFinite(usage.cacheReadTokens) ? usage.cacheReadTokens : 0,
        cacheWrite: Number.isFinite(usage.cacheWriteTokens) ? usage.cacheWriteTokens : 0
      };
      const total = buckets.input + buckets.output + buckets.cacheRead + buckets.cacheWrite;
      if (total <= 0) continue;
      const key = localDayKey(sample.time);
      let day = days.get(key);
      if (day === undefined) {
        day = {
          date: key,
          input: 0,
          output: 0,
          cacheRead: 0,
          cacheWrite: 0,
          sessions: new Set(),
          models: new Map()
        };
        days.set(key, day);
      }
      day.input += buckets.input;
      day.output += buckets.output;
      day.cacheRead += buckets.cacheRead;
      day.cacheWrite += buckets.cacheWrite;
      day.sessions.add(session.id);
      const modelKey = `${sample.provider ?? "unknown"}/${sample.model ?? "unknown"}`;
      let model = day.models.get(modelKey);
      if (model === undefined) {
        model = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 };
        day.models.set(modelKey, model);
      }
      model.input += buckets.input;
      model.output += buckets.output;
      model.cacheRead += buckets.cacheRead;
      model.cacheWrite += buckets.cacheWrite;
      model.total += total;
      sessionTotal += total;
      if (!sessionFirst.has(session.id)) sessionFirst.set(session.id, sample.time);
      sessionLast.set(session.id, sample.time);
    }
    if (sessionTotal > 0) sessionTotals.set(session.id, sessionTotal);
  }
  const ordered = [...days.values()].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return {
    days: ordered,
    sessionTotals,
    sessionFirst,
    sessionLast
  };
}

/**
 * Pure aggregation core (exported for tests): fold every session's usage into
 * per-day buckets, per-day model shares, and per-session totals.
 * @param sessions - array of { id, events }.
 * @returns the raw aggregate (dates in local calendar order).
 */
export function aggregate(sessions) {
  return bucketSteps(
    sessions.map((session) => ({
      id: session.id,
      steps: Array.isArray(session.events) ? foldSessionEvents(session.events) : new Map()
    }))
  );
}

/**
 * Official DeepSeek off-peak (闲时/低谷) prices in CNY per 1M tokens, from the
 * pricing adjustment effective 2026-08-17. Cache writes are billed at the
 * cache-miss input rate (the official table has no separate cache-write
 * column), so the estimate is slightly conservative. Models without an entry
 * in the table get no cost estimate (cost stays undefined).
 */
const OFFPEAK_PRICE_CNY_PER_M = {
  "deepseek-v4-flash": { cacheHit: 0.05, cacheMiss: 1.5, output: 4.5 },
  "deepseek-v4-pro": { cacheHit: 0.15, cacheMiss: 4.5, output: 13.5 }
};

/** Cost estimate for one model's bucketed usage, or undefined when unpriced. */
function modelCost(modelKey, buckets) {
  const name = modelKey.slice(modelKey.lastIndexOf("/") + 1);
  const price = OFFPEAK_PRICE_CNY_PER_M[name];
  if (price === undefined) return undefined;
  return (
    ((buckets.input + buckets.cacheWrite) / 1e6) * price.cacheMiss
    + (buckets.cacheRead / 1e6) * price.cacheHit
    + (buckets.output / 1e6) * price.output
  );
}

/**
 * Build the wire view from the raw aggregate: summary totals, today, the
 * per-day series (newest first), a per-session drill-down list, and cost
 * estimates at the official off-peak prices.
 * @param aggregateResult - output of {@link aggregate}.
 * @param generatedAt - report timestamp.
 * @param sessionMeta - optional session id -> { cwd, createdAt } metadata.
 * @returns the JSON-serializable report.
 */
export function buildView(aggregateResult, generatedAt, sessionMeta = new Map()) {
  const { days, sessionTotals, sessionFirst, sessionLast } = aggregateResult;
  const today = days.length > 0 ? days[days.length - 1].date : undefined;
  const dayViews = [...days].reverse().map((day) => {
    const models = [...day.models.entries()]
      .map(([model, m]) => ({
        model,
        tokens: m.total,
        input: m.input,
        output: m.output,
        cacheRead: m.cacheRead,
        cacheWrite: m.cacheWrite,
        cost: modelCost(model, m)
      }))
      .sort((a, b) => b.tokens - a.tokens);
    const dayCost = models.reduce((acc, m) => acc + (m.cost ?? 0), 0);
    return {
      date: day.date,
      input: day.input,
      output: day.output,
      cacheRead: day.cacheRead,
      cacheWrite: day.cacheWrite,
      total: day.input + day.output + day.cacheRead + day.cacheWrite,
      sessions: day.sessions.size,
      cost: dayCost,
      models
    };
  });
  const totals = dayViews.reduce(
    (acc, day) => ({
      input: acc.input + day.input,
      output: acc.output + day.output,
      cacheRead: acc.cacheRead + day.cacheRead,
      cacheWrite: acc.cacheWrite + day.cacheWrite,
      cost: acc.cost + day.cost
    }),
    { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, cost: 0 }
  );
  const todayCost = dayViews.length > 0 && dayViews[0].date === today ? dayViews[0].cost : 0;
  const sessions = [...sessionTotals.entries()]
    .map(([sessionId, total]) => ({
      sessionId,
      total,
      createdAt: sessionFirst.get(sessionId),
      lastUsageAt: sessionLast.get(sessionId),
      cwd: sessionMeta.get(sessionId)?.cwd
    }))
    .sort((a, b) => b.total - a.total);
  let timeZone = "local";
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    // keep "local"
  }
  return {
    generatedAt,
    timeZone,
    totals: {
      input: totals.input,
      output: totals.output,
      cacheRead: totals.cacheRead,
      cacheWrite: totals.cacheWrite,
      total: totals.input + totals.output + totals.cacheRead + totals.cacheWrite,
      cost: totals.cost
    },
    today,
    todayCost,
    pricing: {
      basis: "DeepSeek 官方低谷（闲时）价 · 2026-08-17 调价后 · 每百万 tokens · 缓存写入按未命中输入计",
      currency: "CNY",
      unit: "per 1M tokens",
      offPeak: OFFPEAK_PRICE_CNY_PER_M
    },
    days: dayViews,
    sessions
  };
}

/**
 * Cordis plugin body: mount the JSON API route consumed by the web settings UI.
 *
 * Latency model: requests never wait on log I/O. The cache is warmed in the
 * background at activation; every request returns the cached view instantly
 * and, when data may have moved, schedules a debounced background refresh.
 * Live sessions advance by their in-memory event tail; cold artifacts are
 * re-read (with async, parallel decompression) only when their file stat
 * changed. Viewing the stats therefore stays fast no matter how large the
 * logs grow.
 * @param ctx - host plugin context (webServer, sessionPersistence injected).
 */
export function apply(ctx) {
  /** Per-session incremental fold state: { kind, consumed, fileKey, header, steps }. */
  const folds = new Map();
  /** Cached wire view and its pre-serialized JSON; rebuilt only on change. */
  let view = null;
  let viewJson = null;
  /** Single in-flight refresh; concurrent callers share it. */
  let inflight = null;
  /** Timestamp of the last completed refresh (debounce guard). */
  let lastRefreshAt = 0;
  /** TTL cache for the artifact listing (directory scan + first-frame reads). */
  let artifactsCache = { at: 0, list: null };
  const ARTIFACTS_TTL_MS = 30000;
  const REFRESH_DEBOUNCE_MS = 2000;
  const COLD_READ_CONCURRENCY = 6;

  /**
   * Fold every source into the persistent per-session states and rebuild the
   * wire view when anything advanced. Returns the current view.
   */
  const refresh = async () => {
    const persistence = ctx.get("sessionPersistence");
    const live = ctx.get("sessions");
    const liveIds = new Set();
    const sessionMeta = new Map();
    let changed = false;

    // 1) Live in-memory sessions: fold only the appended tail (freshest data,
    //    zero disk I/O).
    if (live !== undefined) {
      try {
        for (const session of live.list()) {
          if (session === undefined || typeof session?.id !== "string" || !Array.isArray(session?.events)) continue;
          liveIds.add(session.id);
          const header = session.header;
          if (header !== undefined) {
            sessionMeta.set(session.id, { cwd: header.cwd, createdAt: header.createdAt });
          }
          let state = folds.get(session.id);
          if (state === undefined || state.kind !== "live") {
            state = { kind: "live", consumed: 0, header: undefined, steps: new Map() };
            folds.set(session.id, state);
            changed = true;
          }
          if (session.events.length > state.consumed) {
            foldRange(state, session.events, state.consumed);
            state.consumed = session.events.length;
            changed = true;
          }
        }
      } catch (error) {
        ctx.logger.warn(`token-stats: live session scan failed: ${String(error)}`);
      }
    }

    // 2) Cold durable artifacts: re-read a file only when its size/mtime
    //    changed since the last fold; parse only usage-relevant lines, and
    //    decompress changed files in parallel off the main thread.
    const known = new Set(liveIds);
    if (persistence !== undefined) {
      try {
        if (artifactsCache.list === null || Date.now() - artifactsCache.at > ARTIFACTS_TTL_MS) {
          artifactsCache = { at: Date.now(), list: await persistence.listArtifacts() };
        }
        const changedArtifacts = [];
        for (const artifact of artifactsCache.list) {
          const id = artifact.header?.id;
          if (typeof id !== "string") continue;
          known.add(id);
          sessionMeta.set(id, { cwd: artifact.header.cwd, createdAt: artifact.header.createdAt });
          if (liveIds.has(id)) continue; // live fold is fresher than the file
          let fileKey;
          try {
            const info = await stat(artifact.path);
            fileKey = `${info.size}:${info.mtimeMs}`;
          } catch {
            continue; // artifact vanished; keep the old fold until it returns
          }
          const state = folds.get(id);
          if (state !== undefined && state.kind === "cold" && state.fileKey === fileKey) continue;
          changedArtifacts.push({ id, path: artifact.path, fileKey });
        }
        if (changedArtifacts.length > 0) {
          await mapLimit(changedArtifacts, COLD_READ_CONCURRENCY, async ({ id, path, fileKey }) => {
            try {
              const text = await decodeSessionArtifactAsync(await readFile(path), path.endsWith(".zstd"));
              const events = await parseLogRelevantAsync(text);
              const next = { kind: "cold", consumed: events.length, fileKey, header: undefined, steps: new Map() };
              foldRange(next, events, 0);
              folds.set(id, next);
              changed = true;
            } catch (error) {
              ctx.logger.warn(`token-stats: reading session ${id} failed: ${String(error)}`);
            }
          });
        }
      } catch (error) {
        ctx.logger.warn(`token-stats: session artifact listing failed: ${String(error)}`);
      }
    }

    // 3) Drop folds for sessions that no longer exist (deleted/archived).
    for (const id of folds.keys()) {
      if (!known.has(id)) {
        folds.delete(id);
        changed = true;
      }
    }

    // 4) Rebuild the wire view only when something advanced.
    if (view === null || changed) {
      const states = [];
      for (const [id, state] of folds) states.push({ id, steps: state.steps });
      view = buildView(bucketSteps(states), Date.now(), sessionMeta);
      viewJson = JSON.stringify(view);
    }
    lastRefreshAt = Date.now();
    return view;
  };

  /** Start one refresh, or join the in-flight one; never overlaps. */
  const refreshOnce = () => {
    if (inflight === null) {
      inflight = refresh();
      inflight.then(
        () => { inflight = null; },
        (error) => {
          inflight = null;
          ctx.logger.warn(`token-stats: refresh failed: ${String(error)}`);
        }
      );
    }
    return inflight;
  };

  /**
   * Request face: serve the cached view immediately; when no view exists yet
   * (first request after boot) await the warm refresh once, then keep serving
   * cached while refreshed data lands in the background.
   */
  const compute = async () => {
    if (view !== null) {
      if (Date.now() - lastRefreshAt >= REFRESH_DEBOUNCE_MS) refreshOnce();
      return view;
    }
    await refreshOnce();
    return view;
  };

  // Background warm-up at activation: by the time the user opens the panel,
  // the fold cache is already built from the cold logs.
  refreshOnce().catch((error) => {
    ctx.logger.warn(`token-stats: warm-up failed: ${String(error)}`);
  });

  ctx.effect(
    () => ctx.webServer.register({
      kind: "exact",
      path: "/api/token-stats",
      handler: async (req, res) => {
        if (req.method !== "GET" && req.method !== "HEAD") {
          res.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
          res.end("method not allowed");
          return;
        }
        try {
          const viewValue = await compute();
          const body = viewJson ?? JSON.stringify(viewValue);
          res.writeHead(200, {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store"
          });
          res.end(req.method === "HEAD" ? undefined : body);
        } catch (error) {
          ctx.logger.warn(`token-stats: /api/token-stats failed: ${String(error)}`);
          res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ error: String(error) }));
        }
      }
    }),
    "token-stats: /api/token-stats"
  );
}
