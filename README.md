#D3 Progress Indicators

What started out as a bit of an experiment turned out pretty nice, so I thought
I would put it out there and see if anyone has any interest in it.

Take a look at the examples below and let me know if you have any ideas for
extensions/improvements

http://thatguynamedandy.github.com/d3-progress-indicators

##Usage


    bower install d3-progress-indicator --save`

Include the progress indicator and d3 library scripts in your page

    <script src="bower_components/d3/d3.min.js"></script>
    <script src="bower_components/d3-progress-indicators/lib/progress-indicator.js"></script>

Include the skeleton CSS to provide some basic styles.
The CSS is intended to be very lightweight, and it may be worth just creating your own styles

    <link rel="stylesheet" media="screen" href="bower_components/d3-progress-indicators/lib/progress-indicator.css">

Programmatically create your progress indicator, providing a selector for it to attach to.

    new ProgressIndicator({
      selector: "#progress-indicator-2",
      xPadding: 110
    }, {
      percentageCompleted: 78,
      milestones: [{
        value: 25,
        text: "Account created"
      }, {
        value: 50,
        text: "Profile complete"
      }, {
        value:75,
        text: "Profile visible"
      }]
    });

##Tests

To run the tests..... blah karma blah jasmine

##Limitations
- Due to the difficulty of text wrapping in SVG, the xPadding value has to be
  tweaked to make sure milestone labels fit in correctly. A future improvement may
  be to split labels on spaces.
