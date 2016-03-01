var Result = new Array(), backupNodes = null, indicator = false;
backupNodes = [];

function clone(obj) 
{
    if(!obj || typeof obj !== 'object') 
    {
        return obj;
    }
    
    var c = (typeof obj.pop === 'function') ? [] : {};
    var p, v;
    
    for(p in obj) 
    {
        if(obj.hasOwnProperty(p)) 
        {
            v = obj[p];
            if(v && typeof v === 'object') 
            {
                c[p] = clone(v);
            }
            else 
            {
                c[p] = v;
            }
        }
    }
    
    return c;
}

/*support*/
function supportMinimax() {
    var tempArray = new Array(),
        tempElArray;
    for (var nc = 25; nc >= 0; nc--) {
        for (var countEdges = 0; countEdges < 61; countEdges++) {
            if (edges[countEdges]['from'] == nc) {
                tempNode = parseInt(edges[countEdges]['to']);
                tempElArray = parseInt(backupNodes[tempNode]['label']);
                tempArray.push(tempElArray);
            }
        }
        switch (nodes[nc]['level']) {
            case 0:
                backupNodes[nc]['label'] = getMin(tempArray);
                break;
            case 1:
                backupNodes[nc]['label'] = getMax(tempArray);
                break;
            case 3:
                backupNodes[nc]['label'] = getMin(tempArray);
                break;
            case 5:
                backupNodes[nc]['label'] = getMax(tempArray);
                break;
            default:
                break;
        }
        tempArray = [];
    }
	for (var nod = 26; nod < 62; nod++) {
        if (nodes[nod].label == undefined) {
            //nodes[nod].color = '#F3214B';
			nodes[nod].label = backupNodes[nod].label;
            /*for (var edg = 0; edg < 61; edg++) {
                if (edges[edg].to == nod) edges[edg].color = '#F3214B';
            }*/
        }
    }
	nodes[0].label = backupNodes[0].label;
	console.log(backupNodes);
	indicator = true; 
    draw();
}

//Starter
function play(MinOrMax, struct) {
    var root = new Structure(struct);
    if (MinOrMax === "min") {
        playMin(-Infinity, Infinity, root);
    } else if (MinOrMax === "max") {
        playMax(-Infinity, Infinity, root);
    } else {
        console.log("MinOrMax must be either the string 'min' or the string 'max' (case sensitive).");
    }
    if (typeof console.groupCollapsed === 'function') {
        return groupLog(root);
    } else {
        return loggable(root);
    }
}

//Main Algorithm
function playMax(alpha, beta, node) {
    if (isCutOff(node)) return record(node, evaluation(node));
    var value = -Infinity;
    var children = successors(node);
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        value = max(value, playMin(alpha, beta, child));
        if (value >= beta) return record(node, value);
        if (value > alpha) alpha = value;
    }
    return record(node, value);
}

function playMin(alpha, beta, node) {
    if (isCutOff(node)) return record(node, evaluation(node));
    var value = Infinity;
    var children = successors(node);
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        value = min(value, playMax(alpha, beta, child));
        if (value <= alpha) return record(node, value);
        if (value < beta) beta = value;
    }
    return record(node, value);
}

//Helper functions перезагрузка!
function record(node, value) {
    node.value = value;
    delete node.pruned;
    return value;
}

function isCutOff(node) {
    return (typeof node.value !== "undefined");
}

function evaluation(node) {
    return node.value;
}

function successors(node) {
    return node.children;
}

function min(a, b) {
    if (a < b) return a;
    else return b;
}

function max(a, b) {
    if (a > b) return a;
    else return b
}

function Structure(struct) {
    var result = this;
    result.pruned = true;
    if (Array.isArray(struct)) {
        result.children = [];
        for (var i = 0; i < struct.length; i++) {
            result.children.push(new Structure(struct[i]));
        }
    } else if (typeof struct === "number") {
        result.value = struct;
    } else {
        throw "The struct must consist of a combination of arrays and numbers to form a tree.";
    }
}

