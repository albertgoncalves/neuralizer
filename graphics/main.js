// const blue        = "hsl(205, 85%, 65%)";
// const red         = "hsl(  5, 95%, 75%)";
const colorA      = randomHsl();
const colorB      = randomHsl();
const colorC      = randomHsl();
const checkGridId = (id) => id.indexOf("grid-") !== -1;
const len         = document.getElementById("figure").clientWidth;
const containerId = "axis";
const res         = Math.pow(2, 4);
const unit        = len / res;
const edges       = range(res).map((x) => x * unit);
const squareInit  = createSquare(containerId, unit);
const colorFun    = (x, y) => (x + y) >= len ? colorA
                                             : colorB;
const grid        = iterGrid(edges, edges);
const drawGrid    = (x, y) => squareInit(x, y, colorFun(x, y), rectId(x, y));
const randomGrid  = (x, y) => changeColor(randomHsl(), rectId(x, y));
const idToCoords  = (gridId) => gridId.match(/\d+/g).map(Number);
const clickAction = (gridId) => {
    changeColor(randomHsl(), gridId);
    console.log(idToCoords(gridId));
};

grid(drawGrid);
// grid(randomGrid);

// window.onclick = (e) => console.log(e.target.id);
window.onclick = (e) => {
    const gridId      = e.target.id;
    const _ = checkGridId(gridId) ? clickAction(gridId)
                                  : null;
};
