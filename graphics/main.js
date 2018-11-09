/* params */
const blue        = createColor("Blue" , "hsl(205,  85%,  65%)");
const red         = createColor("Red"  , "hsl(  5,  95%,  75%)");
const white       = createColor("White", "hsl(  0, 100%, 100%)");
// const colorA      = randomHsl();
// const colorB      = randomHsl();
// const colorC      = randomHsl();
const keys        = {66: blue, 82: red};
const len         = document.getElementById("figure").clientWidth;
const containerId = "axis";
const res         = Math.pow(2, 2);
const unit        = len / res;
const halfUnit    = unit / 2;
const edges       = range(res).map((x) => x * unit);
const gridEdges   = iterGrid(edges, edges);
const xs          = [];
const ys          = [];
const labels      = [];
let colorState    = blue;

/* side-effects */
//const drawGrid   = (x, y) => gridUnit(x, y, white.hsl, gridId(x, y));
const colorFun   = (x, y) => (x + y) >= len ? blue.hsl
                                            : red.hsl;
const drawGrid   = (x, y) => gridUnit(x, y, colorFun(x, y), gridId(x, y));
const randomGrid = (x, y) => changeColor(randomHsl(), gridId(x, y));
const innerHtml  = (id, text) => document.getElementById(id).innerHTML = text;
const gridUnit   = createSquare(containerId, unit);
const circleUnit = createCircle(containerId, halfUnit);
const clickGrid  = (gridId) => {
    const affectGrid = (x, y) => {
        xs.push(x);
        ys.push(y);
        labels.push(colorState.color);
        circleUnit(x, y, colorState.hsl, circleId(x, y));
    };
    const [x, y] = idToCoords(gridId);
    return checkXY(xs, x, ys, y) ? affectGrid(x, y)
                                 : null;
};
const keyAction = (key) => {
    const colorSwitch = (key) => {
        const colorObj = keys[key];
        colorState = colorObj;
        innerHtml("print", colorObj.color);
    };
    const _ = keys.hasOwnProperty(key) ? colorSwitch(key)
                                       : null;
};
const deleteGrid = (containerId) => {
    const container = document.getElementById(containerId);
    while (container.lastChild) container.removeChild(container.lastChild);
};

/* main */
gridEdges(drawGrid);
// gridEdges(randomGrid);
window.onclick = (e) => {
    const clickId = e.target.id;
    const _ = checkGridId(clickId) ? clickGrid(clickId)
                                   : null;
};
window.onkeydown = (e) => e.keyCode ? keyAction(e.keyCode)
                                    : null;
