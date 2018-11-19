const main = () => {
    const xs  = [[1, 2, 3], [4, 5, 6]];
    const ys  = [[7, 8], [9, 10], [11, 12]];
    const xsT = transpose(xs, ys);
    console.log(xs);
    console.log(matIterF((x) => Math.sqrt(x))(xs));
    console.log(dot(xs, ys));
    console.log(addF(matElemF)(ys, xsT));
};

main();
