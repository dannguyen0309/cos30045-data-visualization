// Read the size groups and counts produced by the executed KNIME GroupBy branch.
Chart.csv(new URL('data/sizeCounts.csv',document.currentScript.src),['screensize_category','Count*(Model_No)'],d=>({group:d.screensize_category,count:Chart.number(d['Count*(Model_No)'])}))
.then(data=>{
  // Numeric group prefixes preserve Small, Medium, Large order.
  data.sort((a,b)=>a.group.localeCompare(b.group));
  if(data.some(d=>!d.group || !Number.isInteger(d.count) || d.count<0)) throw new Error('Invalid size group or count');
  // The registration total is the denominator for every percentage.
  const total=d3.sum(data,d=>d.count), colors=['#146b78','#ad5312','#73549c'];
  document.querySelector('#size-status').textContent=`Total ${total.toLocaleString('en-AU')} registrations. Small ≤43; Medium 44–65; Large ≥66 inches, after rounding.`;
  // Percentages are count / total * 100; keep the raw counts available as well.
  Chart.table('#size-table','Registrations by screen-size group',['Group','Count','Share'],data.map(d=>[d.group,d.count,`${(100*d.count/total).toFixed(1)}%`]));
  d3.select('#size-legend').selectAll('li').data(data).join('li').text((d,i)=>`${i+1}. ${d.group}: ${d.count} (${(100*d.count/total).toFixed(1)}%)`).style('border-left',(d,i)=>`12px solid ${colors[i]}`).style('padding-left','8px');
  Chart.responsive('#donut-chart',()=>{
    // Choose a radius that fits the current container width, including on mobile.
    const c=Chart.frame('#donut-chart',320,0,0),r=Math.min(c.width,290)/2-12;
    c.svg.attr('aria-label','Donut chart of Small, Medium and Large registration shares. Counts and percentages are listed in the key and table.');
    // Arcs are drawn around (0,0), so move the group origin to the donut centre.
    c.g.attr('transform',`translate(${c.width/2},160)`);
    // pie calculates angles; arc converts them to paths. The inner radius creates the hole.
    const arcs=d3.pie().sort(null).value(d=>d.count)(data), arc=d3.arc().innerRadius(r*.6).outerRadius(r).padAngle(.015).cornerRadius(2);
    // Join one path per group and keep the same category colours as the key.
    c.g.selectAll('path').data(arcs,d=>d.data.group).join('path').attr('d',arc).attr('fill',(d,i)=>colors[i]);
    c.g.selectAll('text.total').data([total]).join('text').attr('class','total').attr('text-anchor','middle').attr('dy','0').style('font-size','24px').style('font-weight','650').text(d=>d.toLocaleString('en-AU'));
    c.g.selectAll('text.total-label').data([null]).join('text').attr('class','total-label').attr('text-anchor','middle').attr('y',22).style('font-size','11px').text('registrations');
  });
}).catch(e=>Chart.error('#size-status',e));
