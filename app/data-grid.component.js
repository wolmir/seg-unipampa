'use strict';
import xs from 'xstream';
import {
	span, 
	header, 
	div, 
	section, 
	table, 
	thead, 
	tbody, 
	th, 
	tr, 
	td, 
	button, 
	input, 
	label, 
	h3, 
	footer, 
	i
} from '@cycle/dom';
import isolate from '@cycle/isolate';

var viewInputPesquisa = function() {
	return div('.w3-container.w3-section', {style: {position: 'relative'}}, [
				label('.w3-label', [
					span('.fa.fa-search'),
					' Pesquisar'
				]),
				input('.w3-input', {props: {type: 'text'}})
			]);
};

var viewTable = function(columns, data, actions) {
	return table('.w3-table.w3-bordered.w3-striped.w3-hoverable', [
				thead([
					tr('.w3-theme-d1', columns.map(column => th(column.label)).concat([th('Ações')]))
				]),
				tbody(data
					.map(value => 
						tr(columns
							.map(column =>
								td(value[column.name])
							)
							.concat([
								td(actions
									.map(action => 
										button('.w3-btn.' + (action.color || 'w3-dark-grey'), [i('.fa.' + action.icon)])
									)
								)
							])
						)
					)
				)
			]);
};

let _DataGrid = function(sources) {
	const props$ = sources.props;
	const columns$ = sources.columns.remember();
	const actions$ = sources.actions.remember();
	const data$ = sources.data.fold((acc, d) => acc.concat([d]), []);
	const state$ = xs.combine(props$, columns$, actions$, data$);
	const vdom$ = state$
		.map(([props, columns, actions, data]) => 
			section('.w3-container.w3-row', {style:{'margin-left': '20%'}}, [
				section('.w3-section.w3-card-16.w3-col.l12.m12.s12', [
					header('.w3-container.w3-theme-d4.w3-padding', [
						h3(props.title)
					]),
					section('.w3-row', [
						section('.w3-col.l12.m12.s12', [
							viewInputPesquisa(),
							viewTable(columns, data, actions)
						])
					]),
					footer('.w3-theme-d4.w3-center', [i('.fa.fa-pagelines')])
				])
			])
		);
	return {
		DOM: vdom$
	};
};

let DataGrid = function(sources) {
	return isolate(_DataGrid)(sources);
};

export default DataGrid;