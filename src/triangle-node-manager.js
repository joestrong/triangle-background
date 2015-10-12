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
        newTriangles.filter(function(newTriangle) {
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
        var isInPointerRadius = (Math.abs(triangle.center.x - this.mouseX) < 150 && Math.abs(triangle.center.y - this.mouseY) < 150);
        var isStrayHighlight = !isInPointerRadius && triangle.hasHighlight;
        return isInPointerRadius || isStrayHighlight;
    }.bind(this));
};
