
function viewInputPesquisa() {
	return div('.w3-container.w3-section', {style: {position: 'relative'}}, [
				label('.w3-label', [
					span('.fa.fa-search'),
					' Pesquisar'
				]),
				input('.search-input.w3-input', {props: {type: 'text'}})
			]);
};


function viewTable(columns, data, actions) {
	return table('.w3-table.w3-bordered.w3-striped.w3-hoverable', [
				thead([
					tr('.w3-theme-d1', [
						th('Nome'),
						th('Projeto')
					])
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
							viewTable(columns, data, actions)
						])
					]),
					footer('.w3-theme-d4.w3-center', [i('.fa.fa-pagelines')])
				])
			])
		);

	return { vtree$, leveldb$};
}

export default view;