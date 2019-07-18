function textColor(id, color) {
    document.getElementById(id).style.color = color;
}

function helpColor() {
    textColor(colorState[0].name, colorState[0].hsl);
    textColor(colorState[1].name, "black");
}

function affectGrid(x, y) {
    xs.push(x);
    ys.push(y);
    labels.push(colorState[0].name);
    circleUnit(x, y, colorState[0].hsl, "circle-" + x + "-" + y);
}

function clickGrid(gridId) {
    var xy = gridId.match(/\d+/g).map(Number);
    if (checkXY(xs, xy[0], ys, xy[1])) {
        affectGrid(xy[0], xy[1]);
    }
}

function applyf(xyz) {
    document.getElementById(gridId(xyz[0], xyz[1])).style.fill =
        predColorMap[xyz[2]];
}

function applyPred(predCells) {
    predCells.forEach(applyf);
}

function flipColors() {
    colorState = colorState.reverse();
    helpColor();
}

function colorSwitch(key) {
    var colorObj = keys[key];
    if (colorObj !== colorState[0]) {
        flipColors();
    }
}

function predExpr() {
    applyPred(predAxis(predEdges)(xs, ys, labels, labelMap)(params));
}

function keyAction(key) {
    if (keys.hasOwnProperty(key)) {
        colorSwitch(key);
    } else if ((key === keyN) && (xs.length > 0)) {
        predExpr();
    } else if (key === keyY) {
        location.reload();
    }
}

function drawEdges(x, y) {
    gridUnit(x, y, white.hsl, gridId(x, y));
}

var blue = {
    "name": "blue",
    "hsl": "hsl(205, 85%, 65%)",
};
var red = {
    "name": "red",
    "hsl": "hsl(5, 95%, 75%)",
};
var white = {
    "name": "white",
    "hsl": "hsl(0, 100%, 100%)",
};
var keys = {66: blue, 82: red};
var keyY = 76;
var keyN = 78;
var len = document.getElementById("figure").clientWidth;
var containerId = "axis";
var res = Math.pow(2, 5);
var unit = len / res;
var halfUnit = unit / 2;
var edges = forRange(0, res).map(function(x) {
    return x * unit;
});
var predEdges = edgePermute(edges, edges);
var colorState = [red, blue];
var labelMap = {"red": 0, "blue": 1};
var predColorMap = {};
var n = colorState.length;
for (var i = 0; i < n; i++) {
    predColorMap[labelMap[colorState[i].name]] = colorState[i].hsl;
}
var xs = [];
var ys = [];
var labels = [];
var params = {
    nHiddenDim: 4,
    regLambda: 0.05,
    epsilon: 0.05,
    nLoops: 100,
};
var gridUnit = createSquare(containerId, unit);
var circleUnit = createCircle(containerId, halfUnit);

helpColor();
edges.forEach(function(x) {
    edges.forEach(function(y) {
        drawEdges(x, y);
    });
});
document.onmouseup = function(e) {
    var clickId = e.target.id;
    if (checkGridId(clickId)) {
        clickGrid(clickId);
    }
};
document.onkeydown = function(e) {
    if (e.keyCode) {
        keyAction(e.keyCode);
    }
};
