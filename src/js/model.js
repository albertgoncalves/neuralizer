"use strict";

/*  global add, argMax, div, dot, flattenSum, mapIndex, mapMatrix, mul,
        rangeMatrix, transpose, zipElementsWith, zipColumnArrayWith,
        zipRowArrayWith, zipWith */

function randomSigned() {
    return (2 * Math.random()) - 1;
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
    return zipElementsWith(xs, mapMatrix(ys, mulConstant(z)), add);
}

function forward(result, model, trainX) {
    var alpha =
        mapMatrix(zipColumnArrayWith(dot(trainX, model.w1), model.b1[0], add),
                  Math.tanh);
    var score = mapMatrix(
        zipColumnArrayWith(dot(alpha, model.w2), model.b2[0], add), Math.exp);
    result.prediction = zipRowArrayWith(score, flattenSum(score), div);
    result.alpha = alpha;
}

function backward(result, model, trainX, trainY, lambda, epsilon) {
    var delta3 = zipWith(result.prediction, trainY, mapIndex(subOne));
    var delta2 = zipElementsWith(dot(delta3, transpose(model.w2)),
                                 mapMatrix(result.alpha, deltaSquare), mul);
    model.w1 = zipWeights(
        model.w1, zipWeights(dot(transpose(trainX), delta2), model.w1, lambda),
        -epsilon);
    model.w2 = zipWeights(
        model.w2,
        zipWeights(dot(transpose(result.alpha), delta3), model.w2, lambda),
        -epsilon);
    model.b1 = zipWeights(model.b1, [flattenSum(transpose(delta2))], -epsilon);
    model.b2 = zipWeights(model.b2, [flattenSum(transpose(delta3))], -epsilon);
}

function neuralNetwork(trainX, trainY, testX, params) {
    /*  trainX: [[float]]
        trainY: [float]
        testX: [[float]]
        params: {
            inputDim: int,
            outputDim: int,
            hiddenDim: int,
            lambda: float,
            epsilon: float,
            n: int,
        } */
    var model = {
        w1: mapMatrix(
            rangeMatrix(params.inputDim, params.hiddenDim, randomSigned),
            divSqrt(params.inputDim)),
        w2: mapMatrix(
            rangeMatrix(params.hiddenDim, params.outputDim, randomSigned),
            divSqrt(params.hiddenDim)),
        b1: rangeMatrix(1, params.hiddenDim, fillZero),
        b2: rangeMatrix(1, params.outputDim, fillZero),
    };
    var result = {
        prediction: null,
        alpha: null,
    };
    for (var _ = 0; _ < params.n; _++) {
        forward(result, model, trainX);
        backward(result, model, trainX, trainY, params.lambda, params.epsilon);
    }
    forward(result, model, testX);
    return argMax(result.prediction);
}
