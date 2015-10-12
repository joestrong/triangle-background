describe("Triangle", function() {

  var fs = require('fs'),
      trianglejs = fs.readFileSync('src/triangle.js', 'utf-8');
  eval(trianglejs);

  beforeEach(function() {
    triangle = new Triangle();
  });

  it("should be instantiatable", function() {
    expect(triangle).toEqual(jasmine.any(Triangle));
  });

  it("should be able to get a random colour", function() {
    expect(triangle.getRandomColour()).toEqual(jasmine.any(String));
  });

  
});
