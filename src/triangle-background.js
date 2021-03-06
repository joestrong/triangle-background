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
