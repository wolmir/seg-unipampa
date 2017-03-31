/* jshint esversion:6 */

import xs from 'xstream';
import R from 'ramda';

function calcID(name) {
	return name.split('')
		.reduce((code, letter) => code + letter.charCodeAt(0), '');
}

function makeReducer$(action$) {

	let printReducer$ = action$
		.filter(action => action.type === 'PRINT')
		.mapTo(function printReducer(data) {
			return {
				...data,
				doPrint: true,
				doSave: false,
				editMode: false
			};
		});

	let genericInputReducer$ = action$
		.filter(action => action.type.startsWith('INPUT_'))
		.map(action => function genericInputReducer(data) {
			return {
				...data,
				[action.type.toLowerCase()]: action.value,
				doPrint: false,
				doSave: false,
				editMode: false
			};
		});

	let addStudentReducer$ = action$
		.filter(action => action.type === 'ADD_STUDENT')
		.map(action => ({...action, student: {...action.student, id: calcID(action.student.name)}}))
		.map(action => function addStudentReducer(data) {
			return {
				...data,
				students: [action.student, ...data.students],
				doPrint: false,
				doSave: false,
				editMode: false
			};
		});

	let rmStudentReducer$ = action$
		.filter(action => action.type === 'RM_STUDENT')
		.map(action => function rmStudentReducer(data) {
			return {
				...data,
				students: data.students.filter(student => student.id !== action.id),
				doPrint: false,
				doSave: false,
				editMode: false
			};
		});

	let saveReducer$ = action$
		.filter(action => action.type === 'SAVE')
		.map(action => function saveReducer(data) {
			return {
				...data,
				doPrint: false,
				doSave: true,
				store: {...data, doPrint: false, doSave: false, id: calcID(data.input_project)},
				editMode: false
			};
		});

	let saveSuccessReducer$ = action$
		.filter(action => action.type === 'GREAT_SUCCESS')
		.map(action => function saveSuccessReducer(data) {
			return {
				...data,
				showModal: action.open,
				doSave: false,
				doPrint: false,
				editMode: false
			};
		});

	let editModelReducer$ = action$
		.filter(action => action.type === 'EDIT_MODEL')
		.map(action => function editModelReducer(data) {
			return Object.assign({}, data, action.model, {
				doSave: false,
				doPrint: false,
				editMode: true
			})
		});


	return xs.merge(
		genericInputReducer$,
		addStudentReducer$,
		rmStudentReducer$,
		printReducer$,
		saveReducer$,
		saveSuccessReducer$,
		editModelReducer$
	);
}


function model(action$) {
	let reducer$ = makeReducer$(action$);

	return reducer$
		.fold((data, reducer) => reducer(data), {
			students: [],
			input_date: '',
			input_advisor: '',
			input_project: '',
			input_location: '',
			input_description: '',
			input_model_name: ''
		})
		.debug('from model >>> ');
		// .map(state => {
		// 	if (state.editMode) {
		// 		debugger;
		// 	}
		// 	return state;
		// });
}

export default model;