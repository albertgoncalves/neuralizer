#!/usr/bin/env python3

import numpy as np
import sklearn.datasets


def init_model(n_input_dim, n_output_dim, n_hidden_dim):
    w1 = np.random.randn(n_input_dim , n_hidden_dim) / np.sqrt(n_input_dim)
    w2 = np.random.randn(n_hidden_dim, n_output_dim) / np.sqrt(n_hidden_dim)
    b1 = np.zeros((1, n_hidden_dim))
    b2 = np.zeros((1, n_output_dim))
    return w1, w2, b1, b2


def fwd_prop(model, X):
    w1, w2, b1, b2 = model
    z1 = np.dot(X, w1) + b1
    a1 = np.tanh(z1)
    z2 = np.dot(a1, w2) + b2
    exp_scr = np.exp(z2)
    pp = np.sum(exp_scr, axis=1, keepdims=True)
    p = exp_scr / pp
    return p, a1


def back_prop(model, X, Y, p, a1, reg_lambda, epsilon):
    w1, w2, b1, b2 = model

    delta3 = np.copy(p)
    delta3[range(len(p)), Y] -= 1

    dw2 = np.dot(a1.T, delta3)
    db2 = np.sum(delta3, axis=0, keepdims=True)
    delta2 = np.dot(delta3, w2.T) * (1 - np.power(a1, 2))
    dw1 = np.dot(X.T, delta2)
    db1 = np.sum(delta2, axis=0)

    dw2 += reg_lambda * w2
    dw1 += reg_lambda * w1

    w1 += -epsilon * dw1
    w2 += -epsilon * dw2
    b1 += -epsilon * db1
    b2 += -epsilon * db2

    return w1, w2, b1, b2


def train_model(model, n, X, Y, reg_lambda, epsilon):
    model = np.copy(model)
    for _ in range(n):
        p, a1 = fwd_prop(model, X)
        model = back_prop(model, X, Y, p, a1, reg_lambda, epsilon)
    return model


def predict(model, x):
    p, _ = fwd_prop(model, x)
    return np.argmax(p, axis=1)


def split_data(data, j):
    x, y = data
    if (j < 3) | (j > len(x) - 3):
        msg = "unable to split {} samples at index {}".format(len(x), j)
        raise ValueError(msg)
    return x[:j], y[:j], x[j:], y[j:]


def eval_model(pred, y):
    def check(a, b):
        if a == b:
            return 1
        else:
            return 0
    return np.mean(list(map(lambda pair: check(*pair), zip(pred, y))))


def main():
    np.random.seed(0)

    args = \
        { "n_samples": 30
        , "n_features": 2
        , "n_informative": 2
        , "n_redundant": 0
        , "n_repeated": 0
        , "n_classes": 2
        , "n_clusters_per_class": 2
        , "random_state": 0
        }
    data = sklearn.datasets.make_classification(**args)
    print(data)
    X, Y, x, y = split_data(data, 4)

    n_input_dim = X.shape[1]
    n_output_dim = len(np.unique(Y))
    n_hidden_dim = 3
    n_loops = 10
    epsilon = 0.01
    reg_lambda = 0.01

    model = init_model(n_input_dim, n_output_dim, n_hidden_dim)
    model = train_model(model, n_loops, X, Y, reg_lambda, epsilon)
    pred = predict(model, x)
    print(eval_model(pred, y))


if __name__ == "__main__":
    main()
