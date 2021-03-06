function Triangle() {
    this.colour = this.getRandomColour();
    this.nodes = [];
    this.center = {
        x: 0,
        y: 0
    };
    this.hasHighlight = false;
}

Triangle.prototype.availableColours = [
    '#dddddd',
    '#cccccc',
    '#bbbbbb',
    '#aaaaaa'
];

Triangle.prototype.highlightColour = '#ffffff';
Triangle.prototype.highlightRadius = 100;

Triangle.prototype.getRandomColour = function() {
    function randomBetween(start, end) {
        return Math.round(Math.random() * (end - start)) + start;
    }
    return this.availableColours[randomBetween(0, this.availableColours.length -1)]
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
        difference = difference > this.highlightRadius ? this.highlightRadius : difference;
        difference = this.highlightRadius - difference;
    }
    this.hasHighlight = difference > 0;

    return this.changeColour(this.colour, this.highlightColour, difference);
};

Triangle.prototype.getMouseDistance = function(position, mousePosition) {
    return Math.sqrt(Math.pow(Math.abs(position.x - mousePosition.x), 2) + Math.pow(Math.abs(position.y - mousePosition.y), 2))
};

Triangle.prototype.changeColour = function(startColour, targetColour, blendAmount) {
    var startRGB = this.hexToRGB(startColour);
    var targetRGB = this.hexToRGB(targetColour);
    var difference = {
        r: (targetRGB.r - startRGB.r) * (blendAmount / this.highlightRadius),
        g: (targetRGB.g - startRGB.g) * (blendAmount / this.highlightRadius),
        b: (targetRGB.b - startRGB.b) * (blendAmount / this.highlightRadius)
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
    function componentToHex(component) {
        var hex = component.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
    return '#' + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b);
};

Triangle.prototype.calculateCenter = function() {
    var bigX = 0,
        smallX = 0,
        bigY = 0,
        smallY = 0;
    if (this.nodes) {
        this.nodes.map(function(node) {
            bigX = bigX ? Math.max(bigX, node.x) : node.x;
            bigY = bigY ? Math.max(bigY, node.y) : node.y;
            smallX = smallX ? Math.min(smallX, node.x) : node.x;
            smallY = smallY ? Math.min(smallY, node.y) : node.y;
        });
        this.center.x = smallX + ((bigX - smallX) / 2);
        this.center.y = smallY + ((bigY - smallY) / 2);
    }
};
