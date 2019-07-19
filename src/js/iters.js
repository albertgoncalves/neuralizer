function zip(a, b) {
    var n = a.length;
    var ab = new Array(n);
    for (var i = 0; i < n; i++) {
        ab[i] = [a[i], b[i]];
    }
    return ab;
}

function zipWith(a, b, f) {
    var n = a.length;
    var ab = new Array(n);
    for (var i = 0; i < n; i++) {
        ab[i] = f(a[i], b[i]);
    }
    return ab;
}

function arrayGen(n, f) {
    var z = new Array(n);
    for (var i = 0; i < n; i++) {
        z[i] = f();
    }
    return z;
}

function generateArray(i, j, f) {
    return arrayGen(i, function() {
        return arrayGen(j, f);
    });
}

function argMax(xs) {
    var n = xs.length;
    var ix = new Array(n);
    for (var i = 0; i < n; i++) {
        ix[i] = indexOfMax(xs[i]);
    }
    return ix;
}

function applyIndexOnly(f) {
    return function(xs, j) {
        var n = xs.length;
        var ys = new Array(n);
        for (var i = 0; i < n; i++) {
            ys[i] = i === j ? f(xs[i]) : xs[i];
        }
        return ys;
    };
}

function indexOfMax(xs) {
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
