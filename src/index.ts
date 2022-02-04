import {PassThrough} from 'stream';

const CONSOLE_METHODS = [
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

let originalMethods: {[key: string]: any} = {};

type Callback = (stream: 'stdout' | 'stderr', data: string) => void;
type Restore = () => void;

const patchConsole = (callback: Callback): Restore => {
	const stdout = new PassThrough();
	const stderr = new PassThrough();

	(stdout as any).write = (data: string): void => callback('stdout', data);
	(stderr as any).write = (data: string): void => callback('stderr', data);

	const internalConsole = new console.Console(stdout, stderr);

	for (const method of CONSOLE_METHODS) {
		originalMethods[method] = (console as any)[method];
		(console as any)[method] = (internalConsole as any)[method];
	}

	return () => {
		for (const method of CONSOLE_METHODS) {
			(console as any)[method] = originalMethods[method];
		}

		originalMethods = {};
	};
};

export = patchConsole;
