function zip(xs, ys) {
    var n = xs.length;
    var xys = new Array(n);
    for (var i = 0; i < n; i++) {
        xys[i] = [xs[i], ys[i]];
    }
    return xys;
}

function zipWith(xs, ys, f) {
    var n = xs.length;
    var xys = new Array(n);
    for (var i = 0; i < n; i++) {
        xys[i] = f(xs[i], ys[i]);
    }
    return xys;
}

function zipWithSum(xs, ys, f) {
    var n = xs.length;
    var s = 0;
    for (var i = 0; i < n; i++) {
        s += f(xs[i], ys[i]);
    }
    return s;
}

function sum(xs) {
    var n = xs.length;
    var s = 0;
    for (var i = 0; i < n; i++) {
        s += xs[i];
    }
    return s;
}

function permute(xs, ys) {
    var n = xs.length;
    var m = ys.length;
    var ps = new Array(n * m);
    var qs = new Array(n * m);
    for (var ix = 0; ix < n; ix++) {
        for (var iy = 0; iy < m; iy++) {
            var i = (m * ix) + iy;
            ps[i] = xs[ix];
            qs[i] = ys[iy];
        }
    }
    return {
        xs: ps,
        ys: qs,
    };
}

function arrayRange(n, f) {
    var xs = new Array(n);
    for (var i = 0; i < n; i++) {
        xs[i] = f();
    }
    return xs;
}

function matrixRange(n, m, f) {
    return arrayRange(n, function() {
        return arrayRange(m, f);
    });
}

function applyIndexOnly(f) {
    return function(xs, i) {
        var n = xs.length;
        var ys = new Array(n);
        for (var j = 0; j < n; j++) {
            ys[j] = j === i ? f(xs[j]) : xs[j];
        }
        return ys;
    };
}

function indexMax(xs) {
    var n = xs.length;
    var j = 0;
    var x = xs[j];
    for (var i = 1; i < n; i++) {
        if (xs[i] > x) {
            x = xs[i];
            j = i;
        }
    }
    return j;
}

function argMax(xs) {
    var n = xs.length;
    var ix = new Array(n);
    for (var i = 0; i < n; i++) {
        ix[i] = indexMax(xs[i]);
    }
    return ix;
}

function transpose(xs) {
    var n = xs[0].length;
    var m = xs.length;
    var ys = new Array(n);
    for (var i = 0; i < n; i++) {
        var y = new Array(m);
        for (var j = 0; j < m; j++) {
            y[j] = xs[j][i];
        }
        ys[i] = y;
    }
    return ys;
}

function matrixWith(xs, f) {
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
}

function zipMatrixArrayWith(xs, ys, f) {
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

function zipElementsWith(xs, ys, f) {
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
}

function flattenSum(xs) {
    var n = xs.length;
    var ys = new Array(n);
    for (var i = 0; i < n; i++) {
        ys[i] = sum(xs[i]);
    }
    return ys;
}

function dot(xs, ys) {
    var ts = transpose(ys);
    var n = xs.length;
    var m = ts.length;
    var zs = new Array(n);
    for (var i = 0; i < n; i++) {
        var z = new Array(m);
        for (var j = 0; j < m; j++) {
            z[j] = zipWithSum(xs[i], ts[j], mul);
        }
        zs[i] = z;
    }
    return zs;
}
