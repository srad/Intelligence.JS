'use strict';

var core = require('./core');

Object.prototype.clone = function () {
    if (this.cloneNode) {
        return this.cloneNode(true);
    }
    var copy = this instanceof Array ? [] : {};
    for (var attr in this) {
        if (typeof this[attr] == "function" || this[attr] == null || !this[attr].clone) {
            copy[attr] = this[attr];
        } else if (this[attr] == this) {
            copy[attr] = copy;
        } else {
            copy[attr] = this[attr].clone();
        }
    }
    return copy;
};

Date.prototype.clone = function () {
    var copy = new Date();
    copy.setTime(this.getTime());
    return copy;
};

Number.prototype.clone =
    Boolean.prototype.clone =
        String.prototype.clone = function () {
            return this;
        };

var addw = new core.FnWrapper({
        name:       'add',
        childCount: 2,

        fn: function (l) {
            return l[0] + l[1];
        },

        str: function (l) {
            return '(' + l[0] + ' + ' + l[1] + ')';
        }
    }),

    subw = new core.FnWrapper({
        childCount: 2,
        name:       'substract',

        fn: function (l) {
            return l[0] - l[1];
        },

        str: function (l) {
            return '(' + l[0] + ' - ' + l[1] + ')';
        }
    }),

    mulw = new core.FnWrapper({
        childCount: 2,
        name:       'multiply',

        fn: function (l) {
            return l[0] * l[1];
        },

        str: function (l) {
            return '(' + l[0] + ' * ' + l[1] + ')';
        }
    }),

    ifw = new core.FnWrapper({
        name:       'if',
        childCount: 3,

        fn: function (l) {
            if (l[0] > 0) {
                return l[1];
            }
            return l[2];
        },

        str: function (l) {
            return 'if (' + l[0] + ' > 0) { return ' + l[1] + ' } else { return ' + l[2] + ' }';
        }
    }),

    isGreaterw = new core.FnWrapper({
        name:       'isgreater',
        childCount: 2,

        fn: function (l) {
            return l[0] > l[1] ? 1 : 0;
        },

        str: function (l) {
            return 'if (' + l[0] + ' > ' + l[1] + ') { return 1 } else { return 0 }';
        }
    }),

    fnList = [addw, subw, mulw, ifw, isGreaterw],

    tree1 = new core.Node({
        fw: ifw,

        children: [
            new core.Node({fw: isGreaterw, children: [new core.ParamNode(0), new core.ConstNode(3)]}),
            new core.Node({fw: addw, children: [new core.ParamNode(1), new core.ConstNode(5)]}),
            new core.Node({fw: subw, children: [new core.ParamNode(1), new core.ConstNode(2)]})
        ]
    }),

    createRandomTree = function (pc, maxDepth, fpr, ppr) {
        maxDepth = maxDepth === undefined ? 4 : maxDepth;
        fpr = fpr === undefined ? 0.5 : fpr;
        ppr = ppr === undefined ? 0.6 : ppr;

        if (Math.random() < fpr && maxDepth > 0) {
            var f = core.pick(fnList),
                children = Array.apply(null, new Array(f.childCount))
                    .map(function () {
                        return createRandomTree(pc, maxDepth - 1, fpr, ppr);
                    });

            return new core.Node({fw: f, children: children});
        } else if (Math.random() < ppr) {
            return new core.ParamNode(core.random(0, pc - 1));
        } else {
            return new core.ConstNode(core.random(0, 10));
        }
    },

    /**
     * Mutates subtree with a small probability.
     * @param t
     * @param pc
     * @param [probChange]
     * @returns {*}
     */
    mutate = function (t, pc, probChange) {
        probChange = probChange === undefined ? 0.1 : probChange;

        if (Math.random() < probChange) {
            return createRandomTree(pc);
        } else {
            var result = t.clone();
            if (t instanceof  core.Node) {
                result.children = t.children
                    .map(function (child) {
                        return mutate(child, pc, probChange);
                    });
            }
            return result;
        }
    },

    unknownFunction = function (x, y) {
        return (Math.pow(x, 2) + (2 * y) + (3 * x) + 5);
    },

    buildUknownFunktionValues = function () {
        return Array.apply(null, new Array(200))
            .map(function () {
                var x = core.random(0, 40),
                    y = core.random(0, 40);

                return [x, y, unknownFunction(x, y)];
            });
    },

    randomSet = buildUknownFunktionValues(),

    scoreFn = function (tree, s) {
        var dif = 0;

        s.forEach(function (data) {
            var v = tree.evaluate([data[0], data[1]]);
            dif += Math.abs(v - data[2]);
        });

        return dif;
    },

    randomTree = createRandomTree(2);

//console.log(tree1.evaluate([5, 3]));
//tree1.display();
//createRandomTree(2).display();

console.log(randomTree.toStr([2, 5]));
console.log(scoreFn(randomTree, randomSet));
//randomTree.display();

var mutated = mutate(randomTree, 2);

console.log('-------------------------------------');
console.log(scoreFn(randomTree, randomSet));
console.log(scoreFn(mutated, randomSet));