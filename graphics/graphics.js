const random      = ()          => Math.random();
const rectId      = (x, y)      => `grid-${x}-${y}`;
const range       = (limit)     => [...Array(limit).keys()];
const arrayToStr  = (array)     => array.map((x) => x.toString());
const arrayToHsl  = ([h, s, l]) => `hsl(${h}, ${s}%, ${l}%)`;
const randBetween = (min, max)  => Math.floor(random() * (max - min)) + min;
const randomHsl   = () => {
    const h = randBetween( 0, 359);
    const s = randBetween(50, 100);
    const l = randBetween(40,  80);
    return arrayToHsl(arrayToStr([h, s, l]));
};

const createSvg = (containerId, svgShape, attributes) => {
    const newSvg = document.createElementNS( "http://www.w3.org/2000/svg"
                                           , svgShape
                                           );
    attributes.forEach(([prop, value]) => newSvg.setAttribute(prop, value));
    document.getElementById(containerId).appendChild(newSvg);
};

const createSquare = (containerId, unit) => (x, y, color, id) => {
    const squareAttributes = [ ["id"    , id   ]
                             , ["x"     , x    ]
                             , ["y"     , y    ]
                             , ["width" , unit ]
                             , ["height", unit ]
                             , ["fill"  , color]
                             ];
    createSvg(containerId, "rect", squareAttributes);
};

const changeColor = (color, id) => {
    document.getElementById(id).style.fill = color;
};

const drawGrid = (squareInit, xEdges, yEdges, colorA, colorB, colorFun) => {
    xEdges.forEach(
        (x) => yEdges.forEach(
            (y) => squareInit(x, y, colorFun(x, y), rectId(x, y))
        )
    );
};
