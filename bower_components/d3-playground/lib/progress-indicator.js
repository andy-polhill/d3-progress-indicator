var ProgressIndicator = (function() {

  var
  radius = 100,
  innerRadius = 45,
  padding = 25,
  width = radius * 2,
  milestoneRadius = innerRadius / 10,
  height = width,
  tweenDuration = 2500;

  function ProgressIndicator(opts) {

    var percentageCompleted = opts.percentageCompleted || 0;

    var arcData = [{
      startAngle:0,
      endAngle:(percentageCompleted / 100) * (Math.PI * 2)
    }];

    //Add Elements
    var svg = d3.select(opts.selector).append("svg:svg")
      .attr("width", width + (padding * 2))
      .attr("height", height + (padding * 2));

    var container = svg.append("svg:g")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("transform", "translate(" + padding + "," + padding + ")");

    var indicator = container.append("svg:g")
      .attr("class", "arc")
      .attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");

    var background = indicator.append("svg:circle")
      .attr("fill", "#EFEFEF")
      .attr("r", radius);

    var whiteCircle = indicator.append("svg:circle")
      .attr("fill", "white")
      .attr("r", innerRadius);

    var percentageComplete = indicator.append("svg:text")
      .attr("class", "total")
      .attr("dy", 15)
      .attr("text-anchor", "middle")
      .data([percentageCompleted])
      .transition()
      .duration(tweenDuration)
      .tween("text", ProgressIndicator.textTween);

    var paths = indicator.append("svg:path")
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      .attr("fill", 'steelblue')
      .data(arcData)
      .transition()
      .duration(tweenDuration)
      .attrTween("d", ProgressIndicator.arcTween);

    var triangle = svg.selectAll(".milestone")
      .data(opts.milestones)
      .enter()
      .append("path")
      .attr("d", "M  0 0 l -8 -8 l 16 0 z")
      .attr("class", "milestone")
      .style("fill", "orange")
      .attr("transform", function(d) {
        var rad =  d / 100 * (2 * Math.PI),
        x = (Math.sin(rad) * radius) + radius + padding,
        y = 0 - ((Math.cos(rad) * radius) - radius - padding),
        rotate = (rad * 180 / Math.PI);
        return "translate(" + x + "," + y + "), rotate (" + rotate + ")";
      });
  }

  ProgressIndicator.arc = d3.svg.arc()
    .startAngle( function (d) {
      return d.startAngle;
    })
    .endAngle( function (d) {
      return d.endAngle;
    })
    .innerRadius(innerRadius)
    .outerRadius(radius);

  ProgressIndicator.arcTween = function(d, i) {
    var i = d3.interpolate({
      startAngle: 0,
      endAngle: 0
    }, {
      startAngle: d.startAngle,
      endAngle: d.endAngle
    });

    return function(t) {
      var b = i(t);
      return ProgressIndicator.arc(b);
    };
  }

  ProgressIndicator.textTween = function(d, i) {
    var i = d3.interpolate(this.textContent, d);
    return function(t) {
      this.textContent = Math.round(i(t));
    };
  }
  return ProgressIndicator;
})();

/*
new ProgressIndicator({
  percentageCompleted: 77,
  selector: "#progress-indicator-1",
  milestones: [10, 75, 50]
});

new ProgressIndicator({
  percentageCompleted: 17,
  selector: "#progress-indicator-2",
  milestones: [33, 66, 0]
});
*/
