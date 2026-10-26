// Select an existing DOM element and change its CSS colour.
d3.select('#practice-heading').style('color','#146b78');
// Append a new paragraph; its text was not present in the original HTML.
d3.select('#practice').append('p').text('D3 appended this paragraph to the DOM. Compare energy use between TVs of the same size.');
// Append a rectangle and define its position, size and fill so it is visible.
d3.select('#practice-svg').append('rect').attr('x',50).attr('y',20).attr('width',100).attr('height',30).style('fill','#146b78');
// Create the SVG canvas before appending the Exercise 4.3 test rectangle.
d3.select('#setup-rectangle').append('svg').attr('viewBox','0 0 460 60')
  .attr('role','img').attr('aria-label','Test rectangle at (10,10), width 414, height 16')
  .append('rect').attr('x',10).attr('y',10).attr('width',414).attr('height',16).attr('fill','#24689b');
