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

function fwdProp(model, trainX) {
    var z1 = dot(trainX, model.w1).map(function(x) {
        return vecIterF(addF)(x, model.b1[0]);
    });
    var a1 = matIterF(function(x) {
        return Math.tanh(x);
    })(z1);
    var z2 = dot(a1, model.w2).map(function(x) {
        return vecIterF(addF)(x, model.b2[0]);
    });
    var expScr = matIterF(function(x) {
        return Math.exp(x);
    })(z2);
    var sumExpScr = expScr.map(sumVec);
    return {
        p: matToVecF(divF)(expScr, sumExpScr),
        a1: a1,
    };
}

function apply(xs, c, d) {
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
    var db2 = [transpose(delta3).map(sumVec)];
    var mat_a1 = matIterF(function(x) {
        return 1 - Math.pow(x, 2);
    })(a1);
    var delta2 = matElemF(mulF)(dot(delta3, transpose(model.w2)), mat_a1);
    var dw1 = dot(transpose(trainX), delta2);
    var db1 = [transpose(delta2).map(sumVec)];
    dw2 = apply(dw2, regLambda, model.w2);
    dw1 = apply(dw1, regLambda, model.w1);
    model.w1 = apply(model.w1, -epsilon, dw1);
    model.w2 = apply(model.w2, -epsilon, dw2);
    model.b1 = apply(model.b1, -epsilon, db1);
    model.b2 = apply(model.b2, -epsilon, db2);
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
    return function(Xs, Ys, labels, labelMap) {
        var XsNorm = normalize(Xs);
        var YsNorm = normalize(Ys);
        var trainX = zip(XsNorm.units, YsNorm.units);
        var trainY = labels.map(function(y) {
            return labelMap[y];
        });
        var nInputDim = [xs, ys].length;
        var nOutputDim = Array.from(new Set(labels)).length;
        var start = initModel(nInputDim, nOutputDim, params.nHiddenDim);
        return {
            model: train(start, params.nLoops, trainX, trainY, params.regLambda,
                         params.epsilon),
            XsNorm: XsNorm,
            YsNorm: YsNorm,
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
    var xs = new Array(n);
    var ys = new Array(m);
    for (var ix = 0; ix < n; ix++) {
        for (var iy = 0; iy < m; iy++) {
            xs[(m * ix) + iy] = xEdges[ix];
            ys[(m * ix) + iy] = yEdges[iy];
        }
    }
    return {
        xs: xs,
        ys: ys,
    };
}

function predAxis(xy) {
    return function(Xs, Ys, labels, labelMap) {
        return function(params) {
            var am = autoModel(params)(Xs, Ys, labels, labelMap);
            var test = conditionTest(am.XsNorm, am.YsNorm)(xy.xs, xy.ys);
            var pred = predict(am.model, test);
            return transpose([xy.xs, xy.ys, pred]);
        };
    };
}
