function addF(a, b) {
    return a + b;
}

function subF(a, b) {
    return a - b;
}

function mulF(a, b) {
    return a * b;
}

function divF(a, b) {
    return a / b;
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

function sumVec(x) {
    var n = x.length;
    var sum = 0;
    for (var i = 0; i < n; i++) {
        sum += x[i];
    }
    return sum;
}

function matToVecF(f) {
    return (function(xs, y) {
        var n = xs.length;
        var m = xs[0].length;
        var zs = new Array(n);
        for (var i = 0; i < n; i++) {
            var z = new Array(m);
            for (var j = 0; j < m; j++) {
                z[j] = f(xs[i][j], y[i]);
            }
            zs[i] = z;
        }
        return zs;
    });
}

function vecIterF(f) {
    return (function(x, y) {
        var n = x.length;
        var z = new Array(n);
        for (var i = 0; i < n; i++) {
            z[i] = f(x[i], y[i]);
        }
        return z;
    });
}

function vecElemSumF(f) {
    return (function(x, y) {
        var n = x.length;
        var sum = 0;
        for (var i = 0; i < n; i++) {
            sum += f(x[i], y[i]);
        }
        return sum;
    });
}

function dot(xs, ys) {
    var ysT = transpose(ys);
    var n = xs.length;
    var m = ysT.length;
    var zs = new Array(n);
    for (var ix = 0; ix < n; ix++) {
        var z = new Array(m);
        for (var iy = 0; iy < m; iy++) {
            z[iy] = vecElemSumF(mulF)(xs[ix], ysT[iy]);
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
