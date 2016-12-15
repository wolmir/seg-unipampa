'use strict';
import xs from 'xstream';
import {nav, a, span, h5, header, div} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(sources) {
	const DOMSource = sources.DOM;
	const input$ = DOMSource
		.select('.side-nav-option')
		.events('click')
		.map(ev => ev.ownerTarget.classList[1]);

	return {
		intent$: input$,
		props$: sources.props,
		options$: sources.options
	};
}

function model(sources) {
	let initalValue$ = sources.props$.map(props => props.initial).take(1);
	const state$ = xs.combine(sources.options$, xs.merge(initalValue$, sources.intent$))
		.map(([options, intent]) => 
			options.map(option => {
				return {
					name: option.name,
					icon: option.icon,
					label: option.label,
					active: option.name === intent
				};
			})
		)
		.remember();

	return {
		model$: state$,
		props$: sources.props$
	}
}

function view(sources) {
	const options$ = sources.model$;
	const optionDom$ = options$.map(options => options.map(option =>
		a('.side-nav-option.' + option.name, {style: {'cursor': 'pointer'}}, [
			span('.fa.' + option.icon, {style: {color:'#000000', 'margin-bottom': '1em'}}), ' ' + option.label
		])
	));

	const vdom$ = xs.combine(sources.props$, optionDom$)
		.map(([props, optionDoms]) => nav('.sidenav.w3-sidenav.w3-theme-d1.w3-card-8.w3-large', {style: {width: '20%'}}, [
				header('.w3-container.w3-theme-d4', [
					h5(props.title)
				]),
				div({style: {'margin-top': '2em'}}, optionDoms)
			])
		);

	return {
		DOM: vdom$,
		model: options$
	};
}

let _SideNav = function(sources) {
	return view(model(intent(sources)));
};

let SideNav = function(sources) {
	return isolate(_SideNav)(sources);
};

export default SideNav;