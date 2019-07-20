var W3 = "http://www.w3.org/2000/svg";

function gridId(x, y) {
    return "grid-" + x + "-" + y;
}

function textColor(id, color) {
    document.getElementById(id).style.color = color;
}

function createSvg(containerId, svgShape, attributes) {
    var newSvg = document.createElementNS(W3, svgShape);
    var n = attributes.length;
    for (var i = 0; i < n; i++) {
        newSvg.setAttribute(attributes[i][0], attributes[i][1]);
    }
    document.getElementById(containerId).appendChild(newSvg);
}

function createSquare(containerId, unit, x, y, color, id) {
    var squareAttributes = [
        ["id", id],
        ["x", x],
        ["y", y],
        ["width", unit],
        ["height", unit],
        ["fill", color],
        ["opacity", 0.45],
    ];
    createSvg(containerId, "rect", squareAttributes);
}

function createCircle(containerId, radius, x, y, color, id) {
    var circleAttributes = [
        ["id", id],
        ["cx", x + radius],
        ["cy", y + radius],
        ["r", radius * 0.82],
        ["fill", color],
        ["opacity", 0.9],
    ];
    createSvg(containerId, "circle", circleAttributes);
}

function checkGridId(id) {
    return id.indexOf("grid-") !== -1;
}

function findCoordinate(ps, qs, x, y) {
    var xs = findAll(ps, x);
    var n = xs.length;
    var ys = new Array(n);
    for (var i = 0; i < n; i++) {
        ys[i] = qs[xs[i]];
    }
    return findAll(ys, y).length === 0;
}

function calculateEdges(resolution, unit) {
    var edges = new Array(resolution);
    for (var i = 0; i < resolution; i++) {
        edges[i] = i * unit;
    }
    return {
        edges: edges,
        target: permute(edges, edges),
    };
}
