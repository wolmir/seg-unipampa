import isolate from '@cycle/isolate';

import intent from './intent';
import model from './model';
import view from './view';

let _FormAtestado = function(sources) {
	let action$ = intent(sources);
	let state$ = model(action$);
	let { vtree$, print$, leveldb$, mailbox$ } = view(state$);

	return {
		DOM: vtree$,
		print: print$,
		leveldb: leveldb$,
		mailbox: mailbox$,
		action: action$,
		state: state$
	};
};

let FormAtestado = function(sources) {
	return isolate(_FormAtestado)(sources);
};

export default FormAtestado;