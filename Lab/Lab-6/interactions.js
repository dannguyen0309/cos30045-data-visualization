// Keep the visible tooltip and record selector synchronised with the same datum.
function showTV(d) {
  document.querySelector('#tooltip').textContent=describeTV(d);
  document.querySelector('#record-select').value=String(d.id);
}
function updateTV(technology) {
  TV.selected=technology;
  // All reuses the full dataset; a technology selection keeps only matching records.
  TV.visible=technology==='All'?TV.data:TV.data.filter(d=>d.screenTech===technology);
  // Expose the active button both visually and to screen readers.
  d3.select('#filters').selectAll('button').attr('aria-pressed',d=>d===technology?'true':'false');
  document.querySelector('#selection-status').textContent=`${technology}: ${TV.visible.length.toLocaleString('en-AU')} records${TV.visible.length?'':'. No data in this group'}.`;
  // The extension: send the same filtered subset to both charts.
  drawHistogram(TV.visible);drawScatterplot(TV.visible);
  // The selector reaches every visible record, including points hidden behind other points.
  d3.select('#record-select').selectAll('option').data(TV.visible,d=>d.id).join('option').attr('value',d=>d.id).text(describeTV);
  // Disable record inspection for an empty subset and show an explicit empty message.
  document.querySelector('#record-select').disabled=!TV.visible.length;
  if(TV.visible.length)showTV(TV.visible[0]);else document.querySelector('#tooltip').textContent='No records to inspect.';
  // Only build the large record table when its disclosure is open.
  if(document.querySelector('#records-table').closest('details').open) drawRecordsTable();
}
function drawRecordsTable() {
  Chart.table('#records-table',`Records: ${TV.selected}`,['Brand / model','Technology','Size (inch)','Stars','kWh/year'],TV.visible.map(d=>[`${d.brand} ${d.model}`,d.screenTech,d.screenSize,d.star,d.energyConsumption]));
}
function populateFilters() {
  // Derive buttons from the actual CSV technologies instead of assuming a fixed list.
  const technologies=[...new Set(TV.data.map(d=>d.screenTech))].sort();
  // Build native buttons and pass the clicked button's bound technology to updateTV.
  d3.select('#filters').selectAll('button').data(['All',...technologies]).join('button').attr('type','button').text(d=>d).on('click',(_,d)=>updateTV(d));
  d3.select('#tech-legend').selectAll('li').data(technologies).join('li').text(d=>d).style('border-left',d=>`12px solid ${TV.colors[d]||'#465e6d'}`).style('padding-left','8px');
  // HTML option values are strings; convert the selected id back to a number.
  document.querySelector('#record-select').addEventListener('change',event=>showTV(TV.visible.find(d=>d.id===Number(event.target.value))));
  document.querySelector('#records-table').closest('details').addEventListener('toggle',event=>{if(event.target.open)drawRecordsTable();});
}
