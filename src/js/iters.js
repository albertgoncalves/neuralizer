function zip(a, b) {
    var n = a.length;
    var xs = new Array(n);
    for (var i = 0; i < n; i++) {
        xs[i] = [a[i], b[i]];
    }
    return xs;
}

function gen2dArray(f) {
    return function(nx, ny) {
        return arrayGen(nx, function() {
            return arrayGen(ny, f);
        });
    };
}

function zipWith(f) {
    return function(a, b) {
        var n = a.length;
        var xs = new Array(n);
        for (var i = 0; i < n; i++) {
            xs[i] = f(a[i], b[i]);
        }
        return xs;
    };
}

function argMax(xs) {
    var n = xs.length;
    var ys = new Array(n);
    for (var i = 0; i < n; i++) {
        ys[i] = indexOfMax(xs[i]);
    }
    return ys;
}

function fIndex1(f) {
    return function(x, index) {
        var n = x.length;
        var z = new Array(n);
        for (var i = 0; i < n; i++) {
            z[i] = i === index ? f(x[i]) : x[i];
        }
        return z;
    };
}

function arrayGen(n, f) {
    var z = new Array(n);
    for (var i = 0; i < n; i++) {
        z[i] = f();
    }
    return z;
}

function indexOfMax(array) {
    var n = array.length;
    if (n === 0) {
        return -1;
    }
    var maxIndex = 0;
    var max = array[maxIndex];
    for (var i = 1; i < n; i++) {
        if (array[i] > max) {
            maxIndex = i;
            max = array[i];
        }
    }
    return maxIndex;
}

function forRange(min, max) {
    var z = [];
    for (var i = min; i < max; i++) {
        z.push(i);
    }
    return z;
}
