import { useEffect, useMemo, useState } from "react";
import Plot from "./Plot";
import TVComparison from './TVComparison';
import { ANNUAL, group, loadData, median } from "./data";
import { BANDS, TECHNOLOGIES, TECHNOLOGY_COLORS, catalogueSummary, technologyEnergy } from "./analysis";

const CHART_BLUE = "#3b82c4";
const SYMBOLS = { "LCD (LED)": "circle", LCD: "square", OLED: "diamond" };
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
    data: Object.entries(group(rows, "Screen_Tech")).map(([technology, records]) => ({
      type: "scattergl",
      mode: "markers",
      name: technology,
      x: records.map((row) => row["Screen Size (inches)"]),
      y: records.map((row) => row[ANNUAL]),
      customdata: records.map((row) => [row.Brand_Reg, row.Model_No, row.Star2]),
      marker: { color: TECHNOLOGY_COLORS[technology], symbol: SYMBOLS[technology], size: 7, opacity: 0.62 },
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
  const labels = TECHNOLOGIES.filter(technology => groups[technology]?.length);
  return {
    data: [{
      type: "pie",
      labels,
      values: labels.map((label) => groups[label].length),
      textinfo: "label+percent",
      textposition: "outside",
      textfont: { color: "#102a43", size: 13 },
      marker: { colors: labels.map(label => TECHNOLOGY_COLORS[label]), line: { color: "#ffffff", width: 4 } },
      hovertemplate: "%{label}<br>%{value:,} registration records<br>%{percent}<extra></extra>",
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
      marker: { color: CHART_BLUE },
      texttemplate: "%{y:.0f}",
      textposition: "outside",
      cliponaxis: false,
      hovertemplate: "%{x}<br>Median %{y:.0f} kWh/year<br>%{customdata:,} registration records<extra></extra>",
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
      marker: { color: brands.map((brand) => brand.energy), colorscale: [[0, CHART_BLUE], [1, '#0ea5e9']], showscale: false },
      hovertemplate: "%{y}<br>Median %{x:.0f} kWh/year<br>%{customdata:,} registration records<extra></extra>",
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
      marker: { color: '#0ea5e9', line: { color: "#ffffff", width: 1 } },
      hovertemplate: "%{x:.2f} W<br>%{y:,} registration records<extra></extra>",
    }],
    layout: layout({
      xaxis: { title: "Passive standby power (W)", gridcolor: "#e4edf7", rangemode: "tozero" },
      yaxis: { title: "Registration count", gridcolor: "#e4edf7", rangemode: "tozero" },
    }),
    empty: values.length === 0,
  };
}

function catalogueSizeSpec(rows) {
  const { bands } = catalogueSummary(rows);
  return {
    data: [{
      type: 'bar',
      x: bands.map(item => item.band.replace(/^\d\. /, '')),
      y: bands.map(item => item.count),
      customdata: bands.map(item => rows.length ? item.count / rows.length * 100 : 0),
      marker: { color: CHART_BLUE },
      texttemplate: '%{customdata:.1f}%', textposition: 'outside', cliponaxis: false,
      hovertemplate: '%{x}<br>%{y:,} registrations<br>%{customdata:.1f}% of filtered records<extra></extra>',
    }],
    layout: layout({
      margin: { l: 64, r: 18, t: 34, b: 72 },
      xaxis: { title: 'Screen-size band', gridcolor: '#e4edf7' },
      yaxis: { title: 'Registration count', gridcolor: '#e4edf7', rangemode: 'tozero' },
    }),
  };
}

function technologyEnergySpec(rows) {
  const summaries = technologyEnergy(rows);
  const bands = BANDS.filter(band => rows.some(row => row['Screen Size Band'] === band));
  return {
    data: summaries.map(({ technology, values }) => ({
      type: 'bar', name: technology,
      x: bands.map(band => band.replace(/^\d\. /, '')),
      y: values.filter(value => bands.includes(value.band)).map(value => value.energy),
      customdata: values.filter(value => bands.includes(value.band)).map(value => value.count),
      marker: { color: TECHNOLOGY_COLORS[technology] },
      hovertemplate: '%{fullData.name}<br>%{x}<br>Median %{y:.0f} kWh/year<br>%{customdata:,} registrations<extra></extra>',
    })),
    layout: layout({
      barmode: 'group', margin: { l: 72, r: 24, t: 46, b: 72 },
      xaxis: { title: 'Screen-size band', gridcolor: '#e4edf7' },
      yaxis: { title: 'Median annual energy (kWh/year)', gridcolor: '#e4edf7', rangemode: 'tozero' },
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
  const values = [
    ["Registrations", number.format(rows.length), ""],
    ["Median annual energy", rows.length ? number.format(median(rows.map((row) => row[ANNUAL]))) : "—", "kWh/year"],
    ["Median star rating", rows.length ? number.format(median(rows.map(row => row.Star2))) : "—", "stars"],
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


function CatalogueContext({ rows }) {
  const summary = catalogueSummary(rows);
  const dominant = [...summary.technologies].sort((a, b) => b.count - a.count)[0];
  return <div className="catalogue-context">
    <div><h3>Snapshot: 04 Oct 2026</h3><p>{dominant.technology} accounts for {number.format(dominant.count / rows.length * 100)}% of these registrations; {number.format(summary.largeCount / rows.length * 100)}% have screens larger than 55 inches.</p><p>Registration share describes the catalogue, not sales or household viewing habits. This snapshot has no historical registration dates.</p></div>
    <div><h3>Historical context: E3 report, 2024</h3><p>The report's historical analysis describes a fall in TV energy consumption after 2009, followed by an increase from 2014–15 as screens became larger, higher-resolution and brighter.</p><a href="https://www.energyrating.gov.au/sites/default/files/2025-06/DRIS%20on%20the%20energy%20efficiency%20of%20digital%20displays.pdf" rel="noreferrer">Source: E3 Digital Displays report, pp. 8–10 ↗</a></div>
  </div>;
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
    <p className="sr-only" aria-live="polite">{number.format(rows.length)} registration records match the filters.</p>
    <Kpis rows={rows} />
    {rows.length ? <section id="insights" aria-label="Energy analysis">
      <section className="story-chapter" id="catalogue" aria-labelledby="chapter-catalogue">
        <div className="chapter-heading"><span>02</span><div><h2 id="chapter-catalogue">The registered TV catalogue</h2></div></div>
        <div className="chart-grid">
          <ChartPanel index="01" title="Registrations by screen size" spec={catalogueSizeSpec(rows)} label="Bar chart of registration counts and shares by screen-size band" />
          <ChartPanel index="02" title="Screen technology share" spec={pieSpec(rows)} label="Pie chart showing registration share by screen technology" />
        </div>
        <CatalogueContext rows={rows} />
      </section>
      <section className="story-chapter" aria-labelledby="chapter-size">
        <div className="chapter-heading"><span>03</span><div><h2 id="chapter-size">Screen size and energy consumption</h2></div></div>
        <div className="chart-grid">
          <ChartPanel index="03" title="Screen size vs annual energy" spec={scatterSpec(rows)} label="Scatter plot of screen size and annual energy by screen technology" wide large />
          <ChartPanel index="04" title="Median annual energy by screen size" spec={bandSpec(rows)} label="Bar chart comparing median annual energy by screen-size band" wide />
        </div>
      </section>
      <section className="story-chapter" aria-labelledby="chapter-tech">
        <div className="chapter-heading"><span>04</span><div><h2 id="chapter-tech">Screen technology and standby power</h2></div></div>
        <div className="chart-grid">
          <ChartPanel index="05" title="Median annual energy by technology and size" spec={technologyEnergySpec(rows)} label="Grouped bar chart comparing median annual energy for screen technologies within each screen-size band" wide large />
          <p className="chart-note panel-wide">Colours identify screen technology. Each group compares similar-sized TVs; exact sizes still vary within a band. Missing bars indicate no registrations.</p>
          <ChartPanel index="06" title="Standby power distribution" spec={standbySpec(rows, standby)} label="Histogram of passive standby power in watts" wide />
        </div>
      </section>
      <section className="story-chapter" aria-labelledby="chapter-compare">
        <div className="chapter-heading"><span>05</span><div><h2 id="chapter-compare">Brands and individual TVs</h2></div></div>
        <div className="chart-grid">
          <ChartPanel index="07" title="Median annual energy by brand" spec={brandSpec(rows)} label="Horizontal bar chart comparing median annual energy of the 12 brands with the most registrations in the filtered data" wide large />
        </div>
      </section>
    </section> : <section className="panel empty-state"><h2>No matching models</h2><p>Adjust or reset the filters to restore results.</p></section>}
    <TVComparison key={JSON.stringify(filters)} rows={rows} />
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
        <nav aria-label="Dashboard sections"><a href="#overview">Filters</a><a href="#catalogue">Catalogue</a><a href="#insights">Analysis</a><a href="#models">Compare TVs</a></nav>
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
          <ol><li><span>1</span>Catalogue snapshot</li><li><span>2</span>Size and technology</li><li><span>3</span>Energy comparison</li></ol>
          <p>4,839 registrations · Australia · 04 Oct 2026</p>
        </aside>
      </div>
    </header>
    <main id="main">
      {!data && !error && <section className="status-panel" aria-live="polite"><span className="spinner" aria-hidden="true" /><p>Loading television data…</p></section>}
      {error && <section className="status-panel error-panel" role="alert"><h2>Dashboard data could not be loaded</h2><p>{error}</p><button type="button" onClick={() => setRetry((value) => value + 1)}>Retry</button></section>}
      {data && <Dashboard {...data} />}
    </main>
    <footer><p>Source: Australian Government Energy Rating registration database.</p></footer>
    </div>
  </div>;
}
