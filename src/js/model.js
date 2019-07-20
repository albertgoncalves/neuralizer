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
    return zipElementsWith(xs, matrixMap(ys, mulConstant(z)), add);
}

function forward(result, model, trainX) {
    var alpha =
        matrixMap(zipColumnArrayWith(dot(trainX, model.w1), model.b1[0], add),
                  Math.tanh);
    var score = matrixMap(
        zipColumnArrayWith(dot(alpha, model.w2), model.b2[0], add), Math.exp);
    result.prediction = zipRowArrayWith(score, flattenSum(score), div);
    result.alpha = alpha;
}

function backward(result, model, trainX, trainY, lambda, epsilon) {
    var delta3 = zipWith(result.prediction, trainY, indexMap(subOne));
    var delta2 = zipElementsWith(dot(delta3, transpose(model.w2)),
                                 matrixMap(result.alpha, deltaSquare), mul);
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

function neuralNetwork(trainX, trainY, testX, inputDim, outputDim, hiddenDim,
                       lambda, epsilon, n) {
    var model = {
        w1: matrixMap(matrixRange(inputDim, hiddenDim, randomSigned),
                      divSqrt(inputDim)),
        w2: matrixMap(matrixRange(hiddenDim, outputDim, randomSigned),
                      divSqrt(hiddenDim)),
        b1: matrixRange(1, hiddenDim, fillZero),
        b2: matrixRange(1, outputDim, fillZero),
    };
    var result = {
        prediction: null,
        alpha: null,
    };
    for (var _ = 0; _ < n; _++) {
        forward(result, model, trainX);
        backward(result, model, trainX, trainY, lambda, epsilon);
    }
    forward(result, model, testX);
    return argMax(result.prediction);
}
