//Not an exhaustive list of specs, but a good start point.

// https://github.com/mbostock/d3/issues/1789
var flushAllD3Transitions = function() {
  var now = Date.now;
  Date.now = function() { return Infinity; };
  d3.timer.flush();
  Date.now = now;
}

beforeEach(function() {
  fixture.load("progress-indicator.fixture.html");
});

afterEach(function() {
  fixture.cleanup();
});

describe("Instantiation", function() {
  it("should throw an error when no data or options provided", function() {
    expect(function() {
      new ProgressIndicator();
    }).toThrow();
  });

  it("should throw an error when only data or options is provided", function() {
    expect(function() {
      new ProgressIndicator({});
    }).toThrow();
  });

  it("should not throw an error when data and options objects are pprovided", function() {
    expect(function() {
      new ProgressIndicator({}, {});
    }).not.toThrow();
  });

  it("should create an SVG image when all options are present", function() {
    new ProgressIndicator({
      selector: "#" + fixture.el.id
    }, {
      percentageCompleted: 25
    });
    expect(fixture.el.querySelector("svg")).not.toBeNull;
  });
});

describe("Milestones", function() {
  it("should plot milestone markers around the indicator", function() {
    var milestones = [{
      value: 10,
      text: "milestone1"
    },{
      value: 20,
      text: "milestone2"
    }];

    new ProgressIndicator({
      selector: "#" + fixture.el.id
    }, {
      percentageCompleted: 25,
      milestones: milestones
    });
    expect(fixture.el.querySelectorAll("path.milestone").length).toEqual(milestones.length);
  });

  it("should add milestone labels alongside the milestone markers", function() {
    var milestones = [{
      value: 10,
      text: "milestone1"
    }];

    new ProgressIndicator({
      selector: "#" + fixture.el.id
    }, {
      percentageCompleted: 25,
      milestones: milestones
    });
    expect(fixture.el.querySelector("text.milestone-text")).not.toBeNull;
    expect(fixture.el.querySelector("text.milestone-text").textContent).toContain(milestones[0].text);
  });

  it("should mark any milestones as achieved if the progress has past that point", function() {

    var ACHIEVED_CLASS = "achieved";

    var milestones = [{
      value: 25,
      text: "acheived"
    },{
      value: 75,
      text: "not acheived"
    }];

    new ProgressIndicator({
      selector: "#" + fixture.el.id,
    }, {
      percentageCompleted: 50,
      milestones: milestones
    });

    flushAllD3Transitions();

    expect(fixture.el.querySelectorAll("path.milestone." + ACHIEVED_CLASS).length).toEqual(1);
    expect(fixture.el.querySelectorAll("path.milestone").length).toEqual(2);
  });
});
