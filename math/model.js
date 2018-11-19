/* pure functions */
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
const lazyAnd = (a, b) => !a ? false
                             : !b ? false
                                  : true;
const lazyOr  = (a, b) => a ? true
                            : b ? true
                                : false;
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
}
const forRange = (min, max) => {
    const z = [];
    for (let i = min; i < max; i++) z.push(i);
    return z;
};

/* params */
const labelMap = () => ({"red": 1, "blue": 0});
const params = () => {
    const nHiddenDim = 5;
    const regLambda  = 0.02;
    const epsilon    = 0.02;
    const nLoops     = 100;
    return {nHiddenDim, regLambda, epsilon, nLoops};
};

/* training functions */
const initModel = (nInputDim, nOutputDim, nHiddenDim) => {
    const rand2d = gen2dArray(() => 2 * Math.random() - 1)
    const w1 = matIterF(
        (x) => x / Math.sqrt(nInputDim ))(rand2d(nInputDim , nHiddenDim)
    );
    const w2 = matIterF(
        (x) => x / Math.sqrt(nHiddenDim))(rand2d(nHiddenDim, nOutputDim)
    );
    const b1 = gen2dArray(() => 0)(1, nHiddenDim);
    const b2 = gen2dArray(() => 0)(1, nOutputDim);
    return {w1, w2, b1, b2};
};

const fwdProp = (model, X) => {
    const {w1, w2, b1, b2} = model;

    const z1        = dot(X, w1).map((x) => addF(vecIterF)(x, b1[0]));
    const a1        = matIterF((x) => Math.tanh(x))(z1);
    const z2        = dot(a1, w2).map((x) => addF(vecIterF)(x, b2[0]));
    const expScr    = matIterF((x) => Math.exp(x))(z2);
    const sumExpScr = expScr.map(sumVec)
    const p         = divF(matToVecF)(expScr, sumExpScr);

    return {p, a1};
}

const backProp = (model, X, Y, p, a1, regLambda, epsilon) => {
    const apply = (xs, c, d) => {
        return addF(matElemF)(xs, matIterF((x) => x * c)(d))
    };

    let {w1, w2, b1, b2} = model;

    const delta3 = zipWith(fIndex1((x) => x - 1))(p, Y);
    let   dw2    = dot(transpose(a1), delta3);
    const db2    = [transpose(delta3).map(sumVec)];
    const delta2 = mulF(matElemF)( dot(delta3, transpose(w2))
                                 , matIterF((x) => (1 - Math.pow(x, 2)))(a1)
                                 )
    let   dw1    = dot(transpose(X), delta2);
    const db1    = [transpose(delta2).map(sumVec)];

    dw2 = apply(dw2, regLambda, w2)
    dw1 = apply(dw1, regLambda, w1)
    w1  = apply(w1, -epsilon, dw1)
    w2  = apply(w2, -epsilon, dw2)
    b1  = apply(b1, -epsilon, db1)
    b2  = apply(b2, -epsilon, db2)
    return {w1, w2, b1, b2};
};

const train = (model, n, X, Y, regLambda, epsilon) => {
    for (let _ = 0; _ < n; _++) {
        let {p, a1} = fwdProp(model, X);
        model       = backProp(model, X, Y, p, a1, regLambda, epsilon);
    }
    return model;
};

/* prediction functions */
const predict = (model, x) => {
    const {p, _} = fwdProp(model, x);
    return argMax(p);
};

const autoModel = (nHiddenDim, regLambda, epsilon, nLoops) =>
                  (Xs, Ys, labels) => {
    const XsNorm = normalize(Xs);
    const YsNorm = normalize(Ys);

    const X = zip(XsNorm.units, YsNorm.units);
    const Y = labels.map((x) => labelMap()[x]);
    const nInputDim  = [xs, ys].length;
    const nOutputDim = [...new Set(labels)].length;

    let model = initModel(nInputDim, nOutputDim, nHiddenDim);
    model = train(model, nLoops, X, Y, regLambda, epsilon);

    return {model, XsNorm, YsNorm};
};

const conditionTest = (xsNorm, ysNorm) => (xs, ys) => {
    const x = condition(xs, xsNorm.mu, xsNorm.sigma);
    const y = condition(ys, ysNorm.mu, ysNorm.sigma);
    return zip(x, y);
};

const edgePermute = (xEdges, yEdges) => {
    const xs = [];
    const ys = [];
    for (let ix = 0; ix < xEdges.length; ix ++) {
        for (let iy = 0; iy < yEdges.length; iy ++) {
            xs.push(xEdges[ix]);
            ys.push(yEdges[iy]);
        }
    }
    return {xs, ys};
};

const testAxis = (xEdges, yEdges) => (Xs, Ys, labels) => {
    const {nHiddenDim, regLambda, epsilon, nLoops} = params();

    const {model, XsNorm, YsNorm} =
        autoModel(nHiddenDim, regLambda, epsilon, nLoops)(Xs, Ys, labels);

    const {xs, ys} = edgePermute(xEdges, yEdges);

    const test = conditionTest(XsNorm, YsNorm)(xs, ys);
    const pred = predict(model, test)

    return transpose([xs, ys, pred]);
};
