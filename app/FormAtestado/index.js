import isolate from '@cycle/isolate';

import intent from './intent';
import model from './model';
import view from './view';

let _FormAtestado = function(sources) {
	let action$ = intent(sources);
	let state$ = model(action$);
	let vtree$ = view(state$);

	return {
		DOM: vtree$,
		action$,
		state$
	};
};

let FormAtestado = function(sources) {
	return isolate(_FormAtestado)(sources);
};

export default FormAtestado;