// Read the actual KNIME headers; parse mean energy and sample count as numbers.
Chart.csv(new URL('data/energy55.csv',document.currentScript.src),['Screen_Tech','Mean(Labelled energy consumption (kWh/year))','Count*(Model_No)'],d=>({
  technology:d.Screen_Tech,mean:Chart.number(d['Mean(Labelled energy consumption (kWh/year))']),n:Chart.number(d['Count*(Model_No)'])
})).then(data=>{
  if(data.some(d=>!d.technology || !Number.isFinite(d.mean) || d.mean<0 || !Number.isInteger(d.n) || d.n<1)) throw new Error('Invalid mean or sample count');
  // Order technologies by mean energy, from highest to lowest.
  data.sort((a,b)=>b.mean-a.mean);
  // Show the sample size n alongside each mean so the comparison has context.
  Chart.table('#energy-table','Mean annual energy for 55-inch TVs',['Technology','Mean (kWh/year)','n'],data.map(d=>[d.technology,d.mean.toFixed(2),d.n]));
  document.querySelector('#energy-status').textContent=`${d3.sum(data,d=>d.n)} 55-inch registrations. Means are grouped by technology; this comparison does not establish causation.`;
  Chart.responsive('#energy-chart',()=>{
    const c=Chart.frame('#energy-chart',360);
    c.svg.attr('aria-label','Vertical bars compare mean annual energy by screen technology for 55-inch TVs.');
    // Technologies are categories, so x uses separate bands rather than a numeric scale.
    const x=d3.scaleBand().domain(data.map(d=>d.technology)).range([0,c.w]).padding(.35);
    // Reverse the y range: larger energy values appear higher; leave room above value labels.
    const y=d3.scaleLinear().domain([0,d3.max(data,d=>d.mean)*1.15||1]).nice().range([c.h,0]);
    Chart.axes(c,x,y,'Screen technology','Mean annual energy (kWh/year)');
    // y(mean) positions the bar top; plot height minus that coordinate gives bar height.
    c.g.selectAll('rect.bar').data(data,d=>d.technology).join('rect').attr('class','bar').attr('x',d=>x(d.technology)).attr('y',d=>y(d.mean)).attr('width',x.bandwidth()).attr('height',d=>c.h-y(d.mean));
    // Centre a direct value label above each bar; toFixed changes display precision only.
    c.g.selectAll('text.value').data(data,d=>d.technology).join('text').attr('class','value').attr('x',d=>x(d.technology)+x.bandwidth()/2).attr('y',d=>y(d.mean)-8).attr('text-anchor','middle').text(d=>d.mean.toFixed(1));
  });
}).catch(e=>Chart.error('#energy-status',e));
