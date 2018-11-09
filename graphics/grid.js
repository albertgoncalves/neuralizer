/* pure functions */
const checkGridId = (id)     => id.indexOf("grid-") !== -1;
const idToCoords  = (gridId) => gridId.match(/\d+/g).map(Number);
const checkXY = (xs, x, ys, y) => {
    const ixs = findAll(xs, x);
    const yys = ixs.map((ix) => ys[ix]);
    return findAll(yys, y).length === 0;
};
const findAll = (arr, val) => {
    const inds = [];
    for (i = 0; i < arr.length; i++) {
        const _ = arr[i] === val ? inds.push(i)
                                 : null;
    }
    return inds;
};

/* side-effects */
const iterGrid = (xs, ys) => (f) => {
    xs.forEach((x) => ys.forEach((y) => f(x, y)));
};
