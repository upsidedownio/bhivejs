import test from 'ava';
import BehaviorTree from '../src/core/BehaviorTree';

test('Construct', t => {
    let bt = new BehaviorTree();
    t.truthy(bt.id);
    t.truthy(bt.name);
    t.not(bt.description, undefined);
    t.not(bt.root, undefined);
});

test('bar', async t => {
    // var tree = new BehaviorTree();
    // var node = {'_run': stub()};
    // var _blackboard = getBlackboard();
    // var target = {}
    //
    // _blackboard.get.withArgs('openNodes', 'tree1')
    //     .returns([]);
    //
    // tree.id = 'tree1';
    // tree.root = node;
    // tree.run(target, _blackboard);
    //
    // assert.isTrue(node._run.calledOnce);

    let bt = new BehaviorTree();

    const bar = Promise.resolve('bar');
    t.is(await bar, 'bar');
});
