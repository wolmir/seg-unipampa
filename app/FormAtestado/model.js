import xs from 'xstream';
import R from 'ramda';

function calcID(name) {
	return name.split('')
		.reduce((code, letter) => code + letter.charCodeAt(0), '');
};

function makeReducer$(action$) {

	let printReducer$ = action$
		.filter(action => action.type === 'PRINT')
		.mapTo(function printReducer(data) {
			return {
				...data,
				doPrint: true,
				doSave: false
			};
		});

	let genericInputReducer$ = action$
		.filter(action => action.type.startsWith('INPUT_'))
		.map(action => function genericInputReducer(data) {
			return {
				...data,
				[action.type.toLowerCase()]: action.value,
				doPrint: false,
				doSave: false
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
				doSave: false
			};
		});

	let rmStudentReducer$ = action$
		.filter(action => action.type === 'RM_STUDENT')
		.map(action => function rmStudentReducer(data) {
			return {
				...data,
				students: data.students.filter(student => student.id !== action.id),
				doPrint: false,
				doSave: false
			};
		});

	let saveReducer$ = action$
		.filter(action => action.type === 'SAVE')
		.map(action => function saveReducer(data) {
			return {
				...data,
				doPrint: false,
				doSave: true,
				store: {...data, doPrint: false, doSave: false, id: calcID(data.input_project)}
			};
		});

	let saveSuccessReducer$ = action$
		.filter(action => action.type === 'GREAT_SUCCESS')
		.map(action => function saveSuccessReducer(data) {
			return {
				...data,
				showModal: action.open,
				doSave: false,
				doPrint: false
			};
		});


	return xs.merge(
		genericInputReducer$,
		addStudentReducer$,
		rmStudentReducer$,
		printReducer$,
		saveReducer$,
		saveSuccessReducer$
	);
}


function model(action$) {
	let reducer$ = makeReducer$(action$);

	return reducer$
		.fold((data, reducer) => reducer(data), {students: []});
}

export default model;