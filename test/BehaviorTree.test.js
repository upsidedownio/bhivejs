import test from 'ava';
import BehaviorTree from './BehaviorTree';

test('Construct', t => {
    let bt = new BehaviorTree();
    t.truthy(bt.id);
    t.truthy(bt.name);
    t.not(bt.description, undefined);
    t.not(bt.root, undefined);
});

test('bar', async t => {
    // var tree = new BehaviorTree();
    // var node = {'_execute': stub()};
    // var blackboard = getBlackboard();
    // var target = {}
    //
    // blackboard.get.withArgs('openNodes', 'tree1')
    //     .returns([]);
    //
    // tree.id = 'tree1';
    // tree.root = node;
    // tree.tick(target, blackboard);
    //
    // assert.isTrue(node._execute.calledOnce);

    let bt = new BehaviorTree();

    const bar = Promise.resolve('bar');
    t.is(await bar, 'bar');
});
