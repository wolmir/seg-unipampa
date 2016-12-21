import isolate from '@cycle/isolate';

import intent from './intent';
import model from './model';
import view from './view';

let _FormAtestado = function(sources) {
	let action$ = intent(sources);
	let state$ = model(action$);
	let { vtree$, print$ } = view(state$);

	return {
		DOM: vtree$,
		print: print$,
		action: action$,
		state: state$
	};
};

let FormAtestado = function(sources) {
	return isolate(_FormAtestado)(sources);
};

export default FormAtestado;