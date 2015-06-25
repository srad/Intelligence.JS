'use strict';

var core = require('./core');

var addw = new core.FnWrapper({
        name:       'add',
        childCount: 2,

        fn: function (l) {
            return l[0] + l[1];
        }
    }),

    subw = new core.FnWrapper({
        childCount: 2,
        name:       'substract',

        fn: function (l) {
            return l[0] - l[1];
        }
    }),

    mulw = new core.FnWrapper({
        childCount: 2,
        name:       'multiply',

        fn: function (l) {
            return l[0] * l[1];
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
        }
    }),

    isGreaterw = new core.FnWrapper({
        name:       'isgreater',
        childCount: 2,

        fn: function (l) {
            return l[0] > l[1] ? 1 : 0;
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
            return core.ConstNode(core.random(0, 10));
        }
    };

//console.log(tree1.evaluate([5, 3]));
//tree1.display();
createRandomTree(2).display();
