/* pure functions */
const findAll = (arr, val) => {
    const is = [];
    let i = -1;
    for (i = 0; i < arr.length; i++) {
        const _ = arr[i] === val ? is.push(i)
                                 : null;
    }
    return is;
};
const checkGridId = (id) => id.indexOf("grid-") !== -1;
const idToCoords  = (gridId) => gridId.match(/\d+/g).map(Number);
const createColor = (color, hsl) => { return {color, hsl}; };
const checkXY = (xs, x, ys, y) => {
    const ixs = findAll(xs, x);
    const iys = ixs.map((ix) => ys[ix]);
    return findAll(iys, y).length > 0 ? true
                                      : false;
};

/* params */
const blue        = createColor("Blue" , "hsl(205,  85%,  65%)");
const red         = createColor("Red"  , "hsl(  5,  95%,  75%)");
const white       = createColor("White", "hsl(  0, 100%, 100%)");
const keys        = {66: blue, 82: red};
const len         = document.getElementById("figure").clientWidth;
const containerId = "axis";
const res         = Math.pow(2, 5);
const unit        = len / res;
const edges       = range(res).map((x) => x * unit);
// const colorA      = randomHsl();
// const colorB      = randomHsl();
// const colorC      = randomHsl();

const xs     = [];
const ys     = [];
const labels = [];
let colorState  = blue;

/* side-effects */
const innerHtml  = (id, text) => document.getElementById(id).innerHTML = text;
const gridUnit   = createSquare(containerId, unit);
const selectGrid = (x, y, gridId) => {
    xs.push(x);
    ys.push(y);
    labels.push(colorState.color);
    changeColor(colorState.hsl, gridId);
};
const clickGrid = (gridId) => {
    const [x, y] = idToCoords(gridId);
    const _ = checkXY(xs, x, ys, y) ? null
                                    : selectGrid(x, y, gridId);
    // console.log(xs, ys, labels);
};
const keyAction = (key) => {
    const keySwitch = (key) => {
        const colorObj = keys[key];
        colorState = colorObj;
        return innerHtml("print", colorObj.color);
    };
    const _ = keys.hasOwnProperty(key) ? keySwitch(key)
                                       : null;
};
const deleteGrid = (containerId) => {
    const container = document.getElementById(containerId);
    while (container.lastChild) container.removeChild(container.lastChild);
};

/* scope functions */
const gridEdges = iterGrid(edges, edges);
const drawGrid  = (x, y) => gridUnit(x, y, white.hsl, gridId(x, y));
// const drawGrid  = (x, y) => gridUnit(x, y, colorFun(x, y), gridId(x, y));
// const colorFun  = (x, y) => (x + y) >= len ? colorA
//                                            : colorB;
// const randomGrid = (x, y) => changeColor(randomHsl(), gridId(x, y));

/* main */
gridEdges(drawGrid);
// gridEdges(randomGrid);
window.onclick = (e) => {
    const clickId = e.target.id;
    return checkGridId(clickId) ? clickGrid(clickId)
                                : null;
};
window.onkeydown = (e) => e.keyCode ? keyAction(e.keyCode)
                                    : null;
