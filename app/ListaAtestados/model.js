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
				modelRequest: action.modelId
			};
		});

	const receiveModelReducer$ = action$
		.filter(action => action.type === 'RECEIVE_MODEL')
		.map(action => function receiveModelReducer(data) {
			const newModels = data.models.filter(m => m.id !== action.model.id).concat([action.model]);
			return {
				...data,
				modelRequest: null,
				models: newModels,
				filteredModels: (data.filterInput !== '') ? data.filteredModels : newModels
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
				modelToDelete: null,
				listRequest: true,
				models: [],
				filteredModels: []
			};
		});

	const deleteModalReducer$ = action$
		.filter(action => action.type === 'DELETE_MODEL')
		.map(action => function deleteModalReducer(data) {
			return {
				...data,
				deleteRequest: data.modelToDelete
			};
		});

	return xs.merge(
		searchReducer$,
		requestListReducer$,
		requestModelReducer$,
		receiveModelReducer$,
		openDeleteModalReducer$,
		closeDeleteModalReducer$,
		deleteModalReducer$
	);
}

function normalize(state) {
	return {
		...state,
		deleteRequest: null,
		listRequest: false
	};
}

function model(action$) {
	const reducer$ = makeReducer$(action$);

	return reducer$
		.fold((data, reducer) => reducer(normalize(data)), {models: [], filteredModels: [], filterInput: ''})
		.remember();
}

export default model;