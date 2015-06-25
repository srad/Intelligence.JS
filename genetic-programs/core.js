'use strict';

/**
 * @param param.fn
 * @param param.childCount
 * @param param.name
 * @constructor
 */
function FnWrapper(param) {
    this.fn = param.fn;
    this.childCount = param.childCount;
    this.name = param.name;
    this.str = param.str;
}

/**
 * @param param.fw
 * @param param.name
 * @param param.children
 * @constructor
 */
function Node(param) {
    this.fn = param.fw.fn;
    this.name = param.fw.name;
    this.str = param.fw.str;
    this.children = param.children;
}

Node.prototype.evaluate = function (input) {
    var results = this.children.map(function (node) {
        return node.evaluate(input);
    });
    return this.fn(results);
};

Node.prototype.toStr = function (input) {
    var results = this.children.map(function (node) {
        return node.toStr(input);
    });
    return this.str(results);
};

Node.prototype.display = function (indent) {
    indent = (indent || 1);

    console.log(new Array(indent).join(' ') + this.name);
    this.children.forEach(function (node) {
        node.display(indent + 1);
    });
};

/**
 * @param index
 * @constructor
 */
function ParamNode(index) {
    this.index = index;
}

ParamNode.prototype.display = function (indent) {
    console.log(new Array(indent || 0).join(' ') + 'p' + this.index);
};

ParamNode.prototype.toStr = function () {
    return 'p' + this.index;
};

ParamNode.prototype.evaluate = function (input) {
    return input[this.index];
};

/**
 * @param v
 * @constructor
 */
function ConstNode(v) {
    this.v = v;
}

ConstNode.prototype.evaluate = function (input) {
    return this.v;
};

ConstNode.prototype.display = function (indent) {
    console.log(new Array(indent || 0).join(' ') + this.v);
};

ConstNode.prototype.toStr = function () {
    return this.v;
};

module.exports = {
    Node:      Node,
    FnWrapper: FnWrapper,
    ParamNode: ParamNode,
    ConstNode: ConstNode,
    random:    function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    pick:      function (array) {
        return array[this.random(0, array.length - 1)];
    }
};