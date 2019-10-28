import test from 'ava';
import Blackboard from '../src/core/Blackboard';
import NodeBoard from '../src/core/NodeBoard';
import TreeBoard from '../src/core/TreeBoard';
import Board from '../src/core/Board';
import uuid from 'uuid/v4';
import sinon from "sinon";

test('Base Board: get, set, unset, clear', t => {
    let board = sinon.spy(new Board());

    // set
    t.is(board.set.called, false);
    t.is(board.get.called, false);
    board.set('first_data', 'data1');
    t.log('add first_data: "data1"', board.toJSON());
    board.set('second_data', 2);
    t.log('add second_data: 2', board.toJSON());
    t.is(board.set.called, true);
    t.is(board.get.called, false);

    // get
    t.is(board.get('first_data'), 'data1');
    t.is(board.get('second_data'), 2);
    t.is(board.get.called, true);

    // unset
    board.unset('second_data');
    t.is(board.get('second_data'), undefined);
    t.log('unset second_data', board.toJSON());

    // clear
    t.is(board.isEmpty(), false);
    board.clear();
    t.is(board.isEmpty(), true);
    t.log('after clear()', board.toJSON());

    // update member of object by nested key
    board.set('com', {numb: 123, str: 'hello world'});
    t.deepEqual(board.get('com'), {numb: 123, str: 'hello world'});
    board.set('com.numb', 456);
    t.deepEqual(board.get('com'), {numb: 456, str: 'hello world'});
});

test('NodeBoard: Construct', t => {
    // Default value of isOpen flag is false
    const nodeBoard = new NodeBoard();
    t.is(nodeBoard.isOpen(), false);

    // When give option to set initial value of isOpen flag
    // NodeBoard instance should initialized with given value
    const nodeBoardWithOpenFlag = new NodeBoard({isOpen: true});
    t.is(nodeBoardWithOpenFlag.isOpen(), true);
});

test('NodeBoard: open, close', t => {
    const nodeBoard = new NodeBoard();
    t.is(nodeBoard.isOpen(), false);
    t.log('initial status', nodeBoard.toJSON());

    // open
    nodeBoard.openNode();
    t.is(nodeBoard.isOpen(), true);
    t.log('after openNode()', nodeBoard.toJSON());

    // close
    nodeBoard.closeNode();
    t.is(nodeBoard.isOpen(), false);
    t.log('after closeNode()', nodeBoard.toJSON());
});

test('TreeBoard: construct', t => {
    const treeBoard = new TreeBoard();
    t.deepEqual(treeBoard.nodes, {});
});

test('TreeBoard: create, delete node', t => {
    const treeBoard = new TreeBoard();
    t.deepEqual(treeBoard.nodes, {});
    const uuid1 = uuid();
    const uuid2 = uuid();

    // create NodeBoard
    treeBoard.createNode(uuid1);
    t.log(treeBoard.node(uuid1).toJSON());
    t.log(treeBoard.toJSON());

    // put data into NodeBoard
    treeBoard.node(uuid1).set('firstData', 'hello world!');
    t.is(treeBoard.node(uuid1).get('firstData'), 'hello world!');

    // In case of create NodeBoard with already exist UUID, it returns exist NodeBoard
    treeBoard.createNode(uuid1);
    t.is(treeBoard.node(uuid1).get('firstData'), 'hello world!');

    // get list of NodeId
    treeBoard.createNode(uuid2);
    t.is(treeBoard.listNode().includes(uuid1), true);
    t.is(treeBoard.listNode().includes(uuid2), true);
    t.truthy(treeBoard.nodes[uuid1]);
    t.truthy(treeBoard.nodes[uuid2]);
    t.is(treeBoard.listNode().length, 2);

    // remove NodeBoard
    t.is(treeBoard.removeNode(uuid1), true);
    t.is(treeBoard.listNode().length, 1);
    t.is(treeBoard.listNode().includes(uuid2), true);
});

test('BlackBoard', t => {
    let bb = new Blackboard();

    // get & set shared board
    bb.set('sharedA', 'AA');
    t.is(bb.shared.get('sharedA'), 'AA');
    bb.shared.set('sharedA', 'BB');
    t.is(bb.get('sharedA'), 'BB');

    // get & set on tree board
    const treeId1 = uuid();
    const treeId2 = uuid();
    t.falsy(bb.tree(treeId1));
    t.truthy(bb.createTree(treeId1));
    bb.tree(treeId1).set('treeData', 'td');
    t.is(bb.tree(treeId1).get('treeData'), 'td');

    // if give safe option on tree() it will auto create empty treeBoard for you
    bb.tree(treeId2, {safe: true}).set('treeData2', 'td2');
    t.is(bb.tree(treeId2).get('treeData2'), 'td2');
    bb.listTree

    // get & set on node board
    const nodeId = uuid();
    t.falsy(bb.tree(treeId1).node(nodeId, {safe: true}).get('nodeData'));
    bb.tree(treeId1).node(nodeId).set('nodeData', 'nd');
    t.is(bb.tree(treeId1).node(nodeId).get('nodeData'), 'nd');

    // get list of TreeId
    t.truthy(bb.listTree().includes(treeId1));
    t.truthy(bb.listTree().includes(treeId2));
    t.truthy(bb.trees[treeId1]);
    t.truthy(bb.trees[treeId2]);
    t.is(bb.listTree().length, 2);

    // remove Tree
    bb.removeTree(treeId1);
    t.is(bb.listTree().length, 1);
    t.truthy(bb.listTree().includes(treeId2));

    t.log(JSON.stringify(bb.toJSON(), null, 4));
});
