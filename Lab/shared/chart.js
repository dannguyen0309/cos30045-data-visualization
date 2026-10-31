/* Shared page mechanics; each exercise owns its chart geometry. */
const Chart = {
  // Preserve missing values as NaN: Number('') would incorrectly produce zero.
  number(value) {
    return value == null || String(value).trim() === '' ? NaN : Number(value);
  },
  // Load asynchronously, validate required headers, then apply the caller's row parser.
  async csv(url, columns, parse) {
    if (!window.d3) throw new Error('D3 failed to load. Check the library file or connection.');
    // D3 supplies each CSV row, its index and the header names to this conversion callback.
    const data = await d3.csv(url, (row, i, headers) => {
      const missing = columns.filter(c => !headers.includes(c));
      if (missing.length) throw new Error(`Missing CSV columns: ${missing.join(', ')}`);
      return parse(row, i);
    });
    // Also validate a header-only file, where the row conversion callback never runs.
    const missing = columns.filter(c=>!data.columns.includes(c));
    if(missing.length) throw new Error(`Missing CSV columns: ${missing.join(', ')}`);
    return data;
  },
  // Show the failure on the page and announce it to assistive technology.
  error(selector, error) {
    const node = document.querySelector(selector);
    node.classList.add('status', 'error');
    node.textContent = `Unable to display data: ${error.message}. Serve the site over HTTP, check the CSV file and reload.`;
    node.setAttribute('role', 'alert');
    console.error(error);
  },
  // Reserve margins for labels; w and h describe only the inner plotting area.
  frame(selector, height = 340, left = 62, right = 24) {
    const host = d3.select(selector);
    // Measure the container so the scales can be recalculated after a resize.
    const width = Math.max(260, Math.floor(host.node().getBoundingClientRect().width));
    const margin = {top: 32, right, bottom: 58, left};
    // A one-item join reuses the existing SVG instead of appending duplicates.
    const svg = host.selectAll('svg').data([null]).join('svg')
      .attr('viewBox', `0 0 ${width} ${height}`).attr('role', 'img');
    // Translate the plot origin inside the margins; marks use local coordinates.
    const g = svg.selectAll('g.plot').data([null]).join('g').attr('class', 'plot')
      .attr('transform', `translate(${left},${margin.top})`);
    return {svg, g, width, height, margin, w:width-left-right, h:height-margin.top-margin.bottom};
  },
  axes(c, x, y, xLabel, yLabel, year = false) {
    // Quiet gridlines share the numeric scale, keeping the data marks visually dominant.
    const numericY = !y.bandwidth;
    c.g.selectAll('g.grid').data([null]).join('g').attr('class','grid').lower()
      .attr('transform', numericY ? null : `translate(0,${c.h})`)
      .call(numericY ? d3.axisLeft(y).ticks(5).tickSize(-c.w).tickFormat('') : d3.axisBottom(x).ticks(c.w<400?3:6).tickSize(-c.h).tickFormat(''));
    // Move the horizontal axis to the plot bottom; use fewer ticks on narrow screens.
    c.g.selectAll('g.x-axis').data([null]).join('g').attr('class', 'x-axis')
      .attr('transform', `translate(0,${c.h})`).call(d3.axisBottom(x).ticks(c.w < 400 ? 3 : 7, year ? 'd' : undefined).tickSizeOuter(0).tickPadding(8));
    // Generate the vertical axis from the same y scale used for the marks.
    c.g.selectAll('g.y-axis').data([null]).join('g').attr('class', 'y-axis')
      .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0).tickPadding(8));
    // Keep axis titles outside the plotting area so they do not cover data.
    c.svg.selectAll('text.x-label').data([xLabel]).join('text').attr('class','x-label')
      .attr('x', c.margin.left+c.w/2).attr('y',c.height-8).attr('text-anchor','middle').text(d=>d);
    c.svg.selectAll('text.y-label').data([yLabel]).join('text').attr('class','y-label')
      .attr('x',0).attr('y',16).text(d=>d);
  },
  // Provide the chart values in a semantic HTML table, without requiring hover.
  table(selector, caption, headers, rows) {
    const host = d3.select(selector);
    const table = host.selectAll('table').data([null]).join('table');
    table.selectAll('caption').data([caption]).join('caption').text(d=>d);
    table.selectAll('thead').data([null]).join('thead').selectAll('tr').data([null]).join('tr')
      .selectAll('th').data(headers).join('th').attr('scope','col').text(d=>d);
    table.selectAll('tbody').data([null]).join('tbody').selectAll('tr').data(rows).join('tr')
      .selectAll('td').data(d=>d).join('td').text(d=>d);
  },
  // Redraw only when width changes; height changes must not trigger a resize loop.
  responsive(selector, render) {
    let previous = 0;
    new ResizeObserver(entries => {
      const width = Math.round(entries[0].contentRect.width);
      if (width !== previous) { previous = width; render(); }
    }).observe(document.querySelector(selector));
  }
};
