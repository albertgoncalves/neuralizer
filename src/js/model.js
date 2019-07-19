function rand2() {
    return 2 * Math.random() - 1;
}

function divSqrt(y) {
    return function(x) {
        return x / Math.sqrt(y);
    };
}

function fillZero() {
    return 0;
}

function mulConstant(c) {
    return function(x) {
        return x * c;
    };
}

function subOne(x) {
    return x - 1;
}

function deltaSquare(x) {
    return 1 - Math.pow(x, 2);
}

function initModel(nInputDim, nOutputDim, nHiddenDim) {
    return {
        w1: matrixApply(matrixRange(nInputDim, nHiddenDim, rand2),
                        divSqrt(nInputDim)),
        w2: matrixApply(matrixRange(nHiddenDim, nOutputDim, rand2),
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
    var a1 = matrixApply(z1, Math.tanh);
    var z2 = applyDot(dot(a1, model.w2), model.b2[0]);
    var expScr = matrixApply(z2, Math.exp);
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

function applyW(xs, c, d) {
    var y = matrixApply(d, mulConstant(c));
    return elementsApply(xs, y, add);
}

function backProp(model, trainX, trainY, p, a1, regLambda, epsilon) {
    var delta3 = zipWith(p, trainY, applyIndexOnly(subOne));
    var dw2 = dot(transpose(a1), delta3);
    var db2 = flattenSum(transpose(delta3));
    var mat_a1 = matrixApply(a1, deltaSquare);
    var delta2 = elementsApply(dot(delta3, transpose(model.w2)), mat_a1, mul);
    var dw1 = dot(transpose(trainX), delta2);
    var db1 = flattenSum(transpose(delta2));
    dw2 = applyW(dw2, regLambda, model.w2);
    dw1 = applyW(dw1, regLambda, model.w1);
    model.w1 = applyW(model.w1, -epsilon, dw1);
    model.w2 = applyW(model.w2, -epsilon, dw2);
    model.b1 = applyW(model.b1, -epsilon, [db1]);
    model.b2 = applyW(model.b2, -epsilon, [db2]);
    return model;
}

function train(model, n, trainX, trainY, regLambda, epsilon) {
    for (var _ = 0; _ < n; _++) {
        var x = fwdProp(model, trainX);
        model = backProp(model, trainX, trainY, x.p, x.a1, regLambda, epsilon);
    }
    return model;
}

function predict(model, x) {
    var y = fwdProp(model, x);
    return argMax(y.p);
}

function autoModel(params, xs, ys, labels, labelMap) {
    var xsNorm = normalize(xs);
    var ysNorm = normalize(ys);
    var trainX = zip(xsNorm.units, ysNorm.units);
    var n = labels.length;
    var trainY = new Array(n);
    for (var i = 0; i < n; i++) {
        trainY[i] = labelMap[labels[i]];
    }
    var nInputDim = [xs, ys].length;
    var nOutputDim = Array.from(new Set(labels)).length;
    var start = initModel(nInputDim, nOutputDim, params.nHiddenDim);
    return {
        model: train(start, params.nLoops, trainX, trainY, params.regLambda,
                     params.epsilon),
        xsNorm: xsNorm,
        ysNorm: ysNorm,
    };
}

function applyUnitScale(xUnit, yUnit, xs, ys) {
    return zip(unitScale(xs, xUnit.mu, xUnit.sigma),
               unitScale(ys, yUnit.mu, yUnit.sigma));
}

function edgePermute(xEdges, yEdges) {
    var n = xEdges.length;
    var m = yEdges.length;
    var xs = new Array(n * m);
    var ys = new Array(n * m);
    for (var ix = 0; ix < n; ix++) {
        for (var iy = 0; iy < m; iy++) {
            var i = (m * ix) + iy;
            xs[i] = xEdges[ix];
            ys[i] = yEdges[iy];
        }
    }
    return {
        xs: xs,
        ys: ys,
    };
}

function predAxis(xy, xs, ys, labels, labelMap, params) {
    var am = autoModel(params, xs, ys, labels, labelMap);
    var test = applyUnitScale(am.xsNorm, am.ysNorm, xy.xs, xy.ys);
    var pred = predict(am.model, test);
    return transpose([xy.xs, xy.ys, pred]);
}
