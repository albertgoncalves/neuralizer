function zip(xs, ys) {
    var n = xs.length;
    var zs = new Array(n);
    for (var i = 0; i < n; i++) {
        zs[i] = [xs[i], ys[i]];
    }
    return zs;
}

function zipWith(xs, ys, f) {
    var n = xs.length;
    var zs = new Array(n);
    for (var i = 0; i < n; i++) {
        zs[i] = f(xs[i], ys[i]);
    }
    return zs;
}

function zipWithSum(xs, ys, f) {
    var n = xs.length;
    var s = 0;
    for (var i = 0; i < n; i++) {
        s += f(xs[i], ys[i]);
    }
    return s;
}

function findAll(x, xs) {
    var n = xs.length;
    var ys = [];
    for (var i = 0; i < n; i++) {
        if (xs[i] === x) {
            ys.push(i);
        }
    }
    return ys;
}

function permute(xs, ys) {
    var n = xs.length;
    var m = ys.length;
    var ps = new Array(n * m);
    var qs = new Array(n * m);
    var k;
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < m; j++) {
            k = (m * i) + j;
            ps[k] = xs[i];
            qs[k] = ys[j];
        }
    }
    return {
        xs: ps,
        ys: qs,
    };
}

function rangeMatrix(n, m, f) {
    var xs = new Array(n);
    for (var i = 0; i < n; i++) {
        var ys = new Array(m);
        for (var j = 0; j < m; j++) {
            ys[j] = f();
        }
        xs[i] = ys;
    }
    return xs;
}

function mapIndex(f) {
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
    var ys = new Array(n);
    for (var i = 0; i < n; i++) {
        ys[i] = indexMax(xs[i]);
    }
    return ys;
}

function transpose(xs) {
    var n = xs[0].length;
    var m = xs.length;
    var ys = new Array(n);
    var y;
    for (var i = 0; i < n; i++) {
        y = new Array(m);
        for (var j = 0; j < m; j++) {
            y[j] = xs[j][i];
        }
        ys[i] = y;
    }
    return ys;
}

function mapMatrix(xs, f) {
    var n = xs.length;
    var m = xs[0].length;
    var ys = new Array(n);
    var y;
    for (var i = 0; i < n; i++) {
        y = new Array(m);
        for (var j = 0; j < m; j++) {
            y[j] = f(xs[i][j]);
        }
        ys[i] = y;
    }
    return ys;
}

function zipRowArrayWith(xs, ys, f) {
    var n = xs.length;
    var m = xs[0].length;
    var zs = new Array(n);
    var z;
    for (var i = 0; i < n; i++) {
        z = new Array(m);
        for (var j = 0; j < m; j++) {
            z[j] = f(xs[i][j], ys[i]);
        }
        zs[i] = z;
    }
    return zs;
}

function zipColumnArrayWith(xs, ys, f) {
    var n = xs.length;
    var m = xs[0].length;
    var zs = new Array(n);
    var z;
    for (var i = 0; i < n; i++) {
        z = new Array(m);
        for (var j = 0; j < m; j++) {
            z[j] = f(xs[i][j], ys[j]);
        }
        zs[i] = z;
    }
    return zs;
}

function zipElementsWith(xs, ys, f) {
    var n = xs.length;
    var m = xs[0].length;
    var zs = new Array(n);
    var z;
    for (var i = 0; i < n; i++) {
        z = new Array(m);
        for (var j = 0; j < m; j++) {
            z[j] = f(xs[i][j], ys[i][j]);
        }
        zs[i] = z;
    }
    return zs;
}

function flattenSum(xs) {
    var n = xs.length;
    var m = xs[0].length;
    var ys = new Array(n);
    var s;
    for (var i = 0; i < n; i++) {
        s = 0;
        for (var j = 0; j < m; j++) {
            s += xs[i][j];
        }
        ys[i] = s;
    }
    return ys;
}

function dot(xs, ys) {
    var ts = transpose(ys);
    var n = xs.length;
    var m = ts.length;
    var zs = new Array(n);
    var z;
    for (var i = 0; i < n; i++) {
        z = new Array(m);
        for (var j = 0; j < m; j++) {
            z[j] = zipWithSum(xs[i], ts[j], mul);
        }
        zs[i] = z;
    }
    return zs;
}
