function initModel(nInputDim, nOutputDim, nHiddenDim) {
    var rand2d = gen2dArray(function() {
        return 2 * Math.random() - 1;
    });
    var w1f = matIterF(function(x) {
        return x / Math.sqrt(nInputDim);
    });
    var w2f = matIterF(function(x) {
        return x / Math.sqrt(nHiddenDim);
    });
    return {
        w1: w1f(rand2d(nInputDim, nHiddenDim)),
        w2: w2f(rand2d(nHiddenDim, nOutputDim)),
        b1: gen2dArray(function() {
            return 0;
        })(1, nHiddenDim),
        b2: gen2dArray(function() {
            return 0;
        })(1, nOutputDim),
    };
}

function applyDot(xs, b) {
    var n = xs.length;
    var ys = new Array(n);
    for (var i = 0; i < n; i++) {
        ys[i] = vecIterF(addF)(xs[i], b);
    }
    return ys;
}

function fwdProp(model, trainX) {
    var z1 = applyDot(dot(trainX, model.w1), model.b1[0]);
    var a1 = matIterF(function(x) {
        return Math.tanh(x);
    })(z1);
    var z2 = applyDot(dot(a1, model.w2), model.b2[0]);
    var expScr = matIterF(function(x) {
        return Math.exp(x);
    })(z2);
    var n = expScr.length;
    var sumExpScr = new Array(n);
    for (var i = 0; i < n; i++) {
        sumExpScr[i] = sumVec(expScr[i]);
    }
    return {
        p: matToVecF(divF)(expScr, sumExpScr),
        a1: a1,
    };
}

function applyT(xs) {
    var n = xs.length;
    var ys = new Array(n);
    for (var i = 0; i < n; i++) {
        ys[i] = sumVec(xs[i]);
    }
    return ys;
}

function applyW(xs, c, d) {
    var y = matIterF(function closure(x) {
        return x * c;
    })(d);
    return matElemF(addF)(xs, y);
}

function backProp(model, trainX, trainY, p, a1, regLambda, epsilon) {
    var delta3 = zipWith(fIndex1(function(x) {
        return x - 1;
    }))(p, trainY);
    var dw2 = dot(transpose(a1), delta3);
    var db2 = applyT(transpose(delta3));
    var mat_a1 = matIterF(function(x) {
        return 1 - Math.pow(x, 2);
    })(a1);
    var delta2 = matElemF(mulF)(dot(delta3, transpose(model.w2)), mat_a1);
    var dw1 = dot(transpose(trainX), delta2);
    var db1 = applyT(transpose(delta2));
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

function autoModel(params) {
    return function(xs, ys, labels, labelMap) {
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
    };
}

function conditionTest(xsNorm, ysNorm) {
    return function(xs, ys) {
        return zip(condition(xs, xsNorm.mu, xsNorm.sigma),
                   condition(ys, ysNorm.mu, ysNorm.sigma));
    };
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

function predAxis(xy) {
    return function(xs, ys, labels, labelMap) {
        return function(params) {
            var am = autoModel(params)(xs, ys, labels, labelMap);
            var test = conditionTest(am.xsNorm, am.ysNorm)(xy.xs, xy.ys);
            var pred = predict(am.model, test);
            return transpose([xy.xs, xy.ys, pred]);
        };
    };
}
