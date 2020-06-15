'use strict';
const test = require('ava');
const {spy} = require('sinon');
const patch = require('.');

test('intercept console.log()', t => {
	const write = spy();
	const restore = patch(write);

	console.log('test');
	restore();

	t.true(write.called);
	t.deepEqual(write.firstCall.args, ['stdout', 'test\n']);
});

test('intercept console.error()', t => {
	const write = spy();
	const restore = patch(write);

	console.error('test');
	restore();

	t.true(write.called);
	t.deepEqual(write.firstCall.args, ['stderr', 'test\n']);
});
