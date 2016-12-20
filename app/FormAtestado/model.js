import xs from 'xstream';

function calcID(name) {
	return name.split('')
		.reduce((code, letter) => code + letter.charCodeAt(0), '');
};

function makeReducer$(action$) {
	let setUpPrintReducer$ = action$
		.filter(action => action.type !== 'PRINT')
		.mapTo(function setUpPrintReducer(data) {
			return {
				...data,
				doPrint: false
			};
		});

	let printReducer$ = action$
		.filter(action => action.type === 'PRINT')
		.mapTo(function printReducer(data) {
			return {
				...data,
				doPrint: true
			};
		});

	let genericInputReducer$ = action$
		.filter(action => action.type.startsWith('INPUT_'))
		.map(action => function genericInputReducer(data) {
			return {
				...data,
				[action.type.toLowerCase()]: action.value
			};
		});

	let addStudentReducer$ = action$
		.filter(action => action.type === 'ADD_STUDENT')
		.debug()
		.map(action => ({...action, student: {...action.student, id: calcID(action.student.name)}}))
		.map(action => function addStudentReducer(data) {
			return {
				...data,
				students: [action.student, ...data.students]
			};
		});

	let rmStudentReducer$ = action$
		.filter(action => action.type === 'RM_STUDENT')
		.map(action => function rmStudentReducer(data) {
			return {
				...data,
				students: data.students.filter(student => student.id !== action.id)
			};
		});


	return xs.merge(
		genericInputReducer$,
		addStudentReducer$,
		rmStudentReducer$,
		setUpPrintReducer$,
		printReducer$
	);
}


function model(action$) {
	let reducer$ = makeReducer$(action$);

	return reducer$
		.fold((data, reducer) => reducer(data), {students: []});
}

export default model;