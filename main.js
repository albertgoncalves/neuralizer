/* params */
const blue        = createColor("blue" , "hsl(205,  85%,  65%)");
const red         = createColor("red"  , "hsl(  5,  95%,  75%)");
const white       = createColor("white", "hsl(  0, 100%, 100%)");
// const colorA      = randomHsl();
// const colorB      = randomHsl();
// const colorC      = randomHsl();
const keys        = {66: blue, 82: red};
const keyY        = 76;
const keyN        = 78;
const len         = document.getElementById("figure").clientWidth;
const containerId = "axis";
const res         = Math.pow(2, 5);
const unit        = len / res;
const halfUnit    = unit / 2;
const edges       = forRange(0, res).map((x) => x * unit);
const gridEdges   = iterGrid(edges, edges);
const xs          = [];
const ys          = [];
const labels      = [];
let colorState    = [red, blue];

/* side-effects */
const helpColor  = () => {
    textColor(colorState[0].name, colorState[0].hsl);
    textColor(colorState[1].name, "black");
};
const drawGrid   = (x, y) => gridUnit(x, y, white.hsl, gridId(x, y));
// const colorFun   = (x, y) => (x + y) >= len ? blue.hsl
//                                             : red.hsl;
// const drawGrid   = (x, y) => gridUnit(x, y, colorFun(x, y), gridId(x, y));
const randomGrid = (x, y) => changeColor(randomHsl(), gridId(x, y));
const textColor  = (id, color) => {
    document.getElementById(id).style.color = color;
};
const gridUnit   = createSquare(containerId, unit);
const circleUnit = createCircle(containerId, halfUnit);
const clickGrid  = (gridId) => {
    const affectGrid = (x, y) => {
        xs.push(x);
        ys.push(y);
        labels.push(colorState[0].name);
        circleUnit(x, y, colorState[0].hsl, circleId(x, y));
    };
    const [x, y] = idToCoords(gridId);
    return checkXY(xs, x, ys, y) ? affectGrid(x, y)
                                 : null;
};
const predColorMap = (binary) => binary === 0 ? blue
                                              : red;
const applyPred = (predCells) => {
    predCells.forEach(([x, y, colorVal]) => {
        const color = predColorMap(colorVal);
        changeColor(color.hsl, gridId(x, y));
    });
};
const keyAction = (key) => {
    const colorSwitch = (key) => {
        const flipColors = () => {
            colorState = colorState.reverse();
            helpColor();
        };
        const colorObj = keys[key];
        const _ = colorObj !== colorState[0] ? flipColors()
                                             : null;
    };
    const _ = keys.hasOwnProperty(key) ? colorSwitch(key)
        : key === keyN ? applyPred(testAxis(edges, edges)(xs, ys, labels))
                       : key === keyY ? location.reload()
                                      : null;
};
const deleteGrid = (containerId) => {
    const container = document.getElementById(containerId);
    while (container.lastChild) container.removeChild(container.lastChild);
};

/* main */
helpColor();
gridEdges(drawGrid);
// gridEdges(randomGrid);
document.onmouseup = (e) => {
    const clickId = e.target.id;
    const _ = checkGridId(clickId) ? clickGrid(clickId)
                                   : null;
};
document.onkeydown = (e) => e.keyCode ? keyAction(e.keyCode)
                                      : null;
