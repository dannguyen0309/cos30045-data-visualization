// Resolve the CSV relative to this script so both the shared home page and direct page work.
Chart.csv(new URL('data/tvBrandCount.csv',document.currentScript.src), ['brand','count'], d => ({brand:d.brand, count:Chart.number(d.count)}))
  // Rendering starts only after the CSV Promise resolves and count values have been parsed.
  .then(data => {
    if (data.some(d=>!d.brand || !Number.isInteger(d.count) || d.count < 0)) throw new Error('Invalid brand or count');
    // Rank brands by descending count; use brand names to break ties consistently.
    data.sort((a,b)=>b.count-a.count || a.brand.localeCompare(b.brand));
    // Inspect the loaded array, row count, minimum, maximum and extent in the console.
    console.log('Brand rows:', data, 'length:',data.length,'min:',d3.min(data,d=>d.count),'max:',d3.max(data,d=>d.count),'extent:',d3.extent(data,d=>d.count));
    document.querySelector('#brand-status').textContent = `${data.length} brand; ${d3.sum(data,d=>d.count).toLocaleString('en-AU')} records in brands with at least 20 registrations.`;
    Chart.table('#brand-table','Registrations by brand',['Brand','Count'],data.map(d=>[d.brand,d.count]));
    Chart.responsive('#brand-chart',()=>{
      const c=Chart.frame('#brand-chart',Math.max(360,data.length*28+90),115,54);
      c.svg.attr('aria-label','Horizontal bars show registrations by brand from a zero baseline. A complete table is available below.');
      // Map registration counts to bar widths, with a zero baseline and a rounded upper limit.
      const x=d3.scaleLinear().domain([0,d3.max(data,d=>d.count)||1]).nice().range([0,c.w]);
      // Allocate one vertical band per brand; padding leaves gaps between bars.
      const y=d3.scaleBand().domain(data.map(d=>d.brand)).range([0,c.h]).padding(.2);
      Chart.axes(c,x,y,'Registration count','Brand');
      // Use brand as the join key, then move each bar-and-label group to its category band.
      const rows=c.g.selectAll('g.brand-row').data(data,d=>d.brand).join('g').attr('class','brand-row').attr('transform',d=>`translate(0,${y(d.brand)})`);
      // Each group inherits its datum; bandwidth supplies the bar height.
      rows.selectAll('rect').data(d=>[d]).join('rect').attr('class','bar').attr('rx',2).attr('width',d=>x(d.count)).attr('height',y.bandwidth());
      // Place the numeric count just beyond the bar end and vertically centre it.
      rows.selectAll('text').data(d=>[d]).join('text').attr('x',d=>x(d.count)+5).attr('y',y.bandwidth()/2).attr('dy','.35em').text(d=>d.count);
    });
  }).catch(error=>Chart.error('#brand-status',error));
