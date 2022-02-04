import test from 'ava';
import sinon from 'sinon';
import patch from './dist/index.js';

test('intercept console.log()', t => {
	const write = sinon.spy();
	const restore = patch(write);

	console.log('test');
	restore();

	t.true(write.called);
	t.deepEqual(write.firstCall.args, ['stdout', 'test\n']);
});

test('intercept console.error()', t => {
	const write = sinon.spy();
	const restore = patch(write);

	console.error('test');
	restore();

	t.true(write.called);
	t.deepEqual(write.firstCall.args, ['stderr', 'test\n']);
});
