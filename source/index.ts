import {PassThrough} from 'node:stream';

const consoleMethods = [
	'assert',
	'count',
	'countReset',
	'debug',
	'dir',
	'dirxml',
	'error',
	'group',
	'groupCollapsed',
	'groupEnd',
	'info',
	'log',
	'table',
	'time',
	'timeEnd',
	'timeLog',
	'trace',
	'warn',
];

let originalMethods: Record<string, unknown> = {};

type Callback = (stream: 'stdout' | 'stderr', data: string) => void;
type Restore = () => void;

const patchConsole = (callback: Callback): Restore => {
	const stdout = new PassThrough();
	const stderr = new PassThrough();

	(stdout as any).write = (data: string): void => {
		callback('stdout', data);
	};

	(stderr as any).write = (data: string): void => {
		callback('stderr', data);
	};

	let internalConsole;
	if (typeof console.Console === 'function') {
	  internalConsole = new console.Console(stdout, stderr);
 	} else {
		internalConsole = console;
	}


	for (const method of consoleMethods) {
		originalMethods[method] = (console as any)[method];

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		(console as any)[method] = (internalConsole as any)[method];
	}

	return () => {
		for (const method of consoleMethods) {
			(console as any)[method] = originalMethods[method];
		}

		originalMethods = {};
	};
};

export default patchConsole;
