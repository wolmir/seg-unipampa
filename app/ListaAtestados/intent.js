import xs from 'xstream';

function intent(sources) {
	const searchAction$ = sources.DOM
			.select('.search-input')
			.events('input')
			.map(ev => ev.target.value)
			.map(value => ({type: 'SEARCH_INPUT', value}));

	const requestListAction$ = xs.of({type: 'REQUEST_LIST'});

	const requestModel$ = sources.leveldb
			.select('list-request')
			.map(response => response.data)
			.map(list => xs.fromArray(list.map(modelId => ({type: 'REQUEST_MODEL', modelId}))))
			.flatten();

	const receiveModelAction$ = sources.leveldb
			.select('model-request')
			.map(response => response.data)
			.map(model => ({type: 'RECEIVE_MODEL', model}));

	const openDeleteModalAction$ = sources.DOM
		.select('.delete-button')
		.events('click')
		.map(ev => ev.ownerTarget.id)
		.map(id => ({type: 'OPEN_RM_MODAL', id}));

	const modalCancelBtnClick$ = sources.DOM
		.select('.modal-cancel-button')
		.events('click');

	const confirmModelDestruction$ = sources.leveldb
		.select('model-delete')
		.mapTo(true);

	const closeDeleteModalAction$ = xs.merge(modalCancelBtnClick$, confirmModelDestruction$)
		.mapTo({type: 'CLOSE_RM_MODAL'});

	const deleteAction$ = sources.DOM
		.select('.modal-delete-button')
		.events('click')
		.mapTo({type: 'DELETE_MODEL'});

	const editAction$ = sources.DOM
		.select('.edit-button')
		.events('click')
		.map(ev => ev.ownerTarget.id)
		.map(id => ({type: 'EDIT_MODEL', modelId: id}));

	return xs.merge(
		searchAction$,
		requestListAction$,
		requestModel$,
		receiveModelAction$,
		openDeleteModalAction$,
		closeDeleteModalAction$,
		deleteAction$,
		editAction$
	).remember();
}

export default intent;