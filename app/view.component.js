'use strict';
import xs from 'xstream';
import {nav, a, span, h5, header, div} from '@cycle/dom';
import isolate from '@cycle/isolate';

let setProp = propName => value => obj => {
	let nobj = Object.assign({}, obj);
	nobj[propName] = value;
	return nobj;
};

function intent(sources) {
	const stateMap$ = sources.stateMap
		.fold((acc, s) => setProp(s.name)(s.component)(acc), {});

	return Object.assign({}, sources, {
		stateMap: stateMap$
	});
}

function model(sources) {
	return Object.assign({}, sources, {
		currentComponent: xs.combine(sources.currentState, sources.stateMap)
			.map([currentState, stateMap] => stateMap[currentState])
	});
}

function view(sources) {
	const currentComp$ = sources.currentComponent
		.map(currentComponent => currentComponent(sources));

	return {
		DOM: currentComp$.map(sink => sink.DOM).flatten()
	};
}

let _View = function(sources) {
	return view(model(intent(sources)));
};

let View = function(sources) {
	return isolate(_View)(sources);
};

export default View;