function Triangle() {
    this.colour = this.getRandomColour();
    this.nodes = [];
    this.center = {
        x: 0,
        y: 0
    };
    this.hoverColour = '#ffffff';
    this.hasHighlight = false;
}

Triangle.prototype.getRandomColour = function() {
    var colours = [
        '#939ABF',
        '#62667F',
        '#C4CDFF',
        '#757B99',
        '#B0B8E5'
    ];
    function randomBetween(start, end) {
        return Math.round(Math.random() * end) + start;
    }
    return colours[randomBetween(0, colours.length -1)]
};

Triangle.prototype.draw = function (ctx, mousePosition) {
    ctx.fillStyle = this.getColour(mousePosition);
    ctx.beginPath();
    this.nodes.map(function(node) {
        ctx.lineTo(node.x, node.y);
    }.bind(this));
    ctx.fill();
    ctx.closePath();
};

Triangle.prototype.getColour = function(mousePosition) {
    var difference = 0;
    // Check if mousePosition has been defined before trying to use it to determine the colour
    if (typeof mousePosition.x !== 'undefined' && typeof mousePosition.y !== 'undefined') {

        difference = this.getMouseDistance(this.center, mousePosition);
        difference = difference > 100 ? 100 : difference;
        difference = 100 - difference;
    }
    this.hasHighlight = difference > 0;

    return this.changeColour(this.colour, this.hoverColour, difference);
};

Triangle.prototype.getMouseDistance = function(position, mousePosition) {
    return Math.sqrt(Math.pow(Math.abs(position.x - mousePosition.x), 2) + Math.pow(Math.abs(position.y - mousePosition.y), 2))
};

Triangle.prototype.changeColour = function(startColour, targetColour, blendAmount) {
    var startRGB = this.hexToRGB(startColour);
    var targetRGB = this.hexToRGB(targetColour);
    var difference = {
        r: (targetRGB.r - startRGB.r) * (blendAmount / 100),
        g: (targetRGB.g - startRGB.g) * (blendAmount / 100),
        b: (targetRGB.b - startRGB.b) * (blendAmount / 100)
    };
    return this.RGBToHex({
        r: Math.round(startRGB.r + difference.r),
        g: Math.round(startRGB.g + difference.g),
        b: Math.round(startRGB.b + difference.b)
    });
};

Triangle.prototype.hexToRGB = function(hexString) {
    var red = parseInt(hexString.substr(1, 2), 16);
    var green = parseInt(hexString.substr(3, 2), 16);
    var blue = parseInt(hexString.substr(5, 2), 16);
    return { r: red, g: green, b: blue };
};

Triangle.prototype.RGBToHex = function (rgb) {
    return '#' + rgb.r.toString(16) + rgb.g.toString(16) + rgb.b.toString(16);
};