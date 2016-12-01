'use strict';
import xs from 'xstream';
import {nav, a, span, h5, header, div} from '@cycle/dom';
import isolate from '@cycle/isolate';

let _SideNav = function(sources) {
	const state$ = sources.props.remember();

	const optionDom$ = sources.options.map(options => options.map(option =>
		a({style: {'cursor': 'pointer'}}, [span('.fa.' + option.icon, {style: {color:'#000000', 'margin-bottom': '1em'}}), ' ' + option.label])
	));

	const vdom$ = xs.combine(state$, optionDom$)
		.map(([state, optionDoms]) => nav('.w3-sidenav.w3-theme-d1.w3-card-8.w3-large', {style: {width: '20%'}}, [
				header('.w3-container.w3-theme-d4', [
					h5(state.title)
				]),
				div({style: {'margin-top': '2em'}}, optionDoms)
			])
		);

	return {
		DOM: vdom$
	};
};

// a({style: {'cursor': 'pointer'}}, [span('.fa.fa-file-word-o', {style: {color:'#000000', 'margin-bottom': '1em'}}), ' Atestados']),
// a({style: {'cursor': 'pointer'}}, [span('.fa.fa-file-text-o', {style: {color:'#000000', 'margin-bottom': '1em'}}), ' Relatórios'])

let SideNav = function(sources) {
	return isolate(_SideNav)(sources);
};

export default SideNav;