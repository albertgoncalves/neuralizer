/* pure functions */
const random      = ()           => Math.random();
const gridId      = (x, y)       => `grid-${x}-${y}`;
const circleId    = (x, y)       => `circle-${x}-${y}`;
const range       = (limit)      => [...Array(limit).keys()];
const arrayToStr  = (array)      => array.map((x) => x.toString());
const arrayToHsl  = ([h, s, l])  => `hsl(${h}, ${s}%, ${l}%)`;
const createColor = (name, hsl)  => ({name, hsl});
const randBetween = (min, max)   => Math.floor(random() * (max - min)) + min;
const randomHsl   = () => {
    const h = randBetween( 0, 359);
    const s = randBetween(50, 100);
    const l = randBetween(40,  80);
    return arrayToHsl(arrayToStr([h, s, l]));
};

/* side-effects */
const createSvg = (containerId, svgShape, attributes) => {
    const w3 = "http://www.w3.org/2000/svg";
    const newSvg = document.createElementNS(w3, svgShape);
    attributes.forEach(([prop, value]) => newSvg.setAttribute(prop, value));
    document.getElementById(containerId).appendChild(newSvg);
};
const createSquare = (containerId, unit) => (x, y, color, id) => {
    const squareAttributes = [ ["id"     , id   ]
                             , ["x"      , x    ]
                             , ["y"      , y    ]
                             , ["width"  , unit ]
                             , ["height" , unit ]
                             , ["fill"   , color]
                             , ["opacity", 0.45 ]
                             ];
    createSvg(containerId, "rect", squareAttributes);
};
const createCircle = (containerId, radius) => (x, y, color, id) => {
    const circleAttributes = [ ["id"     , id           ]
                             , ["cx"     , x + radius   ]
                             , ["cy"     , y + radius   ]
                             , ["r"      , radius * 0.82]
                             , ["fill"   , color        ]
                             , ["opacity", 0.9          ]
                             ];
    createSvg(containerId, "circle", circleAttributes);
};
const changeColor = (color, id) => {
    document.getElementById(id).style.fill = color;
};
