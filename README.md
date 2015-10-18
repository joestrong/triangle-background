# Triangle Background

Creates a tessellating triangle background for your web page, with rollover highlight effect

[Demo](http://joestrong.github.io/triangle-background)

## Usage

```JavaScript
new TriangleBackground(
    containerElement,    // A DOM element, or CSS selector
    options              // Object containing options
);
```

## Option Reference

```Javascript
options: {
    color: []            // Specify the colours to use for the triangles, must be an array of hexadecimal style colours, defaults to a selection of greys
}
```

## Installing

### With NPM

```Shell
npm install --save triangle-background
```

### Without NPM

Download and extract the latest zip file into your project: https://github.com/joestrong/triangle-background/releases

## Getting Started

### With Browserify

```JavaScript
var TriangleBackground = require('triangle-background');

new TriangleBackground('#background');
```

### Without Browserify

```HTML
<!doctype html>
<html>
<body>
<div id="background"></div>
<script src="node_modules/triangle-background/dist/triangle-background.min.js"></script>
<script>
    new TriangleBackground('#background');
</script>
</body>
</html>
```

## Notes

As the background DOM element will be given position fixed, other elements will need to be positioned (e.g. relative) to appear above the background.
