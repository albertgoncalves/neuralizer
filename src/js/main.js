/* graphics params */
const blue = createColor("blue", "hsl(205, 85%, 65%)");
const red = createColor("red", "hsl(5, 95%, 75%)");
const white = createColor("white", "hsl(0, 100%, 100%)");
const keys = {66: blue, 82: red};
const keyY = 76;
const keyN = 78;
const len = document.getElementById("figure").clientWidth;
const containerId = "axis";
const res = Math.pow(2, 5);
const unit = len / res;
const halfUnit = unit / 2;
const edges = forRange(0, res).map((x) => x * unit);
const predEdges = edgePermute(edges, edges);

let colorState = [red, blue];
const labelMap = {"red" : 0, "blue": 1};
const predColorMap = {};

for (let color of colorState) {
    predColorMap[labelMap[color.name]] = color.hsl;
}

/* model params */
const xs = [];
const ys = [];
const labels = [];
const params = {nHiddenDim: 4, regLambda: 0.05, epsilon: 0.05, nLoops: 100};

/* side-effects */
const gridUnit = createSquare(containerId, unit);
const circleUnit = createCircle(containerId, halfUnit);

const textColor = (id, color) => {
    document.getElementById(id).style.color = color;
};

const helpColor = () => {
    textColor(colorState[0].name, colorState[0].hsl);
    textColor(colorState[1].name, "black");
};

const clickGrid = (gridId) => {
    const affectGrid = (x, y) => {
        xs.push(x);
        ys.push(y);
        labels.push(colorState[0].name);
        circleUnit(x, y, colorState[0].hsl, circleId(x, y));
    };

    const [x, y] = idToCoords(gridId);

    return checkXY(xs, x, ys, y) ? affectGrid(x, y) : null;
};

const applyPred = (predCells) => {
    const apply = ([x, y, colorVal]) => {
        changeColor(predColorMap[colorVal], gridId(x, y));
    };

    predCells.forEach(apply);
};

const keyAction = (key) => {
    const colorKey = keys.hasOwnProperty(key);

    const flipColors = () => {
        colorState = colorState.reverse();
        helpColor();
    };

    const colorSwitch = (key) => {
        const colorObj = keys[key];
        const _ = colorObj !== colorState[0] ? flipColors() : null;
    };

    const predExpr = () => {
        applyPred(predAxis(predEdges)(xs, ys, labels, labelMap)(params));
    };

    const _ = colorKey ? colorSwitch(key)
        : (key === keyN) && (xs.length > 0) ? predExpr()
        : key === keyY ? location.reload()
        : null;
};

const drawEdges = (x, y) => gridUnit(x, y, white.hsl, gridId(x, y));

/* main */
helpColor();
edges.forEach((x) => edges.forEach((y) => drawEdges(x, y)));

document.onmouseup = (e) => {
    const clickId = e.target.id;
    const _ = checkGridId(clickId) ? clickGrid(clickId) : null;
};

document.onkeydown = (e) => e.keyCode ? keyAction(e.keyCode) : null;
