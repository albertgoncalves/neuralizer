/* jshint evil: true */

var fs = require("fs");
var test = require("tape");

function readFile(path) {
    return fs.readFileSync(path).toString();
}

eval(readFile("./iterators.js"));
eval(readFile("./math.js"));
eval(readFile("./graphics.js"));

test("iterators", function(t) {
    function noArg() {
        return 0;
    }

    function oneArg(x) {
        return x * 2;
    }

    function twoArg(x, y) {
        return x * y;
    }

    t.same(zip([1], [2]), [[1, 2]]);
    t.same(zipWith([1, 2], [3, 4], twoArg), [3, 8]);
    t.equal(zipWithSum([1, 2], [3, 4], twoArg), 11);
    t.equal(sum([1, 2, 3]), 6);
    t.same(findAll([1, 2, 3, 1], 1), [0, 3]);
    t.same(permute([1, 2], [3, 4]), {
        xs: [1, 1, 2, 2],
        ys: [3, 4, 3, 4],
    });
    t.same(rangeArray(3, noArg), [0, 0, 0]);
    t.same(rangeMatrix(3, 2, noArg), [[0, 0], [0, 0], [0, 0]]);
    t.same(mapIndex(oneArg)([0, 1, 2], 2), [0, 1, 4]);
    t.equal(indexMax([1, 2, 3, 1]), 2);
    t.same(argMax([[0, 1], [1, 0]]), [1, 0]);
    t.same(transpose([[0, 1, 2], [3, 4, 5]]), [[0, 3], [1, 4], [2, 5]]);
    t.same(mapMatrix([[0, 1, 2], [3, 4, 5]], oneArg), [[0, 2, 4], [6, 8, 10]]);
    t.same(zipRowArrayWith([[0, 1, 2], [3, 4, 5]], [6, 7], twoArg),
           [[0, 6, 12], [21, 28, 35]]);
    t.same(zipColumnArrayWith([[0, 1, 2], [3, 4, 5]], [6, 7, 8], twoArg),
           [[0, 7, 16], [18, 28, 40]]);
    t.same(zipElementsWith([[0, 1, 2], [3, 4, 5]], [[6, 7, 8], [9, 10, 11]],
                           twoArg),
           [[0, 7, 16], [27, 40, 55]]);
    t.same(flattenSum([[0, 1, 2], [3, 4, 5]]), [3, 12]);
    t.same(dot([[0, 1, 2], [3, 4, 5]], [[0, 1], [2, 3], [4, 5]]),
           [[10, 13], [28, 40]]);
    t.end();
});

test("math", function(t) {
    t.equal(mean([1, 2, 3]), 2);
    t.equal(Math.round(std([0, 1, 2], 1) * 1000) / 1000, 0.816);
    t.end();
});

test("graphics", function(t) {
    t.equal(emptyCoordinate([0, 1], [2, 3], 1, 2), true);
    t.equal(emptyCoordinate([0, 1], [2, 3], 0, 2), false);
    t.same(calculateEdges(2, 2), {
        edges: [0, 2],
        target: {
            xs: [0, 0, 2, 2],
            ys: [0, 2, 0, 2],
        },
    });
    t.end();
});
