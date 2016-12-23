import xs from 'xstream';
import {section, header, h3, label, input, button, i, span, div, table, th, tr, td, thead, tbody, footer} from '@cycle/dom';

import { vget, vkeys } from '../drivers/leveldb.driver';

function viewInputPesquisa() {
	return div('.w3-container.w3-section', {style: {position: 'relative'}}, [
				label('.w3-label', [
					span('.fa.fa-search'),
					' Pesquisar'
				]),
				input('.search-input.w3-input', {props: {type: 'text'}})
			]);
}


function viewTable(data) {
	return table('.w3-table.w3-bordered.w3-striped.w3-hoverable', [
				thead([
					tr('.w3-theme-d1', [
						th('Nome'),
						th('Projeto'),
						th('Ações')
					])
				]),
				tbody(data
					.map(value => 
						tr([
							td(value.input_model_name),
							td(value.input_project),
							td([
								button('.edit-button.w3-btn.w3-dark-grey', [i('.fa.fa-pencil')]),
								button('.delete-button.w3-btn.w3-red', [i('.fa.fa-trash')])
							])
						])
					)
				)
			]);
}


function view(state$) {
	const vtree$ = state$
		.map(state => 
			section('.w3-container.w3-row', {style:{'margin-left': '20%'}}, [
				section('.w3-section.w3-card-16.w3-col.l12.m12.s12', [
					header('.w3-container.w3-theme-d4.w3-padding', [
						h3('Lista de Modelos')
					]),
					section('.w3-row', [
						section('.w3-col.l12.m12.s12', [
							viewInputPesquisa(),
							viewTable(state.filteredModels)
						])
					]),
					footer('.w3-theme-d4.w3-center', [i('.fa.fa-pagelines')])
				])
			])
		);

	const requestForModelList$ = state$
		.filter(state => state.listRequest)
		.mapTo(vkeys('list-request'));

	const requestForModel$ = state$
		.filter(state => state.modelRequest)
		.map(state => state.modelRequest)
		.map(key => vget('model-request', key));

	const leveldb$ = xs.merge(requestForModelList$, requestForModel$);

	return { vtree$, leveldb$};
}

export default view;