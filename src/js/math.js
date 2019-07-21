function add(x, y) {
    return x + y;
}

function mul(x, y) {
    return x * y;
}

function div(x, y) {
    return x / y;
}

function mean(xs) {
    var n = xs.length;
    var s = 0;
    for (var i = 0; i < n; i++) {
        s += xs[i];
    }
    return s / n;
}

function squareDiff(xs, mu) {
    var n = xs.length;
    var ys = new Array(n);
    for (var i = 0; i < n; i++) {
        ys[i] = Math.pow(xs[i] - mu, 2);
    }
    return ys;
}

function std(xs, mu) {
    return Math.sqrt(mean(squareDiff(xs, mu)));
}

function unitScale(xs, mu, sigma) {
    var n = xs.length;
    var ys = new Array(n);
    for (var i = 0; i < n; i++) {
        ys[i] = (xs[i] - mu) / sigma;
    }
    return ys;
}

function normalize(xs) {
    var mu = mean(xs);
    var sigma = std(xs, mu);
    return {
        unit: unitScale(xs, mu, sigma),
        mu: mu,
        sigma: sigma,
    };
}
