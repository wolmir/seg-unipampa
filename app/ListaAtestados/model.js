import xs from 'xstream';

function makeReducer$(action$) {

	const searchReducer$ = action$
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

	const requestListReducer$ = action$
		.filter(action => action.type === 'REQUEST_LIST')
		.mapTo(function requestListReducer(data) {
			return {
				...data,
				listRequest: true
			};
		});

	const requestModelReducer$ = action$
		.filter(action => action.type === 'REQUEST_MODEL')
		.map(action => function requestModelReducer(data) {
			return {
				...data,
				listRequest: false,
				modelRequest: action.modelId
			};
		});

	const receiveModelReducer$ = action$
		.filter(action => action.type === 'RECEIVE_MODEL')
		.map(action => function receiveModelReducer(data) {
			return {
				...data,
				modelRequest: null,
				models: data.models.concat([action.model]),
				filteredModels: (data.filterInput !== '') ? data.filteredModels : data.models.concat([action.model])
			};
		});

	const openDeleteModalReducer$ = action$
		.filter(action => action.type === 'OPEN_RM_MODAL')
		.map(action => function openDeleteModalReducer(data) {
			return {
				...data,
				displayDeleteModal: true,
				modelToDelete: action.id
			};
		});

	const closeDeleteModalReducer$ = action$
		.filter(action => action.type === 'CLOSE_RM_MODAL')
		.map(action => function closeDeleteModalReducer(data) {
			return {
				...data,
				displayDeleteModal: false,
				modelToDelete: null
			};
		});

	return xs.merge(
		searchReducer$,
		requestListReducer$,
		requestModelReducer$,
		receiveModelReducer$,
		openDeleteModalReducer$,
		closeDeleteModalReducer$
	);
}


function model(action$) {
	const reducer$ = makeReducer$(action$);

	return reducer$
		.fold((data, reducer) => reducer(data), {models: [], filteredModels: [], filterInput: ''})
		.remember().debug();
}

export default model;