Structure.prototype.toString = function() {
    return result.pruned ? 'pruned' : result.value;
}

function loggable(struct) {
    Result.push(struct);
    if (struct.pruned) return 'pruned';
    else if (typeof struct.children === 'undefined') return struct.value;
    else {
        var result = {
            '$value': struct.value
        };
        for (var i = 0; i < struct.children.length; i++) {
            result['c' + i] = (loggable(struct.children[i]));
        }
        return result;
    }
}

function groupLog(struct) {
    Result.push(struct);
    if (struct.pruned) console.log('pruned');
    else if (typeof struct.children === 'undefined') console.log(struct.value);
    else {
        var result = {
            '$value': struct.value
        };
        console.groupCollapsed(struct.value);
        for (var i = 0; i < struct.children.length; i++) {
            groupLog(struct.children[i]);
        }
        console.groupEnd();
    }
}

//ES5 shim
if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) == '[object Array]';
    };
}

var nodes = null; //вершины
var edges = null; //связи
var network = null;
nodes = []; //вершины
edges = []; //связи

/*построение объекта содержащего вершины*/
for (var i = 0; i < 62; i++) {
    if (i == 0) nodes.push({
        id: i,
        label: '',
        alpha: -Infinity,
        beta: Infinity,
        v: Infinity,
        level: 0,
        color: '#4caf50',
        font: {
            color: '#ffffff'
        }
    });

    if ((i > 0) && (i < 4)) nodes.push({
        id: i,
        label: '',
        alpha: -Infinity,
        beta: Infinity,
        v: -Infinity,
        level: 1,
        color: '#4caf50',
        font: {
            color: '#ffffff'
        }
    });
    if ((i > 3) && (i < 11)) nodes.push({
        id: i,
        label: '',
        alpha: -Infinity,
        beta: Infinity,
        v: Infinity,
        level: 3,
        color: '#4caf50',
        font: {
            color: '#ffffff'
        }
    });
    if ((i > 10) && (i < 26)) nodes.push({
        id: i,
        label: '',
        alpha: -Infinity,
        beta: Infinity,
        v: -Infinity,
        level: 5,
        color: '#4caf50',
        font: {
            color: '#ffffff'
        }
    });
    if (i > 25) nodes.push({
        id: i,
        label: '',
        alpha: -Infinity,
        beta: Infinity,
        v: Infinity,
        level: 7,
        color: '#4caf50',
        font: {
            color: '#ffffff'
        }
    });
}

