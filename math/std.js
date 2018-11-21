/* pure functions */
const mean = (array) => {
    let sum = 0;
    for (let i = 0; i < array.length; i++) sum += array[i];
    return sum / array.length;
};

const sqDiff = (array, mu) => array.map((x) => Math.pow(x - mu, 2));
const std    = (array, mu) => Math.sqrt(mean(sqDiff(array, mu)));

const condition = (xs, mu, sigma) => {
    return xs.map((x) => (x - mu) / sigma);
};

const normalize = (xs) => {
    const mu    = mean(xs);
    const sigma = std(xs, mu);
    const units = condition(xs, mu, sigma);
    return {units, mu, sigma};
};
