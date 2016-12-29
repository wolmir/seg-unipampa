import xs from 'xstream';

function makeReducer$(action$) {

	let searchReducer$ = action$
		.filter(action => action.type === 'SEARCH_INPUT')
		.map(action => function searchReducer(data) {
			return {
				...data,
				filterInput: action.value,
				filteredModels: data.models.filter(model => {
					return (model.input_project.toLowerCase().search(action.value) >= 0) ||
						   (model.input_model_name.toLowerCase().search(action.value) >= 0) ||
						   (action.value.length === 0)
				})
			};
		});

	let requestListReducer$ = action$
		.filter(action => action.type === 'REQUEST_LIST')
		.mapTo(function requestListReducer(data) {
			return {
				...data,
				listRequest: true
			};
		});

	let requestModelReducer$ = action$
		.filter(action => action.type === 'REQUEST_MODEL')
		.map(action => function requestModelReducer(data) {
			return {
				...data,
				listRequest: false,
				modelRequest: action.modelId
			};
		});

	let receiveModelReducer$ = action$
		.filter(action => action.type === 'RECEIVE_MODEL')
		.map(action => function receiveModelReducer(data) {
			return {
				...data,
				modelRequest: null,
				models: data.models.concat([action.model]),
				filteredModels: (data.filterInput !== '') ? data.filteredModels : data.models.concat([action.model])
			};
		});

	return xs.merge(
		searchReducer$,
		requestListReducer$,
		requestModelReducer$,
		receiveModelReducer$
	);
}


function model(action$) {
	let reducer$ = makeReducer$(action$);

	return reducer$
		.fold((data, reducer) => reducer(data), {models: [], filteredModels: [], filterInput: ''})
		.remember();
}

export default model;