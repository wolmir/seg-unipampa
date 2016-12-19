/* jshint node:true */
'use strict';
import xs from 'xstream';
import {section, header, h3, p, label, input, textarea, button, i, article, span, img, br, hr, ul, li} from '@cycle/dom';
import isolate from '@cycle/isolate';
var R = require('ramda');

function intent(sources) {
	return {
		DOM: sources.DOM,
		formControls: sources.formControls
			.fold((consolidated, formControl) => consolidated.concat([formControl]), []);
	};
}

function model(sources) {
	return {
		DOM: sources.DOM,
		formControlSinks: sources.formControls
			.map(consolidated => consolidated
				.map(control => Object.assign({}, control, {sink: control.component(control.sources)}))
			)
			.map(controls => {
				return {
					state: controls
						.reduce((stateObj, control) => R.assoc(control.identifier, control.sink.state, stateObj), {})
				}
			});
	};
}

function view(sources) {
	return sources;
}

let _Form = function(sources) {
	return view(model(intent(sources)));
};

let Form = function(sources) {
	return isolate(_Form)(sources);
};

export default Form;