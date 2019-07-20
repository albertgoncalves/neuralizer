function randomSigned() {
    return 2 * Math.random() - 1;
}

function divSqrt(x) {
    return function(y) {
        return y / Math.sqrt(x);
    };
}

function fillZero() {
    return 0;
}

function mulConstant(x) {
    return function(y) {
        return x * y;
    };
}

function subOne(x) {
    return x - 1;
}

function deltaSquare(x) {
    return 1 - Math.pow(x, 2);
}

function zipWeights(xs, ys, z) {
    return zipElementsWith(xs, matrixMap(ys, mulConstant(z)), add);
}

function initialize(nInputDim, nOutputDim, nHiddenDim) {
    return {
        w1: matrixMap(matrixRange(nInputDim, nHiddenDim, randomSigned),
                      divSqrt(nInputDim)),
        w2: matrixMap(matrixRange(nHiddenDim, nOutputDim, randomSigned),
                      divSqrt(nHiddenDim)),
        b1: matrixRange(1, nHiddenDim, fillZero),
        b2: matrixRange(1, nOutputDim, fillZero),
    };
}

function fwdProp(model, trainX) {
    var a1 = matrixMap(
        zipColumnArrayWith(dot(trainX, model.w1), model.b1[0], add), Math.tanh);
    var expScr = matrixMap(
        zipColumnArrayWith(dot(a1, model.w2), model.b2[0], add), Math.exp);
    return {
        p: zipRowArrayWith(expScr, flattenSum(expScr), div),
        a1: a1,
    };
}

function backProp(model, trainX, trainY, fp, regLambda, epsilon) {
    var delta3 = zipWith(fp.p, trainY, applyIndexOnly(subOne));
    var dw2 = dot(transpose(fp.a1), delta3);
    var db2 = flattenSum(transpose(delta3));
    var mat_a1 = matrixMap(fp.a1, deltaSquare);
    var delta2 = zipElementsWith(dot(delta3, transpose(model.w2)), mat_a1, mul);
    var dw1 = dot(transpose(trainX), delta2);
    var db1 = flattenSum(transpose(delta2));
    dw2 = zipWeights(dw2, model.w2, regLambda);
    dw1 = zipWeights(dw1, model.w1, regLambda);
    model.w1 = zipWeights(model.w1, dw1, -epsilon);
    model.w2 = zipWeights(model.w2, dw2, -epsilon);
    model.b1 = zipWeights(model.b1, [db1], -epsilon);
    model.b2 = zipWeights(model.b2, [db2], -epsilon);
}

function train(model, n, trainX, trainY, regLambda, epsilon) {
    for (var _ = 0; _ < n; _++) {
        backProp(model, trainX, trainY, fwdProp(model, trainX), regLambda,
                 epsilon);
    }
}

function applyUnitScale(xUnit, yUnit, xs, ys) {
    return zip(unitScale(xs, xUnit.mu, xUnit.sigma),
               unitScale(ys, yUnit.mu, yUnit.sigma));
}

function pipeline(xy, xs, ys, labels, labelMap, params) {
    var xsNorm = normalize(xs);
    var ysNorm = normalize(ys);
    var trainX = zip(xsNorm.units, ysNorm.units);
    var n = labels.length;
    var trainY = new Array(n);
    for (var i = 0; i < n; i++) {
        trainY[i] = labelMap[labels[i]];
    }
    var model = initialize(2, 2, params.nHiddenDim);
    var test = applyUnitScale(xsNorm, ysNorm, xy.xs, xy.ys);
    train(model, params.nLoops, trainX, trainY, params.regLambda,
          params.epsilon);
    return transpose([xy.xs, xy.ys, argMax(fwdProp(model, test).p)]);
}
