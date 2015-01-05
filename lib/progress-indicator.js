var ProgressIndicator = (function() {

  var
  radius = 100,
  innerRadius = 45,
  xPadding = 100,
  yPadding = 20,
  width = radius * 2,
  milestoneRadius = innerRadius / 10,
  height = width,
  tweenDuration = 2500;

  var arc = d3.svg.arc()
    .startAngle( function (d) {
      return d.startAngle;
    })
    .endAngle( function (d) {
      return d.endAngle;
    })
    .innerRadius(innerRadius)
    .outerRadius(radius);

  var arcTween = function(d, i) {
    var i = d3.interpolate({
      startAngle: 0,
      endAngle: 0
    }, {
      startAngle: d.startAngle,
      endAngle: d.endAngle
    });

    return function(t) {
      var b = i(t);
      return arc(b);
    };
  }

  var textTween = function(d, i) {
    var i = d3.interpolate(this.textContent, d);
    return function(t) {
      this.textContent = Math.round(i(t));
    };
  }

  var milestoneTween = function(d, i) {
    var i = d3.interpolateRound(0, d.percentageCompleted),
        triangle = d3.select(this),
        value = d.value;
    return function(t) {
      if(value < Math.round(i(t))) {
        triangle.classed('active', true);
      }
    };
  }

  function ProgressIndicator(opts) {

    var percentageCompleted = opts.percentageCompleted || 0;

    //Add a radian valuse for each milestone
    d3.map(opts.milestones).forEach(function(i, milestone) {
      milestone.radian = milestone.value / 100 * (2 * Math.PI);
      milestone.percentageCompleted = percentageCompleted;
    });

    var arcData = [{
      startAngle:0,
      endAngle:(percentageCompleted / 100) * (Math.PI * 2)
    }];

    //Add Elements
    var svg = d3.select(opts.selector).append("svg:svg")
      .attr("width", width + (xPadding * 2))
      .attr("height", height + (yPadding * 2));

    var container = svg.append("svg:g")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + xPadding + "," + yPadding + ")");

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
      .attr("dx", 18)
      .attr("text-anchor", "end")
      .data([percentageCompleted])
      .transition()
      .duration(tweenDuration)
      .tween("text", textTween);

    var percentageComplete = indicator.append("svg:text")
      .attr("class", "percent")
      .attr("dy", 15)
      .attr("dx", 27)
      .attr("text-anchor", "middle")
      .text("%");

    var paths = indicator.append("svg:path")
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      .attr("class", "arc")
      .data(arcData)
      .transition()
      .duration(tweenDuration)
      .attrTween("d", arcTween);

    var triangle = svg.selectAll(".milestone")
      .data(opts.milestones)
      .enter()
      .append("path")
      .attr("d", "M  0 0 l -8 -8 l 16 0 z")
      .attr("class", "milestone")
      .attr("transform", function(d) {
        var x = (Math.sin(d.radian) * radius) + radius + xPadding,
          y = 0 - ((Math.cos(d.radian) * radius) - radius - yPadding),
          rotate = (d.radian * 180 / Math.PI);
        return "translate(" + x + "," + y + "), rotate (" + rotate + ")";
      })
      .transition()
      .duration(tweenDuration)
      .tween("acheivedMilstones", milestoneTween);
  }

  return ProgressIndicator;
})();
