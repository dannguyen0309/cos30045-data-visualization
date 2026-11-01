function drawScatterplot(data) {
  const c=Chart.frame('#scatterplot',400);
  // Reuse one floating label; the persistent status below remains the accessible text alternative.
  const host=d3.select('#scatterplot');
  const tip=host.selectAll('div.point-tooltip').data([null]).join('div')
    .attr('class','point-tooltip').attr('aria-hidden','true').attr('hidden',true);
  function showPoint(event,d) {
    showTV(d);
    tip.text(describeTV(d)).attr('hidden',null);
    const point=event.currentTarget.getBoundingClientRect(), box=host.node().getBoundingClientRect();
    const label=tip.node().getBoundingClientRect();
    // Keep the label inside the chart width and place it below points near the top edge.
    const left=Math.max(0,Math.min(box.width-label.width,point.left-box.left+point.width/2-label.width/2));
    const above=point.top-box.top-label.height-10;
    tip.style('left',`${left}px`).style('top',`${above>=0?above:point.bottom-box.top+10}px`);
  }
  c.svg.attr('role','group').attr('aria-label','Scatterplot of star rating and annual energy. Select a record below or focus a point.');
  // Position star rating horizontally; all filters share the same full-data star domain.
  const x=d3.scaleLinear().domain([0,TV.starMax]).range([0,c.w]);
  // Position annual energy vertically with a separate scale from the histogram.
  const y=d3.scaleLinear().domain([0,TV.energyMax]).range([c.h,0]);
  Chart.axes(c,x,y,'Star rating','Annual energy (kWh/year)');
  // Stable record ids allow the join to add, reuse or remove points correctly after filtering.
  c.g.selectAll('circle.tv-point').data(data,d=>d.id).join('circle').attr('class','tv-point').attr('r',4)
    // Map data values to circle centres; transparency helps reveal overlapping points.
    .attr('cx',d=>x(d.star)).attr('cy',d=>y(d.energyConsumption)).attr('fill',d=>TV.colors[d.screenTech]||'#465e6d').attr('opacity',.55)
    // Give the chart one Tab entry point; arrow keys move focus between its records.
    .attr('tabindex',(d,i)=>i===0?0:-1).attr('role','button').attr('aria-label',describeTV)
    // event is the browser event; d is the TV record bound to the point.
    .on('pointerenter focus click',showPoint)
    .on('pointerleave blur',()=>tip.attr('hidden',true))
    .on('keydown',function(event,d){
      // Support keyboard activation without scrolling the page on Space.
      if(event.key==='Enter'||event.key===' '){event.preventDefault();showPoint(event,d);}
      if(event.key==='Escape'){
        tip.attr('hidden',true);
        document.querySelector('#tooltip').textContent='Select a point or record to inspect its values.';
      }
      if(['ArrowRight','ArrowLeft'].includes(event.key)){
        event.preventDefault(); const points=[...this.parentNode.querySelectorAll('circle.tv-point')],i=points.indexOf(this);
        // Wrap around at either end of the point list.
        const next=points[(i+(event.key==='ArrowRight'?1:-1)+points.length)%points.length];
        // Move the single Tab stop to the new point, then focus it to update the tooltip.
        this.setAttribute('tabindex','-1'); next.setAttribute('tabindex','0'); next.focus();
      }
    });
}
