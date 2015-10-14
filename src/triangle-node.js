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

