import { useEffect, useMemo, useState } from "react";
import Plot from "./Plot";
import { ANNUAL, group, loadData, median } from "./data";

const COLORS = ["#1463ff", "#0ea5e9", "#2563eb", "#60a5fa", "#1d4ed8"];
const PIE_COLORS = ["#0b2c5f", "#1463ff", "#7dd3fc"];
const SYMBOLS = { "LCD (LED)": "circle", LCD: "square", OLED: "diamond" };
const BANDS = ["1. ≤43 inches", "2. 44–55 inches", "3. 56–65 inches", "4. >65 inches"];
const SIZE_OPTIONS = [["", "Any size"], ...BANDS.map((band) => [band, band.replace(/^\d\. /, "")])];
const STAR_OPTIONS = [[1, "Any rating"], [4, "4+ stars"], [5, "5+ stars"], [6, "6+ stars"], [7, "7+ stars"]];
const INITIAL_FILTERS = { brand: "", technology: "", sizeBand: "", stars: 1 };
const number = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 1 });

function layout(overrides = {}) {
  return {
    autosize: true,
    margin: { l: 70, r: 24, t: 20, b: 62 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { family: "Fira Sans, sans-serif", color: "#334e68", size: 13 },
    hoverlabel: { bgcolor: "#102a43", bordercolor: "#d9e8ff", font: { color: "#ffffff" } },
    xaxis: { gridcolor: "#e4edf7", zerolinecolor: "#cbd9e8", title: { standoff: 16 } },
    yaxis: { gridcolor: "#e4edf7", zerolinecolor: "#cbd9e8", title: { standoff: 16 } },
    legend: { orientation: "h", y: 1.08, x: 0 },
    ...overrides,
  };
}

function scatterSpec(rows) {
  return {
    data: Object.entries(group(rows, "Screen_Tech")).map(([technology, records], index) => ({
      type: "scattergl",
      mode: "markers",
      name: technology,
      x: records.map((row) => row["Screen Size (inches)"]),
      y: records.map((row) => row[ANNUAL]),
      customdata: records.map((row) => [row.Brand_Reg, row.Model_No, row.Star2]),
      marker: { color: COLORS[index], symbol: SYMBOLS[technology], size: 7, opacity: 0.62 },
      hovertemplate: "%{customdata[0]} %{customdata[1]}<br>%{x:.1f} inches<br>%{y:.0f} kWh/year<br>%{customdata[2]:.1f} stars<extra>%{fullData.name}</extra>",
    })),
    layout: layout({
      xaxis: { title: "Screen size (inches)", gridcolor: "#e4edf7" },
      yaxis: { title: "Annual energy (kWh/year)", gridcolor: "#e4edf7", rangemode: "tozero" },
    }),
  };
}

function pieSpec(rows) {
  const groups = group(rows, "Screen_Tech");
  const labels = Object.keys(groups);
  return {
    data: [{
      type: "pie",
      labels,
      values: labels.map((label) => groups[label].length),
      textinfo: "label+percent",
      textposition: "outside",
      textfont: { color: "#102a43", size: 13 },
      marker: { colors: PIE_COLORS, line: { color: "#ffffff", width: 4 } },
      hovertemplate: "%{label}<br>%{value:,} models<br>%{percent}<extra></extra>",
    }],
    layout: layout({ margin: { l: 36, r: 36, t: 30, b: 30 }, showlegend: false }),
  };
}

function bandSpec(rows) {
  const groups = group(rows, "Screen Size Band");
  const active = BANDS.filter((band) => groups[band]?.length);
  return {
    data: [{
      type: "bar",
      x: active.map((band) => band.replace(/^\d\. /, "")),
      y: active.map((band) => median(groups[band].map((row) => row[ANNUAL]))),
      customdata: active.map((band) => groups[band].length),
      marker: { color: COLORS[0] },
      texttemplate: "%{y:.0f}",
      textposition: "outside",
      cliponaxis: false,
      hovertemplate: "%{x}<br>Median %{y:.0f} kWh/year<br>%{customdata:,} models<extra></extra>",
    }],
    layout: layout({
      margin: { l: 64, r: 18, t: 34, b: 72 },
      xaxis: { title: "Screen-size band", gridcolor: "#e4edf7" },
      yaxis: { title: "Median annual energy (kWh/year)", gridcolor: "#e4edf7", rangemode: "tozero" },
    }),
  };
}

function brandSpec(rows) {
  const brands = Object.entries(group(rows, "Brand_Reg"))
    .map(([brand, records]) => ({ brand, count: records.length, energy: median(records.map((row) => row[ANNUAL])) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)
    .sort((a, b) => a.energy - b.energy);
  return {
    data: [{
      type: "bar",
      orientation: "h",
      x: brands.map((brand) => brand.energy),
      y: brands.map((brand) => brand.brand),
      customdata: brands.map((brand) => brand.count),
      marker: { color: brands.map((brand) => brand.energy), colorscale: [[0, COLORS[0]], [1, COLORS[1]]], showscale: false },
      hovertemplate: "%{y}<br>Median %{x:.0f} kWh/year<br>%{customdata:,} models<extra></extra>",
    }],
    layout: layout({
      margin: { l: 150, r: 24, t: 20, b: 62 },
      xaxis: { title: "Median annual energy (kWh/year)", gridcolor: "#e4edf7", rangemode: "tozero" },
      yaxis: { automargin: true, gridcolor: "rgba(0,0,0,0)" },
    }),
  };
}

function standbySpec(rows, standby) {
  const keys = new Set(rows.map((row) => `${row.Brand_Reg}\u0000${row.Model_No}\u0000${row.Screen_Tech}`));
  const values = standby
    .filter((row) => keys.has(`${row.Brand_Reg}\u0000${row.Model_No}\u0000${row.Screen_Tech}`))
    .map((row) => row["Passive Standby Power (W)"]);
  return {
    data: [{
      type: "histogram",
      x: values,
      nbinsx: 24,
      marker: { color: COLORS[1], line: { color: "#ffffff", width: 1 } },
      hovertemplate: "%{x:.2f} W<br>%{y:,} models<extra></extra>",
    }],
    layout: layout({
      xaxis: { title: "Passive standby power (W)", gridcolor: "#e4edf7", rangemode: "tozero" },
      yaxis: { title: "Model count", gridcolor: "#e4edf7", rangemode: "tozero" },
    }),
    empty: values.length === 0,
  };
}

function threeDimensionalSpec(rows) {
  const sample = rows.length > 1400
    ? rows.filter((_, index) => index % Math.ceil(rows.length / 1400) === 0)
    : rows;
  return {
    data: Object.entries(group(sample, "Screen_Tech")).map(([technology, records], index) => ({
      type: "scatter3d",
      mode: "markers",
      name: technology,
      x: records.map((row) => row["Screen Size (inches)"]),
      y: records.map((row) => row[ANNUAL]),
      z: records.map((row) => row["Star Rating Index"]),
      text: records.map((row) => `${row.Brand_Reg} ${row.Model_No}`),
      marker: { size: 3, color: COLORS[index], opacity: 0.68, symbol: SYMBOLS[technology] },
      hovertemplate: "%{text}<br>%{x:.1f} inches<br>%{y:.0f} kWh/year<br>Index %{z:.2f}<extra>%{fullData.name}</extra>",
    })),
    layout: layout({
      margin: { l: 0, r: 0, t: 8, b: 0 },
      scene: {
        bgcolor: "rgba(0,0,0,0)",
        xaxis: { title: "Size (in)", gridcolor: "#d9e5f2", backgroundcolor: "#f7faff" },
        yaxis: { title: "Energy", gridcolor: "#d9e5f2", backgroundcolor: "#f7faff" },
        zaxis: { title: "Star index", gridcolor: "#d9e5f2", backgroundcolor: "#f7faff" },
      },
    }),
  };
}

function ChartPanel({ index, title, spec, label, wide = false, large = false }) {
  return (
    <article className={`panel chart-panel${wide ? " panel-wide" : ""}`} data-chart={index}>
      <div className="panel-heading">
        <div><p className="chart-number">Analysis {index}</p><h2>{title}</h2></div>
      </div>
      {spec.empty
        ? <p className="empty-state">No records match these filters.</p>
        : <Plot {...spec} label={label} className={`chart${large ? " chart-large" : ""}`} />}
    </article>
  );
}

function Filters({ filters, setFilters, brands, technologies }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  return (
    <section className="filters" id="overview" aria-labelledby="filters-title">
      <div className="section-heading">
        <div><p className="section-label">01 · Filters</p><h2 id="filters-title">TV selection</h2></div>
        <button type="button" onClick={() => setFilters(INITIAL_FILTERS)}>Reset filters</button>
      </div>
      <div className="filter-grid">
        <label htmlFor="brand-filter">Brand
          <select id="brand-filter" value={filters.brand} onChange={(event) => update("brand", event.target.value)}>
            <option value="">All brands</option>
            {brands.map((brand) => <option key={brand}>{brand}</option>)}
          </select>
        </label>
        <label htmlFor="tech-filter">Screen technology
          <select id="tech-filter" value={filters.technology} onChange={(event) => update("technology", event.target.value)}>
            <option value="">All technologies</option>
            {technologies.map((technology) => <option key={technology}>{technology}</option>)}
          </select>
        </label>
        <fieldset className="size-filter">
          <legend>Screen size</legend>
          <div className="size-options">
            {SIZE_OPTIONS.map(([value, label]) => <button key={label} type="button" aria-pressed={filters.sizeBand === value} onClick={() => update("sizeBand", value)}>{label}</button>)}
          </div>
        </fieldset>
        <fieldset className="star-filter">
          <legend>Minimum star rating</legend>
          <div className="star-options">
            {STAR_OPTIONS.map(([value, label]) => <button key={value} type="button" aria-pressed={filters.stars === value} onClick={() => update("stars", value)}>{label}</button>)}
          </div>
        </fieldset>
      </div>
    </section>
  );
}

function Kpis({ rows }) {
  const averageStars = rows.length ? rows.reduce((total, row) => total + row.Star2, 0) / rows.length : 0;
  const values = [
    ["Models", number.format(rows.length), ""],
    ["Median annual energy", rows.length ? number.format(median(rows.map((row) => row[ANNUAL]))) : "—", "kWh/year"],
    ["Average star rating", rows.length ? number.format(averageStars) : "—", "stars"],
    ["Technologies", new Set(rows.map((row) => row.Screen_Tech)).size, ""],
  ];
  return (
    <section className="kpis" aria-label="Filtered summary">
      {values.map(([label, value, unit], index) => (
        <article key={label} data-kpi={index + 1}><span>{label}</span><strong>{value}</strong>{unit && <small>{unit}</small>}<i aria-hidden="true" /></article>
      ))}
    </section>
  );
}

function ModelTable({ rows }) {
  const visible = [...rows].sort((a, b) => a[ANNUAL] - b[ANNUAL]).slice(0, 50);
  return (
    <section className="panel model-panel" id="models" aria-labelledby="models-title">
      <div className="panel-heading">
        <div><p className="chart-number">05 · Model comparison</p><h2 id="models-title">TVs by annual energy consumption</h2></div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Brand</th><th>Model</th><th>Technology</th><th>Size</th><th>Annual energy (kWh/year)</th><th>Stars</th></tr></thead>
          <tbody>{visible.map((row) => (
            <tr key={`${row.Brand_Reg}-${row.Model_No}-${row["Registration Number"]}`}>
              <td>{row.Brand_Reg}</td><td>{row.Model_No}</td><td>{row.Screen_Tech}</td>
              <td>{number.format(row["Screen Size (inches)"])} in</td>
              <td>{number.format(row[ANNUAL])}</td><td>{number.format(row.Star2)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <p className="table-note">{rows.length ? `Showing ${Math.min(rows.length, 50)} of ${number.format(rows.length)} filtered models.` : "No models match these filters."}</p>
    </section>
  );
}

function Dashboard({ cleaned, standby }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const brands = useMemo(() => [...new Set(cleaned.map((row) => row.Brand_Reg))].sort(), [cleaned]);
  const technologies = useMemo(() => [...new Set(cleaned.map((row) => row.Screen_Tech))].sort(), [cleaned]);
  const rows = useMemo(() => cleaned.filter((row) =>
    (!filters.brand || row.Brand_Reg === filters.brand)
    && (!filters.technology || row.Screen_Tech === filters.technology)
    && (!filters.sizeBand || row["Screen Size Band"] === filters.sizeBand)
    && row.Star2 >= filters.stars
  ), [cleaned, filters]);

  return <div className="dashboard-data">
    <Filters {...{ filters, setFilters, brands, technologies }} />
    <p className="sr-only" aria-live="polite">{number.format(rows.length)} models match the filters.</p>
    <Kpis rows={rows} />
    {rows.length ? <section id="insights" aria-label="Energy analysis">
      <section className="story-chapter" aria-labelledby="chapter-size">
        <div className="chapter-heading"><span>02</span><div><h2 id="chapter-size">Screen size and energy consumption</h2></div></div>
        <div className="chart-grid">
          <ChartPanel index="01" title="Screen size vs annual energy" spec={scatterSpec(rows)} label="Scatter plot of screen size and annual energy by screen technology" wide large />
          <ChartPanel index="02" title="Median annual energy by screen size" spec={bandSpec(rows)} label="Bar chart comparing median annual energy by screen-size band" wide />
        </div>
      </section>
      <section className="story-chapter" aria-labelledby="chapter-tech">
        <div className="chapter-heading"><span>03</span><div><h2 id="chapter-tech">Screen technology and standby power</h2></div></div>
        <div className="chart-grid">
          <ChartPanel index="03" title="Screen technology share" spec={pieSpec(rows)} label="Pie chart showing model share by screen technology" />
          <ChartPanel index="04" title="Standby power distribution" spec={standbySpec(rows, standby)} label="Histogram of passive standby power in watts" />
        </div>
      </section>
      <section className="story-chapter" aria-labelledby="chapter-compare">
        <div className="chapter-heading"><span>04</span><div><h2 id="chapter-compare">Brand comparison and energy efficiency</h2></div></div>
        <div className="chart-grid">
          <ChartPanel index="05" title="Median annual energy by brand" spec={brandSpec(rows)} label="Horizontal bar chart comparing median annual energy of the 12 brands with the most models in the filtered data" wide large />
          <ChartPanel index="06" title="Screen size, annual energy and star rating index" spec={threeDimensionalSpec(rows)} label="Three-dimensional scatter plot of screen size, annual energy and star rating index" wide large />
        </div>
      </section>
    </section> : <section className="panel empty-state"><h2>No matching models</h2><p>Adjust or reset the filters to restore results.</p></section>}
    <ModelTable rows={rows} />
  </div>;
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setData(null);
    setError("");
    loadData(controller.signal).then(setData).catch((reason) => {
      if (reason.name !== "AbortError") setError(reason.message);
    });
    return () => controller.abort();
  }, [retry]);

  return <div className="app-shell">
    <a className="skip-link" href="#main">Skip to explorer</a>
    <div className="workspace">
    <header className="site-header dashboard-header">
      <div className="topbar">
        <a className="topbar-brand" href="#overview" aria-label="TV Energy home"><span className="brand-mark" aria-hidden="true">TV</span><span><strong>TV Energy</strong><small>Australian TV analysis</small></span></a>
        <nav aria-label="Dashboard sections"><a href="#overview">Filters</a><a href="#insights">Analysis</a><a href="#models">Models</a><a href="#methodology">Method</a></nav>
        <div className="snapshot-badge"><span aria-hidden="true" />Snapshot · 04 Oct 2026</div>
      </div>
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Australian television market</p>
          <h1>Australian TV <span>Energy Explorer</span></h1>
          <p className="lede">Energy consumption across screen sizes, display technologies and brands in the Australian television market.</p>
          <a className="hero-action" href="#overview">Explore data <span aria-hidden="true">↓</span></a>
        </div>
        <aside className="hero-card" aria-label="Study scope">
          <p className="hero-card-label">Study scope</p>
          <ol><li><span>1</span>Screen size</li><li><span>2</span>Technology and standby power</li><li><span>3</span>Brands and efficiency</li></ol>
          <p>4,839 registrations · Australia · 04 Oct 2026</p>
        </aside>
      </div>
    </header>
    <main id="main">
      {!data && !error && <section className="status-panel" aria-live="polite"><span className="spinner" aria-hidden="true" /><p>Loading television data…</p></section>}
      {error && <section className="status-panel error-panel" role="alert"><h2>Dashboard data could not be loaded</h2><p>{error}</p><button type="button" onClick={() => setRetry((value) => value + 1)}>Retry</button></section>}
      {data && <Dashboard {...data} />}
      <section className="method" id="methodology" aria-labelledby="method-title">
        <p className="section-label">Methodology</p>
        <h2 id="method-title">Data preparation</h2>
        <div><p>KNIME filters registrations to Australian products marked Available and unexpired on 04 Oct 2026. Brand names are standardized, screen sizes are converted from centimetres to inches, and invalid standby measurements are excluded from the standby analysis.</p>
        <p>Size bands are defined for this analysis. Available refers to registration status; retailer stock is not included.</p>
        <a href="https://www.energyrating.gov.au/" rel="noreferrer">View Australian Energy Rating program <span aria-hidden="true">↗</span></a></div>
      </section>
    </main>
    <footer><p>Source: Australian Government Energy Rating registration database.</p></footer>
    </div>
  </div>;
}
