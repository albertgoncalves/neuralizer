"use strict";

/*  global findAll, permute */

function textColor(id, color) {
    var element = document.getElementById(id);
    if (element) {
        element.style.color = color;
    }
}

function createSvg(id, shape, attributes) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", shape);
    var n = attributes.length;
    for (var i = 0; i < n; i++) {
        svg.setAttribute(attributes[i][0], attributes[i][1]);
    }
    document.getElementById(id).appendChild(svg);
}

function createSquare(containerId, unit, id, x, y, color) {
    var attributes = [
        ["id", id],
        ["x", x],
        ["y", y],
        ["width", unit],
        ["height", unit],
        ["fill", color],
        ["opacity", 0.45],
    ];
    createSvg(containerId, "rect", attributes);
}

function createCircle(containerId, radius, id, x, y, color) {
    var attributes = [
        ["id", id],
        ["cx", x + radius],
        ["cy", y + radius],
        ["r", radius * 0.82],
        ["fill", color],
        ["opacity", 0.9],
    ];
    createSvg(containerId, "circle", attributes);
}

function emptyCoordinate(ps, qs, x, y) {
    var xs = findAll(x, ps);
    var n = xs.length;
    var ys = new Array(n);
    for (var i = 0; i < n; i++) {
        ys[i] = qs[xs[i]];
    }
    return findAll(y, ys).length === 0;
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
