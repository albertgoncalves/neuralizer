function updateText(selection) {
    textColor(selection[0].name, selection[0].hsl);
    textColor(selection[1].name, "black");
    textColor(selection[2].name, "black");
}

function affectGrid(state, unit, x, y) {
    state.xs.push(x);
    state.ys.push(y);
    state.labels.push(state.selection[0].value);
    createCircle(state.containerId, unit / 2, "circle-" + x + "-" + y, x, y,
                 state.selection[0].hsl);
}

function clickGrid(state, unit, gridId) {
    var coordinate = gridId.match(/\d+/g);
    var x = Number(coordinate[0]);
    var y = Number(coordinate[1]);
    if (findCoordinate(state.xs, state.ys, x, y)) {
        affectGrid(state, unit, x, y);
    }
}

function resultMap(terrain, color) {
    var n = terrain.length;
    var p;
    var q;
    for (var i = 0; i < n; i++) {
        p = terrain[i];
        if (p[2] === color.red.value) {
            q = color.red;
        } else if (p[2] === color.green.value) {
            q = color.green;
        } else {
            q = color.blue;
        }
        document.getElementById(gridId(p[0], p[1])).style.fill = q.hsl;
    }
}

function keyAction(state, key, color) {
    if (state.keyColor.hasOwnProperty(key)) {
        var selection = state.keyColor[key];
        if (selection !== state.selection[0]) {
            if (selection === color.red) {
                state.selection = [color.red, color.blue, color.green];
            } else if (selection === color.green) {
                state.selection = [color.green, color.red, color.blue];
            } else {
                state.selection = [color.blue, color.green, color.red];
            }
            updateText(state.selection);
        }
    } else if ((key === state.keyPress.n) && (state.xs.length > 0)) {
        var xs = normalize(state.xs);
        var ys = normalize(state.ys);
        var trainX = zip(xs.unit, ys.unit);
        var testX = zip(unitScale(state.terrain.target.xs, xs.mu, xs.sigma),
                        unitScale(state.terrain.target.ys, ys.mu, ys.sigma));
        var testY = neuralNetwork(trainX, state.labels, testX, state.inputDim,
                                  state.outputDim, state.hiddenDim,
                                  state.lambda, state.epsilon, state.n);
        var result = [state.terrain.target.xs, state.terrain.target.ys, testY];
        resultMap(transpose(result), color);
    } else if (key === state.keyPress.l) {
        location.reload();
    }
}

function main() {
    var color = {
        white: {
            name: "white",
            hsl: "hsl(0, 100%, 100%)",
        },
        red: {
            name: "red",
            hsl: "hsl(5, 95%, 75%)",
            value: 0,
        },
        green: {
            name: "green",
            hsl: "hsl(142, 40%, 50%)",
            value: 1,
        },
        blue: {
            name: "blue",
            hsl: "hsl(205, 85%, 65%)",
            value: 2,
        },
    };
    var resolution = Math.pow(2, 5);
    var unit = document.getElementById("figure").clientWidth / resolution;
    var state = {
        containerId: "axis",
        selection: [color.red, color.blue, color.green],
        terrain: calculateEdges(resolution, unit),
        keyPress: {
            l: 76,
            n: 78,
        },
        keyColor: {
            82: color.red,
            71: color.green,
            66: color.blue,
        },
        inputDim: 2,
        outputDim: 3,
        hiddenDim: 4,
        lambda: 0.05,
        epsilon: 0.05,
        n: 100,
        xs: [],
        ys: [],
        labels: [],
    };
    updateText(state.selection);
    for (var i = 0; i < resolution; i++) {
        var x;
        var y;
        for (var j = 0; j < resolution; j++) {
            x = state.terrain.edges[i];
            y = state.terrain.edges[j];
            createSquare(state.containerId, unit, gridId(x, y), x, y,
                         color.white.hsl);
        }
    }
    document.onmouseup = function(e) {
        var clickId = e.target.id;
        if (checkGridId(clickId)) {
            clickGrid(state, unit, clickId);
        }
    };
    document.onkeydown = function(e) {
        if (e.keyCode) {
            keyAction(state, e.keyCode, color);
        }
    };
}

main();
