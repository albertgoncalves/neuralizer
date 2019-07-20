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
    return zipElementsWith(xs, matrixWith(ys, mulConstant(z)), add);
}

function initialize(nInputDim, nOutputDim, nHiddenDim) {
    return {
        w1: matrixWith(matrixRange(nInputDim, nHiddenDim, randomSigned),
                       divSqrt(nInputDim)),
        w2: matrixWith(matrixRange(nHiddenDim, nOutputDim, randomSigned),
                       divSqrt(nHiddenDim)),
        b1: matrixRange(1, nHiddenDim, fillZero),
        b2: matrixRange(1, nOutputDim, fillZero),
    };
}

function applyDot(xs, b) {
    var n = xs.length;
    var ys = new Array(n);
    for (var i = 0; i < n; i++) {
        ys[i] = zipWith(xs[i], b, add);
    }
    return ys;
}

function fwdProp(model, trainX) {
    var z1 = applyDot(dot(trainX, model.w1), model.b1[0]);
    var a1 = matrixWith(z1, Math.tanh);
    var z2 = applyDot(dot(a1, model.w2), model.b2[0]);
    var expScr = matrixWith(z2, Math.exp);
    var n = expScr.length;
    var sumExpScr = new Array(n);
    for (var i = 0; i < n; i++) {
        sumExpScr[i] = sum(expScr[i]);
    }
    return {
        p: zipMatrixArrayWith(expScr, sumExpScr, div),
        a1: a1,
    };
}

function backProp(model, trainX, trainY, fp, regLambda, epsilon) {
    var delta3 = zipWith(fp.p, trainY, applyIndexOnly(subOne));
    var dw2 = dot(transpose(fp.a1), delta3);
    var db2 = flattenSum(transpose(delta3));
    var mat_a1 = matrixWith(fp.a1, deltaSquare);
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

function predict(model, x) {
    return argMax(fwdProp(model, x).p);
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
    return transpose([xy.xs, xy.ys, predict(model, test)]);
}
