// Parse both year and wholesale price as numbers, rather than CSV strings.
Chart.csv(new URL('data/ARE_Spot_Prices.csv',document.currentScript.src),['Year','Average Price (notTas-Snowy)'],d=>({year:Chart.number(d.Year),price:Chart.number(d['Average Price (notTas-Snowy)'])}))
.then(rows=>{
  // Keep valid observations and sort chronologically because a line follows array order.
  const data=rows.filter(d=>Number.isInteger(d.year)&&Number.isFinite(d.price)).sort((a,b)=>a.year-b.year);
  // Duplicate years would make the annual series ambiguous, so reject them explicitly.
  if(new Set(data.map(d=>d.year)).size!==data.length) throw new Error('Duplicate years');
  document.querySelector('#price-status').textContent=`${data.length}/${rows.length} valid rows; ${rows.length-data.length} rows excluded. Average of Queensland, NSW, Victoria and SA; excludes Tasmania and Snowy.`;
  Chart.table('#price-table','Wholesale spot price by year',['Year','AUD/MWh'],data.map(d=>[d.year,d.price.toFixed(2)]));
  Chart.responsive('#line-chart',()=>{
    const c=Chart.frame('#line-chart',360);
    c.svg.attr('aria-label','Line chart with points: wholesale spot prices, 1998–2024.');
    // The year domain comes from the earliest and latest observations.
    const x=d3.scaleLinear().domain(d3.extent(data,d=>d.year)).range([0,c.w]);
    // Include zero and any negative prices in the displayed price range.
    const y=d3.scaleLinear().domain([Math.min(0,d3.min(data,d=>d.price)||0),d3.max(data,d=>d.price)||1]).nice().range([c.h,0]);
    // The final true argument formats year ticks as integers instead of decimal numbers.
    Chart.axes(c,x,y,'Year','Wholesale spot price (AUD/MWh)',true);
    // Bind the entire series to one path; the line generator calculates its SVG coordinates.
    c.g.selectAll('path.price-line').data([data]).join('path').attr('class','price-line').attr('fill','none').attr('stroke','#146b78').attr('stroke-width',2)
      // Start a new segment at a year gap instead of drawing a line across missing years.
      .attr('d',d3.line().defined((d,i)=>i===0||d.year===data[i-1].year+1).x(d=>x(d.year)).y(d=>y(d.price)));
    // Bind one circle to each observed year so individual measurements remain visible.
    c.g.selectAll('circle').data(data,d=>d.year).join('circle').attr('r',4).attr('cx',d=>x(d.year)).attr('cy',d=>y(d.price)).attr('fill','#146b78')
      .selectAll('title').data(d=>[d]).join('title').text(d=>`${d.year}: ${d.price} AUD/MWh`);
  });
}).catch(e=>Chart.error('#price-status',e));
