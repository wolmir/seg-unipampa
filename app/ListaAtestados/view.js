import xs from 'xstream';
import {article, section, header, h3, label, input, button, i, span, div, table, th, tr, td, thead, tbody, footer, p} from '@cycle/dom';

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
								button('.delete-button.w3-btn.w3-red', {props: {id: value.id}}, [i('.fa.fa-trash')])
							])
						])
					)
				)
			]);
}

function deleteModal(data) {
	return article('.w3-modal', {style: {display: (data.displayDeleteModal) ? 'block' : 'none'}}, [
		div('.w3-modal-content', {style: {'max-width': '60%'}}, [
			header('.w3-container.w3-red', [
				h3([i('.fa.fa-trash'), ' Deletar Modelo'])
			]),

			div('.w3-container', [
				p('Tem certeza que deseja deletar este modelo de atestado?')
			]),

			div('.w3-panel.w3-padding-8.w3-light-grey', [
				button('.modal-delete-button.w3-btn.w3-red.w3-right', {style: {'margin-right': '5px'}}, 'Deletar'),
				button('.modal-cancel-button.w3-btn.w3-blue-grey.w3-right', {style: {'margin-right': '5px'}}, 'Cancelar')
			])
		])
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
				]),

				deleteModal(state)
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