/* pure functions */
const random = () => Math.random();

const gridId = (x, y) => `grid-${x}-${y}`;

const circleId = (x, y) => `circle-${x}-${y}`;

const createColor = (name, hsl) => ({name, hsl});

/* side-effects */
const createSvg = (containerId, svgShape, attributes) => {
    const w3 = "http://www.w3.org/2000/svg";
    const newSvg = document.createElementNS(w3, svgShape);
    attributes.forEach(([prop, value]) => newSvg.setAttribute(prop, value));
    document.getElementById(containerId).appendChild(newSvg);
};

const createSquare = (containerId, unit) => (x, y, color, id) => {
    const squareAttributes =
        [ ["id", id]
        , ["x", x]
        , ["y", y]
        , ["width", unit]
        , ["height", unit]
        , ["fill", color]
        , ["opacity", 0.45]
        ];
    createSvg(containerId, "rect", squareAttributes);
};

const createCircle = (containerId, radius) => (x, y, color, id) => {
    const circleAttributes =
        [ ["id", id]
        , ["cx", x + radius]
        , ["cy", y + radius]
        , ["r", radius * 0.82]
        , ["fill", color]
        , ["opacity", 0.9]
        ];
    createSvg(containerId, "circle", circleAttributes);
};

const changeColor = (color, id) => {
    document.getElementById(id).style.fill = color;
};
