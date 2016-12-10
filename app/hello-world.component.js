'use strict';
import xs from 'xstream';
import {p} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(sources) {
	return sources;
}

function model(sources) {
	return sources;
}

function view(sources) {
	return {
		DOM: xs.of(p('.w3-text-theme', {style:{'margin-left': '20%'}}, 'Hello World!'))
	};
}

let _HelloWorld = function(sources) {
	return view(model(intent(sources)));
};

let HelloWorld = function(sources) {
	return isolate(_HelloWorld)(sources);
};

export default HelloWorld;