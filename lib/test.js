var dataset = [ 12, 50, 10, 19, 25, 43, 19, 27 ],
    h = 200,
    w = 410,
    barPadding = 1;

var svg = d3.select("body").append("svg"),
    button = d3.select("button"),
    max = d3.max(dataset),
    padding = 25;
    barWidth = ((w - padding) / dataset.length) - 4 ; //Magic number 4?!

svg.attr("width", w)
  .attr("height", h);

var yScale = d3.scale
  .linear()
  .domain([0, max])
  .rangeRound([h - padding, padding]);

var xScale = d3.scale
  .linear()
  .domain([dataset.length, 0])
  .rangeRound([w - padding, padding]);

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("left")
  .ticks(5);

var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom");

var rectangles = svg.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect");

var text = svg.selectAll("text")
  .data(dataset)
  .enter()
  .append("text");

rectangles
  .attr("x", function(d, i) {
    return xScale(i);
  })
  .attr("width", barWidth)
  .attr("y", function(d) {
    return 0;
    //return h - yScale(d) - padding;  //Height minus data value
  })
  .attr("height", function(d) {
    console.log('yscale: '+ (h - yScale(d)));
    return yScale(d);
  })
  .attr("fill", function(d) {
    return "rgb(0, 0, " + (d * 10) + ")";
  });

text
  .text(function(d) {
    return d;
   })
  .attr("x", function(d, i) {
    return xScale(i) + (barWidth / 2);
    })
  .attr("text-anchor", "middle")
  .attr("y", function(d) {
    return h - yScale(d) - padding + 15;  //Height minus data value
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", "11px")
  .attr("fill", "white");

svg.append("g")
  .attr("transform", "translate("+padding+",0)")
  .attr("class", "axis")
  .call(yAxis);

button.on("click", function() {
  var dataset2 = [ 8, 27, 1, 10, 15, 33, 10, 35 ]

  svg.selectAll('rect')
    .data(dataset2)
    .attr("y", function(d) {
      return h - yScale(d) - padding;  //Height minus data value
    })
    .attr("height", function(d) {
      return yScale(d);
    })


    //.attr("width",w/2);
})
