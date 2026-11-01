function drawHistogram(data) {
  // Apply the shared fixed-bin generator to the currently selected records.
  const bins=TV.binGenerator(data), c=Chart.frame('#histogram',340);
  c.svg.attr('aria-label',`Annual energy histogram: ${TV.selected}, ${data.length} registrations. Fixed bins and domains.`);
  // Energy determines horizontal position; its full-data domain remains fixed after filtering.
  const x=d3.scaleLinear().domain([0,TV.energyMax]).range([0,c.w]);
  // Bin frequency determines height; reverse the range because SVG y increases downward.
  const y=d3.scaleLinear().domain([0,TV.frequencyMax]).nice().range([c.h,0]);
  Chart.axes(c,x,y,'Annual energy (kWh/year)','Frequency (registrations)');
  // Key bins by their lower boundary so updates reuse the corresponding rectangles.
  const bars=c.g.selectAll('rect.bar').data(bins,d=>d.x0).join('rect').attr('class','bar')
    // Store bin metadata in the DOM so browser checks can verify totals and boundaries.
    .attr('data-count',d=>d.length).attr('data-x0',d=>d.x0).attr('data-x1',d=>d.x1)
    // Convert each interval to pixel width and leave a one-pixel gap between bars.
    .attr('x',d=>x(d.x0)+.5).attr('width',d=>Math.max(0,x(d.x1)-x(d.x0)-1));
  // Tint the bars with the selected technology colour; All keeps the default accent colour.
  bars.style('fill',TV.colors[TV.selected]||null);
  // Cancel an unfinished animation before starting the latest filter update.
  bars.interrupt().transition().duration(TV.duration()).attr('y',d=>y(d.length)).attr('height',d=>c.h-y(d.length));
  // Each rectangle also exposes its interval and frequency as a native SVG title.
  bars.selectAll('title').data(d=>[d]).join('title').text(d=>`${d.x0}–${d.x1} kWh/year: ${d.length} registrations`);
  Chart.table('#bins-table',`Histogram: ${TV.selected}`,['From (kWh/year)','To (kWh/year)','Frequency'],bins.map(d=>[d.x0,d.x1,d.length]));
  // Every selected record must belong to exactly one bin.
  console.assert(d3.sum(bins,d=>d.length)===data.length,'Histogram must retain every record');
}
