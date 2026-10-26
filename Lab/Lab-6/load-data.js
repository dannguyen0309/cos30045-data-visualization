// Load the TV file once; the row index becomes a stable id before any filtering.
Chart.csv(new URL('data/Ex6_TVdata_withStar.csv',document.currentScript.src),['brand','model','screenSize','screenTech','star','energyConsumption'],(d,i)=>({
  // Keep names as strings and explicitly parse the three numeric fields.
  id:i,brand:d.brand,model:d.model,screenTech:d.screenTech,screenSize:Chart.number(d.screenSize),star:Chart.number(d.star),energyConsumption:Chart.number(d.energyConsumption)
})).then(rows=>{
  // Exclude missing or invalid values without silently replacing them with zero.
  TV.data=rows.filter(d=>d.screenTech&&Number.isFinite(d.screenSize)&&d.screenSize>0&&Number.isFinite(d.star)&&d.star>=0&&Number.isFinite(d.energyConsumption)&&d.energyConsumption>=0);
  document.querySelector('#data-status').textContent=`Loaded ${rows.length} rows; using ${TV.data.length}; excluded ${rows.length-TV.data.length} rows with missing or invalid values. All outliers retained. Missing values are never converted to zero.`;
  // Stop cleanly when no valid records remain, rather than creating invalid scale domains.
  if(!TV.data.length){document.querySelector('#selection-status').textContent='No valid records to plot.';return;}
  // Calculate full-data domains once, retaining the maximum-energy outlier.
  TV.energyMax=d3.scaleLinear().domain([0,d3.max(TV.data,d=>d.energyConsumption)||1]).nice().domain()[1];
  TV.starMax=Math.ceil(d3.max(TV.data,d=>d.star))||1;
  // Choose internal thresholds from the full range; this file produces 200-kWh/year bins.
  const boundaries=d3.ticks(0,TV.energyMax,14).filter(d=>d>0&&d<TV.energyMax);
  // Fix both the bin domain and thresholds so filtering never changes interval boundaries.
  TV.binGenerator=d3.bin().value(d=>d.energyConsumption).domain([0,TV.energyMax]).thresholds(boundaries);
  // Use the full-data maximum frequency as the fixed histogram y-domain limit.
  TV.frequencyMax=d3.max(TV.binGenerator(TV.data),d=>d.length)||1;
  // Create the controls and draw the initial All selection after data preparation finishes.
  populateFilters();updateTV('All');
  // Resizing redraws the current selection, rather than resetting the technology filter.
  Chart.responsive('#histogram',()=>drawHistogram(TV.visible));
  Chart.responsive('#scatterplot',()=>drawScatterplot(TV.visible));
  console.log('TV data:',TV.data,'energy extent:',d3.extent(TV.data,d=>d.energyConsumption),'fixed bin boundaries:',boundaries);
}).catch(e=>Chart.error('#data-status',e));
