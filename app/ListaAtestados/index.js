import isolate from '@cycle/isolate';

import intent from './intent';
import model from './model';
import view from './view';

let _ListaAtestado = function(sources) {
	let action$ = intent(sources);
	let state$ = model(action$);
	let { vtree$, leveldb$, mailbox$ } = view(state$);

	return {
		DOM: vtree$,
		leveldb: leveldb$,
		mailbox: mailbox$,
		action: action$,
		state: state$
	};
};

let ListaAtestado = function(sources) {
	return isolate(_ListaAtestado)(sources);
};

export default ListaAtestado;