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

function TriangleNode(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
}

TriangleNode.prototype.extrapolateTriangles = function(spacing) {
    var triangles = [];
    for (var i = 0; i < 6; i++) {
        var triangle = new Triangle();
        triangle.nodes.push(this);
        triangle.nodes.push(new TriangleNode(
            this.x + (Math.cos(this.direction) * spacing),
            this.y + (Math.sin(this.direction) * spacing),
            this.direction
        ));
        this.rotate();
        triangle.nodes.push(new TriangleNode(
            this.x + (Math.cos(this.direction) * spacing),
            this.y + (Math.sin(this.direction) * spacing),
            this.direction
        ));
        triangle.calculateCenter();
        triangles.push(triangle);
    }
    return triangles;
};

TriangleNode.prototype.rotate = function() {
    var degreesChange = 60,
        radiansChange = degreesChange * (Math.PI / 180);
    this.direction += radiansChange;
    if (this.direction > 360 * (Math.PI / 180)) {
        this.direction -= (360 * (Math.PI / 180));
    }
};


function TriangleNodeManager(center, triangleSize, ctx, bounds) {
    this.spacing = triangleSize;
    this.nodes = [new TriangleNode(center.x, center.y, 0)];
    this.queue = [0];
    this.triangles = [];
    this.ctx = ctx;
    this.bounds = bounds;
    this.calculatePositions();
    this.drawableTriangles = this.triangles;
    this.drawTriangles();
    this.drawableTriangles = [];
}

TriangleNodeManager.prototype.restart = function(center) {
    this.nodes = [new TriangleNode(center.x, center.y, 0)];
    this.queue = [0];
    this.triangles = [];
    this.calculatePositions();
    this.drawableTriangles = this.triangles;
};

TriangleNodeManager.prototype.calculatePositions = function() {
    while (this.queue.length > 0){
        var node = this.nodes[this.queue.shift()];
        var newTriangles = node.extrapolateTriangles(this.spacing);
        newTriangles.map(function(triangle) {
            var newNode = triangle.nodes[1];
            if (!this.findNode(newNode) && !this.isOutOfBounds(newNode)) {
                this.nodes.push(newNode);
                this.queue.push(this.nodes.indexOf(newNode));
            }
        }.bind(this));
        newTriangles = newTriangles.filter(function(newTriangle) {
            return !this.findTriangle(newTriangle);
        }.bind(this));
        this.triangles = this.triangles.concat(newTriangles);
    }
};

TriangleNodeManager.prototype.drawTriangles = function() {
    this.drawableTriangles.map(function(triangle) {
        triangle.draw(this.ctx, { x: this.mouseX, y: this.mouseY });
    }.bind(this));
    window.requestAnimationFrame(this.drawTriangles.bind(this));
};

TriangleNodeManager.prototype.findNode = function(nodeToFind) {
    var matches = this.nodes.filter(function(node) {
        return Math.round(node.x) === Math.round(nodeToFind.x) &&
            Math.round(node.y) === Math.round(nodeToFind.y);
    });
    return matches.length;
};

TriangleNodeManager.prototype.isOutOfBounds = function(node) {
    if (node.x > this.bounds.width || node.x < 0 || node.y > this.bounds.height || node.y < 0) {
        return true;
    }
    return false;
};

TriangleNodeManager.prototype.findTriangle = function(triangleToFind) {
    var matches = this.triangles.filter(function(triangle) {
        return Math.round(triangle.center.x) === Math.round(triangleToFind.center.x) &&
            Math.round(triangle.center.y) === Math.round(triangleToFind.center.y);
    });
    return matches.length;
};

TriangleNodeManager.prototype.setMousePosition = function(x, y) {
    this.mouseX = x;
    this.mouseY = y;
    this.drawableTriangles = this.getDrawableTriangles();
};

TriangleNodeManager.prototype.getDrawableTriangles = function() {
    return this.triangles.filter(function(triangle) {
        var isInPointerRadius = (Math.abs(triangle.center.x - this.mouseX) < Triangle.prototype.highlightRadius && Math.abs(triangle.center.y - this.mouseY) < Triangle.prototype.highlightRadius);
        var isStrayHighlight = !isInPointerRadius && triangle.hasHighlight;
        return isInPointerRadius || isStrayHighlight;
    }.bind(this));
};

"use strict";

function TriangleBackground(source, options) {
    switch(typeof source) {
	case "string":
            this.containerElement = document.querySelector(source);
	    break;
        case "object":
	    this.containerElement = source;
            break;
        default:
            console.log("TriangleBackground: First argument should be a CSS selector or a DOM element");
            return;
            break;
    }
    if (options) {
        if (options.color) {
            Triangle.prototype.availableColours = options.color;
        }
        if (options.mouseHoverHighlight) {
            if (options.mouseHoverHighlight.color) {
                Triangle.prototype.highlightColour = options.mouseHoverHighlight.color;
            }
            if (options.mouseHoverHighlight.radius) {
                Triangle.prototype.highlightRadius = options.mouseHoverHighlight.radius;
            }
        }
    }
    this.triangleSize = 50;
    this.initFrame();
    this.initTriangles();
    window.addEventListener('resize', this.resize.bind(this));

    if(!options || options.mouseHoverHighlight !== false) {
        window.addEventListener('mousemove', this.mouseMove.bind(this));
    }
}

TriangleBackground.prototype.initFrame = function() {
    this.canvasElement = document.createElement('canvas');
    this.drawingContext = this.canvasElement.getContext("2d");
    this.containerElement.appendChild(this.canvasElement);
    this.containerElement.style.position = "fixed";
    this.containerElement.style.width = "100%";
    this.containerElement.style.height = "100%";
    this.calculateSize();
};

TriangleBackground.prototype.calculateSize = function() {
    this.width = this.containerElement.clientWidth;
    this.height = this.containerElement.clientHeight;
    this.canvasElement.width = this.width;
    this.canvasElement.height = this.height;
};

TriangleBackground.prototype.resize = function() {
    this.calculateSize();
    this.restartTriangles();
};

TriangleBackground.prototype.mouseMove = function(event) {
    if (this.nodeManager) {
        this.nodeManager.setMousePosition(event.clientX, event.clientY);
    }
};

TriangleBackground.prototype.initTriangles = function() {
    var center = {
        x: this.width / 2,
        y: this.height /2
    };
    this.nodeManager = new TriangleNodeManager(
        center,
        this.triangleSize,
        this.drawingContext,
        { width: this.width, height: this.height }
    );
};

TriangleBackground.prototype.restartTriangles = function() {
    var center = {
        x: this.width / 2,
        y: this.height /2
    };
    this.nodeManager.restart(center);
};

if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = TriangleBackground;
}
