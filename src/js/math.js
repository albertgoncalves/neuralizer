function add(a, b) {
    return a + b;
}

function mul(a, b) {
    return a * b;
}

function div(a, b) {
    return a / b;
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
        units: unitScale(xs, mu, sigma),
        mu: mu,
        sigma: sigma,
    };
}

function transpose(xs) {
    var n = xs[0].length;
    var m = xs.length;
    var ys = new Array(n);
    for (var iy = 0; iy < n; iy++) {
        var y = new Array(m);
        for (var ix = 0; ix < m; ix++) {
            y[ix] = xs[ix][iy];
        }
        ys[iy] = y;
    }
    return ys;
}

function sumVec(xs) {
    var n = xs.length;
    var s = 0;
    for (var i = 0; i < n; i++) {
        s += xs[i];
    }
    return s;
}

function matToVec(f, xs, ys) {
    var n = xs.length;
    var m = xs[0].length;
    var zs = new Array(n);
    for (var i = 0; i < n; i++) {
        var z = new Array(m);
        for (var j = 0; j < m; j++) {
            z[j] = f(xs[i][j], ys[i]);
        }
        zs[i] = z;
    }
    return zs;
}

function vecIter(f, xs, ys) {
    var n = xs.length;
    var zs = new Array(n);
    for (var i = 0; i < n; i++) {
        zs[i] = f(xs[i], ys[i]);
    }
    return zs;
}

function dot(xs, ys) {
    var ysT = transpose(ys);
    var n = xs.length;
    var m = ysT.length;
    var zs = new Array(n);
    for (var ix = 0; ix < n; ix++) {
        var z = new Array(m);
        for (var iy = 0; iy < m; iy++) {
            z[iy] = zipWithSum(xs[ix], ysT[iy], mul);
        }
        zs[ix] = z;
    }
    return zs;
}

function matIterF(f) {
    return (function(xs) {
        var n = xs.length;
        var m = xs[0].length;
        var zs = new Array(n);
        for (var ix = 0; ix < n; ix++) {
            var z = new Array(m);
            for (var iy = 0; iy < m; iy++) {
                z[iy] = f(xs[ix][iy]);
            }
            zs[ix] = z;
        }
        return zs;
    });
}

function matElemF(f) {
    return (function(xs, ys) {
        var n = xs.length;
        var m = xs[0].length;
        var zs = new Array(n);
        for (var ix = 0; ix < n; ix++) {
            var z = new Array(m);
            for (var iy = 0; iy < m; iy++) {
                z[iy] = f(xs[ix][iy], ys[ix][iy]);
            }
            zs[ix] = z;
        }
        return zs;
    });
}
