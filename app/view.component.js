/* jshint node:true */
'use strict';
import xs from 'xstream';
import isolate from '@cycle/isolate';
var R = require('ramda');
import { vkeys } from './drivers/leveldb.driver';

// let setProp = propName => value => obj => {
// 	let nobj = Object.assign({}, obj);
// 	nobj[propName] = value;
// 	return nobj;
// };

function intent(sources) {
	const stateMap$ = sources.stateMap
		.fold((acc, s) => R.assoc(s.name, s, acc), {});

	return Object.assign({}, sources, {
		stateMap: stateMap$
	});
}

function model(sources) {
	return Object.assign({}, sources, {
		stateDesc: xs.combine(sources.currentState, sources.stateMap)
			.map(([currentState, stateMap]) => stateMap[currentState])
			.filter(desc => (typeof desc !== 'undefined'))
	});
}

function view(sources) {
	const currentComp$ = sources.stateDesc
		.map(stateDesct => stateDesct.component(stateDesct.sources)).remember();

	return {
		leveldb: currentComp$.map(sink => sink.leveldb).flatten(),
		print: currentComp$.filter(sink => sink.print).map(sink => sink.print).flatten(),
		DOM: currentComp$.map(sink => sink.DOM).flatten(),
		mailbox: currentComp$.map(sink => sink.mailbox).flatten()
	};
}

let _View = function(sources) {
	return view(model(intent(sources)));
};

let View = function(sources) {
	return isolate(_View)(sources);
};

export default View;