/*связи дерева*/
edges.push({
    from: 0,
    color: '#272727',
    to: 1
});
edges.push({
    from: 0,
    color: '#272727',
    to: 2
});
edges.push({
    from: 0,
    color: '#272727',
    to: 3
});
edges.push({
    from: 1,
    color: '#272727',
    to: 4
});
edges.push({
    from: 1,
    color: '#272727',
    to: 5
});
edges.push({
    from: 2,
    color: '#272727',
    to: 6
});
edges.push({
    from: 2,
    color: '#272727',
    to: 7
});
edges.push({
    from: 2,
    color: '#272727',
    to: 8
});
edges.push({
    from: 3,
    color: '#272727',
    to: 9
});
edges.push({
    from: 3,
    color: '#272727',
    to: 10
});
edges.push({
    from: 4,
    color: '#272727',
    to: 11
});
edges.push({
    from: 4,
    color: '#272727',
    to: 12
});
edges.push({
    from: 4,
    color: '#272727',
    to: 13
});
edges.push({
    from: 5,
    color: '#272727',
    to: 14
});
edges.push({
    from: 5,
    color: '#272727',
    to: 15
});
edges.push({
    from: 5,
    color: '#272727',
    to: 16
});
edges.push({
    from: 6,
    color: '#272727',
    to: 17
});
edges.push({
    from: 6,
    color: '#272727',
    to: 18
});
edges.push({
    from: 7,
    color: '#272727',
    to: 19
});
edges.push({
    from: 7,
    color: '#272727',
    to: 20
});
edges.push({
    from: 8,
    color: '#272727',
    to: 21
});
edges.push({
    from: 8,
    color: '#272727',
    to: 22
});
edges.push({
    from: 9,
    color: '#272727',
    to: 23
});
edges.push({
    from: 9,
    color: '#272727',
    to: 24
});
edges.push({
    from: 10,
    color: '#272727',
    to: 25
});
edges.push({
    from: 11,
    color: '#272727',
    to: 26
});
edges.push({
    from: 11,
    color: '#272727',
    to: 27
});
edges.push({
    from: 12,
    color: '#272727',
    to: 28
});
edges.push({
    from: 12,
    color: '#272727',
    to: 29
});
edges.push({
    from: 13,
    color: '#272727',
    to: 30
});
edges.push({
    from: 13,
    color: '#272727',
    to: 31
});
edges.push({
    from: 13,
    color: '#272727',
    to: 32
});
edges.push({
    from: 14,
    color: '#272727',
    to: 33
});
edges.push({
    from: 14,
    color: '#272727',
    to: 34
});
edges.push({
    from: 15,
    color: '#272727',
    to: 35
});
edges.push({
    from: 15,
    color: '#272727',
    to: 36
});
edges.push({
    from: 15,
    color: '#272727',
    to: 37
});
edges.push({
    from: 16,
    color: '#272727',
    to: 38
});
edges.push({
    from: 16,
    color: '#272727',
    to: 39
});
edges.push({
    from: 16,
    color: '#272727',
    to: 40
});
edges.push({
    from: 17,
    color: '#272727',
    to: 41
});
edges.push({
    from: 17,
    color: '#272727',
    to: 42
});
edges.push({
    from: 18,
    color: '#272727',
    to: 43
});
edges.push({
    from: 18,
    color: '#272727',
    to: 44
});
edges.push({
    from: 19,
    color: '#272727',
    to: 45
});
edges.push({
    from: 19,
    color: '#272727',
    to: 46
});
edges.push({
    from: 20,
    color: '#272727',
    to: 47
});
edges.push({
    from: 20,
    color: '#272727',
    to: 48
});
edges.push({
    from: 20,
    color: '#272727',
    to: 49
});
edges.push({
    from: 21,
    color: '#272727',
    to: 50
});
edges.push({
    from: 21,
    color: '#272727',
    to: 51
});
edges.push({
    from: 22,
    color: '#272727',
    to: 52
});
edges.push({
    from: 22,
    color: '#272727',
    to: 53
});
edges.push({
    from: 22,
    color: '#272727',
    to: 54
});
edges.push({
    from: 23,
    color: '#272727',
    to: 55
});
edges.push({
    from: 23,
    color: '#272727',
    to: 56
});
edges.push({
    from: 24,
    color: '#272727',
    to: 57
});
edges.push({
    from: 24,
    color: '#272727',
    to: 58
});
edges.push({
    from: 25,
    color: '#272727',
    to: 59
});
edges.push({
    from: 25,
    color: '#272727',
    to: 60
});
edges.push({
    from: 25,
    color: '#272727',
    to: 61
});

/*очистка канваса*/
function destroy() {
    if (network !== null) {
        network.destroy();
        network = null;
    }
}

/*отрисовка дерева*/
function draw() {
    destroy();

    // create a network
    var container = document.getElementById('Graph');
    var data = {
        nodes: nodes,
        edges: edges
    };

    var options = {
        autoResize: true,
        height: '100%',
        width: '100%',
        nodes: {
            size: 30,
            font: {
                size: 45
            },
            borderWidth: 2,
            shadow: true
        },
        edges: {
            width: 5,
            smooth: {
                type: 'cubicBezier',
                forceDirection: 'horizontal',
                roundness: 0
            }
        },
        layout: {
            hierarchical: {
                direction: 'UD'
            }
        }
    };
    network = new vis.Network(container, data, options);
}

