import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';

function main() {
	// TODO ...
}

const drivers = {
	DOM: makeDOMDriver('#app')
};

run(main, drivers);