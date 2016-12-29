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

	const deleteAction$ = sources.DOM
		.select('.delete-button')
		.events('click')
		.map(ev => ev.ownerTarget.id)
		.map(id => ({type: 'OPEN_RM_MODAL', id}));


	return xs.merge(
		searchAction$,
		requestListAction$,
		requestModel$,
		receiveModelAction$,
		deleteAction$
	).remember();
}

export default intent;