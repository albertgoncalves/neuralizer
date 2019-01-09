const addF = (a, b) => (a + b);
const subF = (a, b) => (a - b);
const mulF = (a, b) => (a * b);
const divF = (a, b) => (a / b);

const transpose = (xs) => {
    const ys = [];

    for (let iy = 0; iy < xs[0].length; iy++) {
        const y = [];

        for (let ix = 0; ix < xs.length; ix++)
            y.push(xs[ix][iy]);

        ys.push(y);
    }

    return ys;
};

const sumVec = (x) => {
    let sum = 0;

    for (let i = 0; i < x.length; i++)
        sum += x[i];

    return sum;
};

const matToVecF = (f) => (xs, y) => {
    const zs = [];

    for (let i = 0; i < xs.length; i++) {
        const z = [];

        for (let j = 0; j < xs[i].length; j++)
            z.push(f(xs[i][j], y[i]));

        zs.push(z);
    }

    return zs;
};

const vecIterF = (f) => (x, y) => {
    const z = [];

    for (let i = 0; i < x.length; i++)
        z.push(f(x[i], y[i]));

    return z;
};

const vecElemSumF = (f) => (x, y) => {
    let sum = 0;

    for (let i = 0; i < x.length; i++)
        sum += f(x[i], y[i]);

    return sum;
};

const dot = (xs, ys) => {
    const ysT = transpose(ys);
    const zs = [];

    for (let ix = 0; ix < xs.length; ix++) {
        const z = [];

        for (let iy = 0; iy < ysT.length; iy++) {
            z.push(vecElemSumF(mulF)(xs[ix], ysT[iy]));
        }

        zs.push(z);
    }

    return zs;
};

const matIterF = (f) => (xs) => {
    const zs = [];

    for (let ix = 0; ix < xs.length; ix++) {
        const z = [];

        for (let iy = 0; iy < xs[0].length; iy++)
            z.push(f(xs[ix][iy]));

        zs.push(z);
    }

    return zs;
};

const matElemF = (f) => (xs, ys) => {
    const zs = [];

    for (let ix = 0; ix < xs.length; ix++) {
        const z = [];

        for (let iy = 0; iy < xs[0].length; iy++) {
            z.push(f(xs[ix][iy], ys[ix][iy]));
        }

        zs.push(z);
    }

    return zs;
};
