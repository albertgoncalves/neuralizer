var W3 = "http://www.w3.org/2000/svg";

function gridId(x, y) {
    return "grid-" + x + "-" + y;
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

function findAll(arr, val) {
    var n = arr.length;
    var inds = [];
    for (i = 0; i < n; i++) {
        if (arr[i] === val) {
            inds.push(i);
        }
    }
    return inds;
}

function checkXY(xs, x, ys, y) {
    var ixs = findAll(xs, x);
    var n = ixs.length;
    var yys = new Array(n);
    for (var i = 0; i < n; i++) {
        yys[i] = ys[ixs[i]];
    }
    return findAll(yys, y).length === 0;
}
