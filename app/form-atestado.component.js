/* jshint node:true */
'use strict';
import xs from 'xstream';
import {section, header, h3, p, label, input, textarea, button, i, article, span, img, br, hr} from '@cycle/dom';
import isolate from '@cycle/isolate';
var R = require('ramda');

var mapInputToAction = source => className => actionLabel => source
		.select(className)
		.events('input')
		.map(ev => ev.target.value)
		.startWith('')
		.map(value => Object.assign({}, {type: actionLabel, value: value}));

var interpretDescription = state => {
	if (!state.description) {
		return '';
	}

	return state.description
		.replace('{{nome_aluno}}', state.student_name)
		.replace('{{matricula}}', state.student_id)
		.replace('{{projeto}}', state.project);
};

function intent(sources) {
	const iToA = mapInputToAction(sources.DOM);

	const descriptionAction$ = iToA('.description-input')('DESCRIPTION');
	const dateAction$        = iToA('.date-input')('DATE');
	const advisorAction$     = iToA('.advisor-input')('ADVISOR');
	const projectAction$     = iToA('.project-input')('PROJECT');
	const locationAction$    = iToA('.location-input')('LOCATION');
	// const studentIdAction$   = iToA('.student-id-input')('STUDENT_ID');

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
		.fold((students, newStudent) => students.concat(newStudent), [])
		.startWith([])
		.map(students => Object.assign({}, {type: 'STUDENTS', value: students}))
		.debug();

	return {
		DOM: sources.DOM,
		actions: xs.merge(
			dateAction$,
			studentListAction$,
			advisorAction$,
			projectAction$,
			locationAction$,
			descriptionAction$)
	};
}

function model(sources) {
	return {
		DOM: sources.DOM,
		state: sources.actions
			.fold((previousState, action) => R.assoc(action.type.toLowerCase(), action.value, previousState), {})
	};
}

function view(sources) {
	return {
		DOM: sources.state.map(state =>
			section('.w3-container.w3-row', {style: {'margin-left': '20%'}}, [
				section('.w3-section.w3-card-16.w3-col.l12.m12.s12', [
					header('.atestado-form.w3-container.w3-theme-d4.w3-padding', [
						h3('Gerar Atestados')
					]),

					section('.w3-row', {style: {'margin-bottom': '0.5%', 'margin-top': '5em'}}, [
						section('.w3-col.l1.m1.w3-hide-small', [p()]),
						section('.w3-col.l10.m10.s12', [
							section('.atestado-form.w3-section.w3-row', [
								section('.w3-container.w3-col.l6.m6.s12', [
									label('.w3-label', {style: {color: '#000000'}}, 'Nome do Aluno'),
									input('.student-input.w3-input', {props: {type: 'text'}})
								]),

								section('.w3-container.w3-col.l4.m4.s12', [
									label('.w3-label', {style: {color: '#000000'}}, 'Horas'),
									input('.student-hours-input.w3-input', {props: {type: 'text'}})
								]),

								section('.w3-col.l2.m2.s12', [
									button('.student-button.w3-btn.w3-theme-action.w3-large.w3-hover-white', [
										i('.fa.fa-plus')
									])
								]),
							]),

							section('.atestado-form.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Matrícula'),
								input('.student-id-input.w3-input', {props: {type: 'text'}})
							]),

							section('.atestado-form.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Projeto'),
								input('.project-input..w3-input', {props: {type: 'text'}})
							]),

							section('.atestado-form.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Descrição'),
								textarea('.description-input.w3-input', {props: {rows: '6'}})
							]),

							section('.atestado-form.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Local'),
								input('.location-input.w3-input', {props: {type: 'text'}})
							]),

							section('.atestado-form.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Data'),
								input('.date-input.w3-input', {props: {type: 'text'}})
							]),

							section('.atestado-form.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Coordenador'),
								input('.advisor-input.w3-input', {props: {type: 'text'}})
							]),

							section('.atestado-form.w3-center', {style: {'margin-top': '1em', 'margin-bottom': '4em'}}, [
								button('.edit-button.w3-btn.w3-theme-d1.w3-hover-grey.w3-margin.w3-large', [
									i('.fa.fa-edit', {style: {color: '#000000'}}),
									 '  Editar'
								]),

								button('.w3-btn.w3-theme-d1.w3-hover-grey.w3-margin.w3-large', [
									i('.fa.fa-trash', {style: {color: '#000000'}}),
									 '  Excluir'
								]),

								button('.w3-btn.w3-theme-d1.w3-hover-grey.w3-margin.w3-large', [
									i('.fa.fa-file', {style: {color: '#000000'}}),
									 '  Carregar Modelo'
								])
							]),

							section('.atestado-final.w3-section', [
								header('.w3-container.w3-theme-d4', [
									h3('Pré-Visualização')
								]),

								article('.atestado-main', [
									span('.atestado-header', [
										img('.logo-unipampa', {props: {src: './assets/images/logo.png', alt: 'Logo Unipampa'}}),
										p('.atestado-header-info', [
											'Ministério da Educação',
											br(),
											'Fundação Universidade Federal do Pampa',
											br(),
											'Campus Alegrete',
											br(),
											'Programa de Extensão ' + state.project
										])
									]),

									section('.w3-margin.atestado-corpo-section', [
										section('.atestado-titulo.w3-center', {style: {'text-decoration': 'underline'}}, [p('ATESTADO')]),
										section('.atestado-conteudo', [
											p(interpretDescription(state))
										])
									]),

									section('.atestado-data', [
										state.date
									]),

									section('.atestado-assinatura', [
										hr(),
										p([state.advisor, br(), 'Coordenador(a) do(a) ', state.project])
									]),

									section('.atestado-rodape', [
										'UNIPAMPA Campus Alegrete - Avenida Tiaraju, 810 - Bairro Ibirapuitã – CEP: 97546-550',
										br(),
										'Alegrete – RS',
										br(),
										'Fone: (55) 3421 8400'
									])
								])
							])

						]),
						section('.w3-col.l1.m1.w3-hide-small', [p()])
					])
				])
			])
		)
	};
}

let _FormAtestado = function(sources) {
	return view(model(intent(sources)));
};

let FormAtestado = function(sources) {
	return isolate(_FormAtestado)(sources);
};

export default FormAtestado;