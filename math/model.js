/* training functions */
const initModel = (nInputDim, nOutputDim, nHiddenDim) => {
    const rand2d = gen2dArray(() => 2 * Math.random() - 1);
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

const fwdProp = (model, trainX) => {
    const {w1, w2, b1, b2} = model;
    const z1 = dot(trainX, w1).map((x) => vecIterF(addF)(x, b1[0]));
    const a1 = matIterF((x) => Math.tanh(x))(z1);
    const z2 = dot(a1, w2).map((x) => vecIterF(addF)(x, b2[0]));
    const expScr = matIterF((x) => Math.exp(x))(z2);
    const sumExpScr = expScr.map(sumVec);
    const p = matToVecF(divF)(expScr, sumExpScr);
    return {p, a1};
};

const backProp = (model, trainX, trainY, p, a1, regLambda, epsilon) => {
    const apply = (xs, c, d) => matElemF(addF)(xs, matIterF((x) => x * c)(d));

    let {w1, w2, b1, b2} = model;

    const delta3 = zipWith(fIndex1((x) => x - 1))(p, trainY);
    let dw2 = dot(transpose(a1), delta3);
    const db2 = [transpose(delta3).map(sumVec)];
    const mat_a1 = matIterF((x) => (1 - Math.pow(x, 2)))(a1);
    const delta2 = matElemF(mulF)(dot(delta3, transpose(w2)), mat_a1);
    let dw1 = dot(transpose(trainX), delta2);
    const db1 = [transpose(delta2).map(sumVec)];

    dw2 = apply(dw2, regLambda, w2);
    dw1 = apply(dw1, regLambda, w1);
    w1 = apply(w1, -epsilon, dw1);
    w2 = apply(w2, -epsilon, dw2);
    b1 = apply(b1, -epsilon, db1);
    b2 = apply(b2, -epsilon, db2);

    return {w1, w2, b1, b2};
};

const train = (model, n, trainX, trainY, regLambda, epsilon) => {
    for (let _ = 0; _ < n; _++) {
        let {p, a1} = fwdProp(model, trainX);
        model = backProp(model, trainX, trainY, p, a1, regLambda, epsilon);
    }

    return model;
};

/* prediction functions */
const predict = (model, x) => {
    const {p, _} = fwdProp(model, x);
    return argMax(p);
};

const autoModel = (params) => (Xs, Ys, labels, labelMap) => {
    const {nHiddenDim, regLambda, epsilon, nLoops} = params;

    const XsNorm = normalize(Xs);
    const YsNorm = normalize(Ys);

    const trainX = zip(XsNorm.units, YsNorm.units);
    const trainY = labels.map((y) => labelMap[y]);
    const nInputDim = [xs, ys].length;
    const nOutputDim = [...new Set(labels)].length;

    const model = train( initModel(nInputDim, nOutputDim, nHiddenDim)
                       , nLoops
                       , trainX
                       , trainY
                       , regLambda
                       , epsilon
                       );

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

const predAxis = ({xs, ys}) => (Xs, Ys, labels, labelMap) => (params) => {
    const {model, XsNorm, YsNorm} =
        autoModel(params)(Xs, Ys, labels, labelMap);
    const test = conditionTest(XsNorm, YsNorm)(xs, ys);
    const pred = predict(model, test);
    return transpose([xs, ys, pred]);
};
