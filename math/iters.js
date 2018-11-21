const zip        = (a, b) => a.map((e, i) => [e, b[i]]);
const gen2dArray = (f)    => (nx, ny) => arrayGen(nx, () => arrayGen(ny, f));
const zipWith    = (f)    => (a, b) => a.map((e, i) => f(e, b[i]));
const argMax     = (xs)   => xs.map(indexOfMax);

const fIndex1    = (f)    => (x, index) => {
    const z = [];
    for (let i = 0; i < x.length; i++) z.push(i === index ? f(x[i])
                                                          : x[i]);
    return z;
};

const arrayGen = (n, f) => {
    const z = [];
    for (let i = 0; i < n; i++) z.push(f());
    return z;
};

const indexOfMax = (array) => {
    if (array.length === 0) return -1;

    let maxIndex = 0;
    let max      = array[maxIndex];

    for (let i = 1; i < array.length; i++) {
        if (array[i] > max) {
            maxIndex = i;
            max      = array[i];
        }
    }

    return maxIndex;
};

const forRange = (min, max) => {
    const z = [];
    for (let i = min; i < max; i++) z.push(i);
    return z;
};
