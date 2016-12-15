'use strict';
import xs from 'xstream';
import {ul, li, span, div, img, a, br} from '@cycle/dom';
import isolate from '@cycle/isolate';

let _TopNav = function(sources) {
	// const actions$ = sources.actions.remember();
	// const iconActionsDOM$ = actions$
	// 	.map(actions => {
	// 			const actionDom$$  = actions.map(action => {
	// 				const actionProp$ = xs.of(action);
	// 				const actionSources = {DOM: sources.DOM, props: actionProps$};
	// 				return IconAction(actionSources).DOM;
	// 			});

	// 			return xs.combine(actionDom$$)
	// 				.map(actionDoms => actionDoms.map(ad => li('.w3-hide-small.w3-right', [ad])));
	// 		}
	// 	)
	// 	.flatten();

	const iconActionsDOM$ = xs.of([]);
	const state$ = sources.props.remember();

	const vdom$ = xs.combine(state$, iconActionsDOM$)
		.map(([state, iconActionDoms]) => 
			div('.topnav', [
				ul('.w3-navbar.w3-theme-d4.w3-card-4.w3-left-align.w3-large', [
					li([
						a('.w3-padding-large.w3-theme-l5', [
							img({
								props: {
									src: state.appIcon.src,
									alt: state.appIcon.alt
								},
								style: {width: state.appIcon.width}
							})
						])
					]),

					li('.w3-center', [
						br(),
						span('.w3-large', {style: {'margin-left': '10px', 'font-style': 'italic'}}, state.appTitle)
					])
				].concat(iconActionDoms))
			])
		);

	return {
		DOM: vdom$
	};
};

let TopNav = function(sources) {
	return isolate(_TopNav)(sources);
};

export default TopNav;