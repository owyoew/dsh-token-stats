window.__ModuleLoader__.load({
	id: "@dsh-local/token-stats",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		//#region styles
		const css = ".ts_section{color:var(--dsw-alias-label-primary);flex-direction:column;gap:14px;display:flex}.ts_kpis{flex-wrap:wrap;gap:20px;display:flex}.ts_kpi b{color:var(--dsw-alias-label-primary);font-size:22px;font-weight:700;line-height:28px;display:block}.ts_kpi span{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;letter-spacing:.06em}.ts_toolbar{align-items:center;gap:8px;display:flex}.ts_refresh{box-sizing:border-box;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:var(--dsw-alias-fill-l2);border:0;border-radius:14px;padding:0 12px;font:inherit;font-size:12px;line-height:28px}.ts_refresh:hover:not(:disabled){color:var(--dsw-alias-label-primary)}.ts_refresh:disabled{opacity:.5;cursor:default}.ts_hint{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}.ts_cost{align-items:baseline;gap:8px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--dsw-alias-border-l2);display:flex}.ts_costLabel{color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600;line-height:18px}.ts_costValue{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:700;line-height:18px;font-variant-numeric:tabular-nums}.ts_costHint{color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:15px;flex-basis:100%}.ts_chartTitle{color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:600;line-height:16px}.ts_bars{height:190px;display:flex}.ts_weeks{flex:1;min-width:0;display:flex}.ts_week{flex:1;min-width:0;border-left:1px solid var(--dsw-alias-border-l2);flex-direction:column;display:flex}.ts_week.first{border-left:none}.ts_weekLabel{text-align:center;color:var(--dsw-alias-label-tertiary);font-size:9px;line-height:14px;letter-spacing:.04em;flex:none}.ts_weekSlots{flex:1;min-height:0;align-items:flex-end;display:flex}.ts_col{flex:1;min-width:0;height:100%;flex-direction:column;justify-content:flex-end;align-items:center;display:flex}.ts_col.ts_outside{visibility:hidden}.ts_stack{width:72%;border-radius:4px 4px 0 0;flex-direction:column;justify-content:flex-end;min-height:2px;display:flex;overflow:hidden}.ts_seg{width:100%}.ts_placeholder{width:60%;height:2px;border-radius:1px;background:var(--dsw-alias-fill-l2)}.ts_x{text-align:center;color:var(--dsw-alias-label-tertiary);font-size:9px;line-height:14px;padding-top:4px;white-space:nowrap;overflow:hidden}.ts_x.today{color:var(--dsw-alias-label-primary);font-weight:600}.ts_legend{flex-wrap:wrap;gap:10px 14px;display:flex}.ts_leg{align-items:center;gap:5px;font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary);display:inline-flex}.ts_swatch{width:9px;height:9px;border-radius:3px;display:inline-block}.ts_dotGrid{flex-direction:column;gap:4px;display:flex}.ts_dotHead{grid-template-columns:repeat(7,1fr);display:grid}.ts_dotDow{text-align:center;color:var(--dsw-alias-label-tertiary);font-size:9px;line-height:14px}.ts_dotRow{grid-template-columns:repeat(7,1fr);gap:4px 0;display:grid}.ts_dotCell{align-items:center;gap:2px;flex-direction:column;display:flex}.ts_dotCell.ts_dotOutside{visibility:hidden}.ts_dot{box-sizing:border-box;width:18px;height:18px;border-radius:6px;border:1px solid rgba(37,99,235,.35)}.ts_dotToday .ts_dot{border:1px solid var(--dsw-alias-label-primary)}.ts_dotLabel{text-align:center;color:var(--dsw-alias-label-tertiary);font-size:8px;line-height:12px}.ts_table{width:100%;border-collapse:collapse;font-size:12px}.ts_table th{color:var(--dsw-alias-label-tertiary);font-size:10px;font-weight:600;letter-spacing:.06em;text-align:right;padding:0 8px 6px 0;border-bottom:1px solid var(--dsw-alias-border-l2)}.ts_table th:first-child,.ts_table td:first-child{text-align:left}.ts_table td{padding:6px 8px 6px 0;border-bottom:1px solid var(--dsw-alias-border-l2);text-align:right;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-secondary)}.ts_table tr:last-child td{border-bottom:none}.ts_table td.date{color:var(--dsw-alias-label-primary);font-weight:600}.ts_table td.total{color:var(--dsw-alias-label-primary);font-weight:700}.ts_bar{height:3px;border-radius:99px;background:var(--dsw-alias-fill-l2);min-width:2px}.ts_error{color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:18px}.ts_empty{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}";
		const tagId = "@dsh-local/token-stats/section.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@dsh-local/token-stats";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region locales
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"nav": "Token 用量",
			"title": "每日 Token 消耗",
			"subtitle": "按本地时区聚合所有会话的提供方用量，同一 (轮次, 步骤) 只计最后一次样本",
			"today": "今日",
			"yesterday": "昨日",
			"total": "累计",
			"sessions": "会话",
			"refresh": "刷新",
			"generatedAt": "生成于 {time}",
			"chart.week": "近 30 天 · 按周分组 · 按模型分色（空 = 没有使用）",
			"chart.dots": "近 30 天用量 · 颜色越深用量越多",
			"dow": ["一", "二", "三", "四", "五", "六", "日"],
			"cost.label": "估算费用",
			"cost.today": "今日",
			"cost.total": "累计",
			"cost.hint": "按 DeepSeek 官网低谷（闲时）价 · 2026-08-17 调价后 · 每百万 tokens · 缓存写入按未命中输入计",
			"col.date": "日期",
			"col.total": "总量",
			"col.input": "输入",
			"col.output": "输出",
			"col.cache": "缓存",
			"col.sessions": "会话",
			"loading": "统计中…",
			"error": "加载失败：{message}",
			"empty": "还没有可统计的用量记录。"
		};
		/** English dictionary, key-identical to the Chinese source of truth. */
		const en = {
			"nav": "Token usage",
			"title": "Daily token consumption",
			"subtitle": "Provider-reported usage across all sessions, bucketed by local day; one (turn, step) counts only its last sample",
			"today": "Today",
			"yesterday": "Yesterday",
			"total": "All time",
			"sessions": "sessions",
			"refresh": "Refresh",
			"generatedAt": "Generated {time}",
			"chart.week": "Last 30 days · weekly · by model (empty = no usage)",
			"chart.dots": "Last 30 days · deeper blue = more usage",
			"dow": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			"cost.label": "Estimated cost",
			"cost.today": "Today",
			"cost.total": "All time",
			"cost.hint": "DeepSeek official off-peak prices · post 2026-08-17 adjustment · per 1M tokens · cache writes billed as cache miss",
			"col.date": "Date",
			"col.total": "Total",
			"col.input": "Input",
			"col.output": "Output",
			"col.cache": "Cache",
			"col.sessions": "Sessions",
			"loading": "Aggregating…",
			"error": "Failed to load: {message}",
			"empty": "No usage records yet."
		};
		//#endregion
		//#region section
		/** Locale namespace for this plugin's copy. */
		const NS = "token-stats";
		/** Rows shown in the section table (newest first). */
		const MAX_ROWS = 31;
		/** Compact number formatting (k / M). */
		function fmt(n) {
			if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
			if (n >= 1e3) return (n / 1e3).toFixed(1) + "k";
			return String(n);
		}
		/** Full number formatting for titles. */
		function fmtFull(n) {
			return Number(n).toLocaleString("en-US");
		}
		/** Money formatting: ¥ with two decimals (omits trailing zeros for whole amounts). */
		function fmtMoney(n) {
			const value = Number(n);
			if (!Number.isFinite(value)) return "—";
			return "¥" + (Math.abs(value) >= 100 ? value.toFixed(2) : (Math.round(value * 100) / 100).toString());
		}
		/** Local wall-clock label for a report generation timestamp. */
		function clock(ms) {
			const d = new Date(ms);
			const hh = String(d.getHours()).padStart(2, "0");
			const mm = String(d.getMinutes()).padStart(2, "0");
			return `${d.getMonth() + 1}/${d.getDate()} ${hh}:${mm}`;
		}
		//#region chart
		/** Blue-dominant categorical palette for model segments (reads on light and dark themes). */
		const MODEL_COLORS = ["#1D4ED8", "#2563EB", "#3B82F6", "#60A5FA", "#0EA5E9", "#38BDF8", "#6366F1", "#1E40AF"];
		/** Stable model-key -> palette index, so one model always keeps one color. */
		function modelColor(key) {
			let hash = 0;
			for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
			return MODEL_COLORS[hash % MODEL_COLORS.length];
		}
		/** Short display name: strip the provider prefix (opencode-go/deepseek-v4-flash -> deepseek-v4-flash). */
		function shortModel(key) {
			const slash = key.lastIndexOf("/");
			return slash === -1 ? key : key.slice(slash + 1);
		}
		/** Pixel height of the bar field (labels live below it inside each column). */
		const BAR_HEIGHT = 150;
		/** Days covered by the intensity dot chart (also the bar-chart window). */
		const DOT_DAYS = 30;
		/** Base blue for the intensity dot chart (#2563EB). */
		const DOT_RGB = [37, 99, 235];
		/** Date-key helpers (local calendar). */
		function dayKeyOf(date) {
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
		}
		function parseDayKey(key) {
			const parts = key.split("-").map(Number);
			return new Date(parts[0], parts[1] - 1, parts[2]);
		}
		function addDays(date, n) {
			const next = new Date(date);
			next.setDate(next.getDate() + n);
			return next;
		}
		function startOfDay(date) {
			const next = new Date(date);
			next.setHours(0, 0, 0, 0);
			return next;
		}
		/** Monday-based weekday index (Mon = 0 ... Sun = 6). */
		function mondayIndex(date) {
			return (date.getDay() + 6) % 7;
		}
		/**
		* Stacked weekly bar chart: the trailing 30 days grouped into Monday-start
		* weeks, one column per day. Days with usage carry a stacked bar whose
		* segments are colored by model (blue-dominant palette); days without
		* usage stay empty.
		* @param props - days (newest first), today's date key, locale translator.
		* @returns the chart element tree.
		*/
		function WeekBars({ days, today, t }) {
			if (days.length === 0) return null;
			const usageByDate = new Map(days.map((day) => [day.date, day]));
			const end = startOfDay(parseDayKey(today));
			const start = addDays(end, -(DOT_DAYS - 1));
			const gridStart = addDays(start, -mondayIndex(start));
			const weekCount = Math.ceil((DOT_DAYS + mondayIndex(start)) / 7);
			const weeks = [];
			for (let w = 0; w < weekCount; w++) {
				const slots = [];
				for (let i = 0; i < 7; i++) {
					const date = addDays(gridStart, w * 7 + i);
					const key = dayKeyOf(date);
					const inWindow = date >= start && date <= end;
					slots.push({ key, date, inWindow, day: usageByDate.get(key) });
				}
				weeks.push(slots);
			}
			const maxTotal = Math.max(1, ...days.map((day) => day.total));
			const legendModels = [];
			const seen = new Set();
			for (const day of days) {
				for (const model of day.models) {
					if (!seen.has(model.model)) {
						seen.add(model.model);
						legendModels.push(model.model);
					}
				}
			}
			return (0, react_jsx_runtime.jsxs)("div", { className: "ts_chart", children: [
				(0, react_jsx_runtime.jsx)("div", { className: "ts_chartTitle", children: t("chart.week") }),
				(0, react_jsx_runtime.jsx)("div", { className: "ts_bars", children: (0, react_jsx_runtime.jsx)("div", { className: "ts_weeks", children: weeks.map((slots, w) => (0, react_jsx_runtime.jsxs)("div", {
					className: "ts_week" + (w === 0 ? " first" : ""),
					children: [
						(0, react_jsx_runtime.jsx)("div", { className: "ts_weekLabel", children: dayKeyOf(slots[0].date).slice(5) }),
						(0, react_jsx_runtime.jsx)("div", { className: "ts_weekSlots", children: slots.map((slot) => {
							if (!slot.inWindow) return (0, react_jsx_runtime.jsx)("div", { className: "ts_col ts_outside" }, slot.key);
							if (slot.day === undefined) return (0, react_jsx_runtime.jsxs)("div", { className: "ts_col ts_empty", children: [
								(0, react_jsx_runtime.jsx)("div", { className: "ts_placeholder" }),
								(0, react_jsx_runtime.jsx)("div", { className: "ts_x", children: String(slot.date.getDate()) })
							] }, slot.key);
							const stackHeight = Math.max(2, Math.round((slot.day.total / maxTotal) * BAR_HEIGHT));
							return (0, react_jsx_runtime.jsxs)("div", {
								className: "ts_col",
								title: `${slot.key} · ${fmtFull(slot.day.total)} tokens`,
								children: [
									(0, react_jsx_runtime.jsx)("div", { className: "ts_stack", style: { height: stackHeight + "px" }, children: slot.day.models.map((model) => (0, react_jsx_runtime.jsx)("div", {
										className: "ts_seg",
										style: { height: Math.round((model.tokens / slot.day.total) * 100) + "%", background: modelColor(model.model) },
										title: `${slot.key} · ${shortModel(model.model)} · ${fmtFull(model.tokens)} tokens`
									}, model.model)) }),
									(0, react_jsx_runtime.jsx)("div", { className: "ts_x" + (slot.key === today ? " today" : ""), children: String(slot.date.getDate()) })
								]
							}, slot.key);
						}) })
					]
				}, w)) }) }),
				(0, react_jsx_runtime.jsx)("div", { className: "ts_legend", children: legendModels.map((model) => (0, react_jsx_runtime.jsxs)("span", {
					className: "ts_leg",
					children: [(0, react_jsx_runtime.jsx)("i", { className: "ts_swatch", style: { background: modelColor(model) } }), shortModel(model)]
				}, model)) })
			] });
		}
		/**
		* 30-day intensity dot chart: a week-aligned calendar grid, one dot per
		* day, fill depth proportional to that day's total tokens (deeper blue =
		* more usage). No model distinction.
		* @param props - days (newest first), today's date key, locale translator.
		* @returns the chart element tree.
		*/
		function DotChart({ days, today, t }) {
			const usageByDate = new Map(days.map((day) => [day.date, day]));
			const end = startOfDay(parseDayKey(today));
			const start = addDays(end, -(DOT_DAYS - 1));
			const gridStart = addDays(start, -mondayIndex(start));
			const maxTotal = Math.max(1, ...days.map((day) => day.total));
			const rows = [];
			const rowCount = Math.ceil((DOT_DAYS + mondayIndex(start)) / 7);
			for (let r = 0; r < rowCount; r++) {
				const cells = [];
				for (let i = 0; i < 7; i++) {
					const date = addDays(gridStart, r * 7 + i);
					const key = dayKeyOf(date);
					const inWindow = date >= start && date <= end;
					cells.push({ key, date, inWindow, day: usageByDate.get(key) });
				}
				rows.push(cells);
			}
			return (0, react_jsx_runtime.jsxs)("div", { className: "ts_chart", children: [
				(0, react_jsx_runtime.jsx)("div", { className: "ts_chartTitle", children: t("chart.dots") }),
				(0, react_jsx_runtime.jsx)("div", { className: "ts_dotGrid", children: [
					(0, react_jsx_runtime.jsx)("div", { className: "ts_dotHead", children: t("dow").map((label, i) => (0, react_jsx_runtime.jsx)("div", { className: "ts_dotDow", children: label }, i)) }),
					rows.map((row, r) => (0, react_jsx_runtime.jsx)("div", { className: "ts_dotRow", children: row.map((cell) => {
						if (!cell.inWindow) return (0, react_jsx_runtime.jsx)("div", { className: "ts_dotCell ts_dotOutside" }, cell.key);
						const ratio = cell.day === undefined ? 0 : cell.day.total / maxTotal;
						const alpha = ratio <= 0 ? 0.06 : 0.1 + 0.9 * ratio;
						const fill = `rgba(${DOT_RGB[0]},${DOT_RGB[1]},${DOT_RGB[2]},${alpha.toFixed(3)})`;
						return (0, react_jsx_runtime.jsxs)("div", {
							className: "ts_dotCell" + (cell.key === today ? " ts_dotToday" : ""),
							title: cell.day === undefined ? `${cell.key} · 0 tokens` : `${cell.key} · ${fmtFull(cell.day.total)} tokens`,
							children: [
								(0, react_jsx_runtime.jsx)("div", { className: "ts_dot", style: { background: fill } }),
								(0, react_jsx_runtime.jsx)("div", { className: "ts_dotLabel", children: String(cell.date.getDate()) })
							]
						}, cell.key);
					}) }, r))
				] })
			] });
		}
		//#endregion
		/**
		* Settings-section content: fetch the host aggregate once on mount and
		* render today/yesterday/total KPIs plus a compact per-day table.
		* @param props - slot props (t translator, close callback).
		* @returns the section element tree.
		*/
		function TokenStatsSection({ t }) {
			const [state, setState] = react.useState({ status: "loading", data: null, error: null });
			const load = react.useCallback(() => {
				let cancelled = false;
				// Keep the previous data visible while refreshing (no blank flash);
				// only first load (data === null) shows the loading state.
				setState((prev) => ({ status: prev.data === null ? "loading" : "refreshing", data: prev.data, error: null }));
				fetch("/api/token-stats", { headers: { accept: "application/json" } })
					.then((res) => {
						if (!res.ok) throw new Error("HTTP " + res.status);
						return res.json();
					})
					.then((data) => {
						if (!cancelled) setState({ status: "ready", data, error: null });
					})
					.catch((error) => {
						if (!cancelled) setState((prev) => ({ status: prev.data === null ? "error" : "ready", data: prev.data, error: error instanceof Error ? error.message : String(error) }));
					});
				return () => { cancelled = true; };
			}, []);
			react.useEffect(() => load(), [load]);
			if (state.status === "loading") {
				return (0, react_jsx_runtime.jsx)("div", { className: "ts_section", children: (0, react_jsx_runtime.jsx)("div", { className: "ts_empty", children: t("loading") }) });
			}
			if (state.status === "error" && state.data === null) {
				return (0, react_jsx_runtime.jsxs)("div", { className: "ts_section", children: [
					(0, react_jsx_runtime.jsx)("div", { className: "ts_error", children: t("error", { message: state.error }) }),
					(0, react_jsx_runtime.jsx)("button", { type: "button", className: "ts_refresh", onClick: load, children: t("refresh") })
				] });
			}
			const data = state.data;
			const today = data.days.find((d) => d.date === data.today);
			const yesterday = data.days.find((d, i, arr) => arr[i + 1] !== undefined && arr[i + 1].date === data.today && d.date !== data.today) ?? data.days[1];
			const rows = data.days.slice(0, MAX_ROWS);
			const maxTotal = data.totals.total > 0 ? data.totals.total : 1;
			return (0, react_jsx_runtime.jsxs)("div", { className: "ts_section", children: [
				(0, react_jsx_runtime.jsx)("h2", { style: { margin: 0, fontSize: 16, fontWeight: 600, lineHeight: "24px" }, children: t("title") }),
				(0, react_jsx_runtime.jsx)("div", { className: "ts_hint", children: t("subtitle") }),
				(0, react_jsx_runtime.jsxs)("div", { className: "ts_kpis", children: [
					(0, react_jsx_runtime.jsxs)("div", { className: "ts_kpi", children: [(0, react_jsx_runtime.jsx)("b", { children: today === undefined ? "—" : fmtFull(today.total) }), (0, react_jsx_runtime.jsx)("span", { children: t("today") })] }),
					(0, react_jsx_runtime.jsxs)("div", { className: "ts_kpi", children: [(0, react_jsx_runtime.jsx)("b", { children: yesterday === undefined ? "—" : fmtFull(yesterday.total) }), (0, react_jsx_runtime.jsx)("span", { children: t("yesterday") })] }),
					(0, react_jsx_runtime.jsxs)("div", { className: "ts_kpi", children: [(0, react_jsx_runtime.jsx)("b", { children: fmtFull(data.totals.total) }), (0, react_jsx_runtime.jsx)("span", { children: t("total") })] }),
					(0, react_jsx_runtime.jsxs)("div", { className: "ts_kpi", children: [(0, react_jsx_runtime.jsx)("b", { children: String(data.sessions.length) }), (0, react_jsx_runtime.jsx)("span", { children: t("sessions") })] })
				] }),
				(0, react_jsx_runtime.jsxs)("div", { className: "ts_toolbar", children: [
					(0, react_jsx_runtime.jsx)("button", { type: "button", className: "ts_refresh", disabled: state.status === "refreshing", onClick: load, children: t("refresh") }),
					(0, react_jsx_runtime.jsx)("div", { className: "ts_hint", children: t("generatedAt", { time: clock(data.generatedAt) }) })
				] }),
				rows.length > 0 ? (0, react_jsx_runtime.jsx)(WeekBars, { days: data.days, today: data.today, t }) : null,
				rows.length > 0 ? (0, react_jsx_runtime.jsx)(DotChart, { days: data.days, today: data.today, t }) : null,
				rows.length === 0 ? (0, react_jsx_runtime.jsx)("div", { className: "ts_empty", children: t("empty") })
					: (0, react_jsx_runtime.jsxs)("table", { className: "ts_table", children: [
						(0, react_jsx_runtime.jsx)("thead", { children: (0, react_jsx_runtime.jsx)("tr", { children: [
							(0, react_jsx_runtime.jsx)("th", { children: t("col.date") }),
							(0, react_jsx_runtime.jsx)("th", { style: { width: "26%" }, children: "" }),
							(0, react_jsx_runtime.jsx)("th", { children: t("col.total") }),
							(0, react_jsx_runtime.jsx)("th", { children: t("col.input") }),
							(0, react_jsx_runtime.jsx)("th", { children: t("col.output") }),
							(0, react_jsx_runtime.jsx)("th", { children: t("col.cache") }),
							(0, react_jsx_runtime.jsx)("th", { children: t("col.sessions") })
						] }) }),
						(0, react_jsx_runtime.jsx)("tbody", { children: rows.map((row) => (0, react_jsx_runtime.jsxs)("tr", {
							children: [
								(0, react_jsx_runtime.jsx)("td", { className: "date", children: row.date + (row.date === data.today ? " · " + t("today") : "") }),
								(0, react_jsx_runtime.jsx)("td", { children: (0, react_jsx_runtime.jsx)("div", { className: "ts_bar", style: { width: Math.max(2, Math.round((row.total / maxTotal) * 100)) + "%" } }) }),
								(0, react_jsx_runtime.jsx)("td", { className: "total", title: fmtFull(row.total), children: fmt(row.total) }),
								(0, react_jsx_runtime.jsx)("td", { title: fmtFull(row.input), children: fmt(row.input) }),
								(0, react_jsx_runtime.jsx)("td", { title: fmtFull(row.output), children: fmt(row.output) }),
								(0, react_jsx_runtime.jsx)("td", { title: fmtFull(row.cacheRead + row.cacheWrite), children: fmt(row.cacheRead + row.cacheWrite) }),
								(0, react_jsx_runtime.jsx)("td", { children: String(row.sessions) })
							]
						}, row.date)) })
					] }),
				(0, react_jsx_runtime.jsxs)("div", { className: "ts_cost", children: [
					(0, react_jsx_runtime.jsx)("span", { className: "ts_costLabel", children: t("cost.label") }),
					(0, react_jsx_runtime.jsx)("span", { className: "ts_costValue", children: `${t("cost.today")} ${fmtMoney(data.todayCost)}` }),
					(0, react_jsx_runtime.jsx)("span", { className: "ts_costValue", children: `${t("cost.total")} ${fmtMoney(data.totals.cost)}` }),
					(0, react_jsx_runtime.jsx)("span", { className: "ts_costHint", children: t("cost.hint") })
				] })
			] });
		}
		//#endregion
		//#region index
		/** Required client services: slot registration plus the locale translator. */
		const inject = ["slots", "locale"];
		/**
		* Client plugin body: register the dictionaries and the settings section.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			const t = ctx.locale.bind(NS);
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "token-stats: dictionaries");
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "token-stats",
				order: 30,
				locale: NS,
				label: () => t("nav")
			}, TokenStatsSection));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
