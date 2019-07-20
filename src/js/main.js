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
var KEYS = {
    66: BLUE,
    82: RED,
};
var KEYY = 76;
var KEYN = 78;
var RES = Math.pow(2, 5);
var CONTAINERID = "axis";
var UNIT = document.getElementById("figure").clientWidth / RES;
var EDGES = new Array(RES);
for (var i = 0; i < RES; i++) {
    EDGES[i] = i * UNIT;
}
var PREDEDGES = permute(EDGES, EDGES);
var COLORSTATE = [RED, BLUE];
var LABELMAP = {
    "red": 0,
    "blue": 1,
};
var PREDCOLORMAP = {};
for (var i = 0; i < 2; i++) {
    PREDCOLORMAP[LABELMAP[COLORSTATE[i].name]] = COLORSTATE[i].hsl;
}
var PARAMS = {
    inputDim: 2,
    outputDim: 2,
    hiddenDim: 4,
    lambda: 0.05,
    epsilon: 0.05,
    nLoops: 100,
};
var LABELS = [];
var XS = [];
var YS = [];

function helpColor() {
    textColor(COLORSTATE[0].name, COLORSTATE[0].hsl);
    textColor(COLORSTATE[1].name, "black");
}

function affectGrid(x, y) {
    XS.push(x);
    YS.push(y);
    LABELS.push(COLORSTATE[0].name);
    createCircle(CONTAINERID, UNIT / 2, x, y, COLORSTATE[0].hsl,
                 "circle-" + x + "-" + y);
}

function clickGrid(gridId) {
    var xy = gridId.match(/\d+/g);
    var xys = new Array(2);
    for (var i = 0; i < 2; i++) {
        xys[i] = Number(xy[i]);
    }
    if (findXY(XS, YS, xys[0], xys[1])) {
        affectGrid(xys[0], xys[1]);
    }
}

function applyPred(predCells) {
    var n = predCells.length;
    var x;
    for (var i = 0; i < n; i++) {
        x = predCells[i];
        document.getElementById(gridId(x[0], x[1])).style.fill =
            PREDCOLORMAP[x[2]];
    }
}

function flipColors() {
    COLORSTATE = COLORSTATE.reverse();
    helpColor();
}

function colorSwitch(key) {
    var colorObj = KEYS[key];
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
                              params.lambda, params.epsilon, params.nLoops);
    return transpose([xy.xs, xy.ys, testY]);
}

function keyAction(key) {
    if (KEYS.hasOwnProperty(key)) {
        colorSwitch(key);
    } else if ((key === KEYN) && (XS.length > 0)) {
        applyPred(pipeline(PREDEDGES, XS, YS, LABELS, LABELMAP, PARAMS));
    } else if (key === KEYY) {
        location.reload();
    }
}

function main() {
    helpColor();
    for (var i = 0; i < RES; i++) {
        var x;
        var y;
        for (var j = 0; j < RES; j++) {
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
