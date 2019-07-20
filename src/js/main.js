var BLUE = {
    "name": "blue",
    "hsl": "hsl(205, 85%, 65%)",
};
var RED = {
    "name": "red",
    "hsl": "hsl(5, 95%, 75%)",
};
var WHITE = {
    "name": "white",
    "hsl": "hsl(0, 100%, 100%)",
};
var KEYCOLOR = {
    66: BLUE,
    82: RED,
};
var KEYPRESS = {
    y: 76,
    n: 78,
};
var RESOLUTION = Math.pow(2, 5);
var CONTAINERID = "axis";
var UNIT = document.getElementById("figure").clientWidth / RESOLUTION;
var EDGES = new Array(RESOLUTION);
for (var i = 0; i < RESOLUTION; i++) {
    EDGES[i] = i * UNIT;
}
var PREDEDGES = permute(EDGES, EDGES);
var COLORSTATE = [RED, BLUE];
var LABELMAP = {
    "red": 0,
    "blue": 1,
};
var COLORMAP = [RED.hsl, BLUE.hsl];
var PARAMS = {
    inputDim: 2,
    outputDim: 2,
    hiddenDim: 4,
    lambda: 0.05,
    epsilon: 0.05,
    n: 100,
};
var STATE = {
    xs: [],
    ys: [],
    labels: [],
};

function helpColor() {
    textColor(COLORSTATE[0].name, COLORSTATE[0].hsl);
    textColor(COLORSTATE[1].name, "black");
}

function affectGrid(x, y) {
    STATE.xs.push(x);
    STATE.ys.push(y);
    STATE.labels.push(COLORSTATE[0].name);
    createCircle(CONTAINERID, UNIT / 2, x, y, COLORSTATE[0].hsl,
                 "circle-" + x + "-" + y);
}

function clickGrid(gridId) {
    var coordinate = gridId.match(/\d+/g);
    var x = Number(coordinate[0]);
    var y = Number(coordinate[1]);
    if (findXY(STATE.xs, STATE.ys, x, y)) {
        affectGrid(x, y);
    }
}

function applyPred(predCells) {
    var n = predCells.length;
    var x;
    for (var i = 0; i < n; i++) {
        x = predCells[i];
        document.getElementById(gridId(x[0], x[1])).style.fill =
            COLORMAP[x[2]];
    }
}

function flipColors() {
    COLORSTATE = COLORSTATE.reverse();
    helpColor();
}

function colorSwitch(key) {
    var colorObj = KEYCOLOR[key];
    if (colorObj !== COLORSTATE[0]) {
        flipColors();
    }
}

function pipeline(xy, xs, ys, labels, labelMap, params) {
    var xsNorm = normalize(xs);
    var ysNorm = normalize(ys);
    var trainX = zip(xsNorm.units, ysNorm.units);
    var n = labels.length;
    var trainY = new Array(n);
    for (var i = 0; i < n; i++) {
        trainY[i] = labelMap[labels[i]];
    }
    var testX = zip(unitScale(xy.xs, xsNorm.mu, xsNorm.sigma),
                    unitScale(xy.ys, ysNorm.mu, ysNorm.sigma));
    var testY = neuralNetwork(trainX, trainY, testX, params.inputDim,
                              params.outputDim, params.hiddenDim,
                              params.lambda, params.epsilon, params.n);
    return transpose([xy.xs, xy.ys, testY]);
}

function keyAction(key) {
    if (KEYCOLOR.hasOwnProperty(key)) {
        colorSwitch(key);
    } else if ((key === KEYPRESS.n) && (STATE.xs.length > 0)) {
        applyPred(pipeline(PREDEDGES, STATE.xs, STATE.ys, STATE.labels,
                           LABELMAP, PARAMS));
    } else if (key === KEYPRESS.y) {
        location.reload();
    }
}

function main() {
    helpColor();
    for (var i = 0; i < RESOLUTION; i++) {
        var x;
        var y;
        for (var j = 0; j < RESOLUTION; j++) {
            x = EDGES[i];
            y = EDGES[j];
            createSquare(CONTAINERID, UNIT, x, y, WHITE.hsl, gridId(x, y));
        }
    }
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
}

main();