/*Обновление вершин, если поменять*/
function UpdateValues() {
    for (var cl = 26; cl < 62; cl++) {
        nodes[cl]['label'] = parseInt(document.getElementById(cl).value);
    }
	backupNodes = clone(nodes);
    draw();
}

/*вспомогательная: находит max элемент одномерного массива*/
function getMax(arr) {
    var arrLen = arr.length,
        maxEl = arr[0];
    for (var i = 0; i < arrLen; i++) {
        if (maxEl < arr[i]) {
            maxEl = arr[i];
        }
    }
    return maxEl;
}

/*вспомогательная: находит min элемент одномерного массива*/
function getMin(arr) {
    var arrLen = arr.length,
        minEl = arr[0];
    for (var i = 0; i < arrLen; i++) {
        if (minEl > arr[i]) {
            minEl = arr[i];
        }
    }
    return minEl;
}

/*Минимакс*/
function Minimax() {
    var tempArray = new Array(),
        tempElArray;
    for (var nc = 25; nc >= 0; nc--) {
        for (var countEdges = 0; countEdges < 61; countEdges++) {
            if (edges[countEdges]['from'] == nc) {
                tempNode = parseInt(edges[countEdges]['to']);
                tempElArray = parseInt(nodes[tempNode]['label']);
                tempArray.push(tempElArray);
            }
        }
        switch (nodes[nc]['level']) {
            case 0:
                nodes[nc]['label'] = getMin(tempArray);
                break;
            case 1:
                nodes[nc]['label'] = getMax(tempArray);
                break;
            case 3:
                nodes[nc]['label'] = getMin(tempArray);
                break;
            case 5:
                nodes[nc]['label'] = getMax(tempArray);
                break;
            default:
                break;
        }
        tempArray = [];
    }
	backupNodes = clone(nodes);
	indicator = true; 
    draw();
}

function convertToSimpleArray(array) {
    var res = [];
    for (var i = 0; i < array.length; i++)
        if (!Array.isArray(array[i]))
            res.push(array[i]);
    res = res.concat(convertToSimpleArray(array[i]));
    return res;
}

function DrawNewTree() {
    for (var nod = 0; nod < 62; nod++) {
        if (nodes[nod].label == undefined) {
            nodes[nod].color = '#F3214B';
			//nodes[nod].label = backupNodes[nod].label;
            for (var edg = 0; edg < 61; edg++) {
                if (edges[edg].to == nod) edges[edg].color = '#F3214B';
            }
        }
    }
    draw();
}

function AlphaBeta() {
    play('min', [
        [
            [
                [nodes[26]['label'], nodes[27]['label']],
                [nodes[28]['label'], nodes[29]['label']],
                [nodes[30]['label'], nodes[31]['label'], nodes[32]['label']]
            ],
            [
                [nodes[33]['label'], nodes[34]['label']],
                [nodes[35]['label'], nodes[36]['label'], nodes[37]['label']],
                [nodes[38]['label'], nodes[39]['label'], nodes[40]['label']]
            ]
        ],
        [
            [
                [nodes[41]['label'], nodes[42]['label']],
                [nodes[43]['label'], nodes[44]['label']]
            ],
            [
                [nodes[45]['label'], nodes[46]['label']],
                [nodes[47]['label'], nodes[48]['label'], nodes[49]['label']]
            ],
            [
                [nodes[50]['label'], nodes[51]['label']],
                [nodes[52]['label'], nodes[53]['label'], nodes[54]['label']]
            ]
        ],
        [
            [
                [nodes[55]['label'], nodes[56]['label']],
                [nodes[57]['label'], nodes[58]['label']]
            ],
            [
                [nodes[59]['label'], nodes[60]['label'], nodes[61]['label']]
            ]
        ]
    ]);

    Result = Result[0].children;
    console.log(Result[1]);
    var objcount = 0;
    var objpath = '';
    ReadNewTree();
    DrawNewTree();
	supportMinimax();
}