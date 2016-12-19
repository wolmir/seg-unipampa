import xs from 'xstream';

let mapInputToAction = source => className => actionLabel => source
		.select(className)
		.events('input')
		.map(ev => ev.target.value)
		.startWith('')
		.map(value => Object.assign({}, {type: actionLabel, value: value}));

function intent(sources) {
	const iToA = mapInputToAction(sources.DOM);

	const dateAction$        = iToA('.date-input')('INPUT_DATE');
	const advisorAction$     = iToA('.advisor-input')('INPUT_ADVISOR');
	const projectAction$     = iToA('.project-input')('INPUT_PROJECT');
	const locationAction$    = iToA('.location-input')('INPUT_LOCATION');
	const descriptionAction$ = iToA('.description-input')('INPUT_DESCRIPTION');

	const studentNameInput$ = sources.DOM
		.select('.student-input')
		.events('input')
		.map(ev => ev.target.value);

	const studentHoursInput$ = sources.DOM
		.select('.student-hours-input')
		.events('input')
		.map(ev => ev.target.value);

	const studentInput$ = xs.combine(studentNameInput$, studentHoursInput$);

	const addStudentBtnClick$ = sources.DOM
		.select('.student-button')
		.events('click');

	const studentListAction$ = studentInput$
		.map(([name, hours]) => addStudentBtnClick$.mapTo({name: name, hours: hours}))
		.flatten()
		.map(student => ({type: 'ADD_STUDENT', student}));

	const removeStudentAction$ = sources.DOM
		.select('.remove-student-button')
		.events('click')
		.map(ev => ev.ownerTarget.id)
		.map(id => ({type: 'RM_STUDENT', id}));

	return xs.merge(
			dateAction$,
			studentListAction$,
			advisorAction$,
			projectAction$,
			locationAction$,
			descriptionAction$,
			removeStudentAction$);
}

export default intent;