import xs from 'xstream';

function intent(sources) {
	let searchAction$ = sources.DOM
			.select('.search-input')
			.events('input')
			.map(ev => ev.target.value)
			.map(value => ({type: 'SEARCH_INPUT', value}));

	let requestListAction$ = xs.of({type: 'REQUEST_LIST'});

	let requestModel$ = sources.leveldb
			.select('list-request')
			.map(response => response.data)
			.map(list => xs.fromArray(list.map(modelId => ({type: 'REQUEST_MODEL', modelId}))))
			.flatten();

	let receiveModelAction$ = sources.leveldb
			.select('model-request')
			.map(response => response.data)
			.map(model => ({type: 'RECEIVE_MODEL', model}));

	return xs.merge(
		searchAction$,
		requestListAction$,
		requestModel$,
		receiveModelAction$
	).remember();
}

export default intent;