import test from 'ava';
import Blackboard from './Blackboard';
import uuid from 'uuid/v4';

test('Construct', t => {
    let bb = new Blackboard();

    // get & set shared board
    let globalA = bb.get('globalA');
    t.falsy(globalA);
    bb.set('globalA', 'AA');
    globalA = bb.get('globalA');
    t.is(globalA, 'AA');

    // get & set on tree board
    const treeId = uuid();
    bb.tree(treeId).set('treeData', 'td');
    t.is(bb.tree(treeId).get('treeData'), 'td');

    // legacy support
    // TODO remove it after obsolete legacy
    t.is(bb.get('treeData', treeId), 'td');
    bb.set('treeDataLegacy', 'tdl', treeId);
    t.is(bb.get('treeDataLegacy', treeId), 'tdl');

    // get & set on node board
    const nodeId = uuid();
    t.falsy(bb.tree(treeId).node(nodeId).get('nodeData'));
    bb.tree(treeId).node(nodeId).set('nodeData', 'nd');
    t.is(bb.tree(treeId).node(nodeId).get('nodeData'), 'nd');

    // legacy support
    // TODO remove it after obsolete
    t.is(bb.get('nodeData', treeId, nodeId), 'nd');
    bb.set('nodeDataLegacy', 'ndl', treeId, nodeId);
    t.is(bb.get('nodeDataLegacy', treeId, nodeId), 'ndl');

    console.log(JSON.stringify(bb.toJSON(), null, 4));
});
