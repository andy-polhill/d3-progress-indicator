var ProgressIndicator = (function() {

  ProgressIndicator.prototype = {

    arcTween : function(d, i) {
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
    },

    textTween : function(d, i) {
      var i = d3.interpolate(this.textContent, d);
      return function(t) {
        this.textContent = Math.round(i(t));
      };
    },

    milestoneTween : function(d, i) {
      var i = d3.interpolateRound(0, d.percentageCompleted),
          triangle = d3.select(this),
          value = d.value;
      return function(t) {
        if(value < Math.round(i(t))) {
          triangle.classed('active', true);
        }
      };
    }
  }

  function ProgressIndicator(opts, data) {

    if(arguments.length < 2) {
      throw "Please provide options and data for the indicator"
    }

    var
      radius = opts.radius || 100,
      diameter = radius * 2,
      xPadding = opts.xPadding || 25,//100,
      yPadding = opts.yPadding || 25,//20,
      width = diameter + (xPadding * 2),
      height = diameter + (yPadding * 2),
      milestoneRadius = innerRadius / 10,
      milestoneTriangle = opts.milestoneTriangle || 8,
      fontSize = opts.fontSize || 45,
      innerRadius = fontSize + 2,
      tweenDuration = opts.duration || 2500;

    var arc = d3.svg.arc()
      .startAngle( function (d) {
        return d.startAngle;
      })
      .endAngle( function (d) {
        return d.endAngle;
      })
      .innerRadius(innerRadius)
      .outerRadius(radius);

    //Arc to position milestone labels
    var labelArc = d3.svg.arc()
      .innerRadius(radius + (milestoneTriangle * 2))
      .outerRadius(radius + (milestoneTriangle * 2));

    //FIXME: Arc tween cannot be on the prototype due to it's dependency
    //on non-static arc variable, if possible handle this better.
    this.arcTween = function(d, i) {
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
    };

    var percentageCompleted = data.percentageCompleted || 0;

    var arcData = [{
      startAngle:0,
      endAngle:(percentageCompleted / 100) * (Math.PI * 2)
    }];

    //Add Elements
    var svg = d3.select(opts.selector).append("svg:svg")
      .attr("width", width)
      .attr("height", height);

    var indicator = svg.append("svg:g")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("transform", "translate(" + (diameter/2 + xPadding) + "," + (diameter/2 + yPadding) + ")");

    indicator.append("svg:circle")
      .attr("class", "outer-circle")
      .attr("r", radius);

    indicator.append("svg:circle")
      .attr("class", "inner-circle")
      .attr("r", innerRadius);

    var textGroup = indicator.append("svg:g")
      .attr("transform", "translate(" + fontSize / 2 + ",0)");

    textGroup.append("svg:text")
      .attr("class", "total")
      .attr("dy", fontSize / 3)
      .attr("font-size", fontSize)
      .attr("text-anchor", "end")
      .data([percentageCompleted])
      .transition()
      .duration(tweenDuration)
      .tween("text", this.textTween);

    textGroup.append("svg:text")
      .attr("class", "percent")
      .attr("dy", fontSize / 3)
      .attr("font-size", fontSize / 2)
      .attr("text-anchor", "start")
      .text("%");

    indicator.append("svg:path")
      .attr("class", "arc")
      .data(arcData)
      .transition()
      .duration(tweenDuration)
      .attrTween("d", this.arcTween);

    if(data.milestones) {
      //Add a radian valuse for each milestone
      d3.map(data.milestones).forEach(function(i, milestone) {
        milestone.radian = milestone.value / 100 * (2 * Math.PI);
        milestone.percentageCompleted = percentageCompleted;
      });

      var trianglePath = "M  0 0 l " + (0 - milestoneTriangle) + " "
        + (0 - milestoneTriangle) + " l " + (milestoneTriangle * 2) +" 0 z";

      svg.selectAll(".milestone")
        .data(data.milestones)
        .enter()
        .append("path")
        .attr("d", trianglePath)
        .attr("class", "milestone")
        .attr("transform", function(d) {
          var x = (Math.sin(d.radian) * radius) + radius + xPadding,
            y = 0 - ((Math.cos(d.radian) * radius) - radius - yPadding),
            rotate = (d.radian * 180 / Math.PI);
          return "translate(" + x + "," + y + "), rotate (" + rotate + ")";
        })
        .transition()
        .duration(tweenDuration)
        .tween("acheivedMilstones", this.milestoneTween);

      indicator.selectAll(".milestone-text")
        .data(data.milestones)
        .enter()
        .append("text")
        .attr("class", "milestone-text")
        .attr("dy", 4)
        .attr("text-content", function(d, i) {
          this.textContent = d.text;
        })
        .attr("text-anchor", function(d) {
          //TODO Is there a more suitable way to do this with D3
          if(d.value > 0 && d.value < 50 ) {
            return "start";
          }
          else if(d.value > 50 && d.value < 100 ) {
            return "end";
          }
          else if( d.value === 50 || d.value === 100 ) {
            return "middle";
          }
        })
        .attr("transform", function(d) {
          var x = (Math.sin(d.radian) * radius) + radius + xPadding,
            y = 0 - ((Math.cos(d.radian) * radius) - radius - yPadding);

          labelArc
            .endAngle(d.radian)
            .startAngle(d.radian);

          centroid = labelArc.centroid(d.radian);
          return "translate(" + centroid + ")";
        });
    }
  }

  return ProgressIndicator;
})();
