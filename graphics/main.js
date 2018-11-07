/* pure functions */
const checkGridId = (id) => id.indexOf("grid-") !== -1;
const idToCoords  = (gridId) => gridId.match(/\d+/g).map(Number);

/* params */
// const blue        = "hsl(205, 85%, 65%)";
// const red         = "hsl(  5, 95%, 75%)";
const colorA      = randomHsl();
const colorB      = randomHsl();
const colorC      = randomHsl();
const len         = document.getElementById("figure").clientWidth;
const containerId = "axis";
const res         = Math.pow(2, 4);
const unit        = len / res;
const edges       = range(res).map((x) => x * unit);

/* side-effects */
const gridUnit   = createSquare(containerId, unit);
const clickGrid  = (gridId) => changeColor(randomHsl(), gridId);
const deleteGrid = (containerId) => {
    const container = document.getElementById(containerId);
    while (container.lastChild) container.removeChild(container.lastChild);
};

/* scope functions */
const gridEdges = iterGrid(edges, edges);
const drawGrid  = (x, y) => gridUnit(x, y, colorFun(x, y), gridId(x, y));
const colorFun  = (x, y) => (x + y) >= len ? colorA
                                           : colorB;
// const randomGrid  = (x, y) => changeColor(randomHsl(), gridId(x, y));

/* main */
gridEdges(drawGrid);
// gridEdges(randomGrid);
window.onclick = (e) => {
    const clickId = e.target.id;
    const _ = checkGridId(clickId) ? clickGrid(clickId)
                                   : null;
};
