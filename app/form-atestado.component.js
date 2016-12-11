/* jshint node:true */
'use strict';
import xs from 'xstream';
import {section, header, h3, p, label, input, textarea, button, i, article, span, img, br} from '@cycle/dom';
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
	const studentAction$     = iToA('.student-input')('STUDENT_NAME');
	const advisorAction$     = iToA('.advisor-input')('ADVISOR');
	const projectAction$     = iToA('.project-input')('PROJECT');
	const locationAction$    = iToA('.location-input')('LOCATION');
	const studentIdAction$   = iToA('.student-id-input')('STUDENT_ID');

	return {
		DOM: sources.DOM,
		actions: xs.merge(
			dateAction$,
			studentAction$,
			advisorAction$,
			projectAction$,
			locationAction$,
			studentIdAction$,
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
					header('.w3-container.w3-theme-d4.w3-padding', [
						h3('Gerar Atestados')
					]),

					section('.w3-row', {style: {'margin-bottom': '0.5%', 'margin-top': '5em'}}, [
						section('.w3-col.l1.m1.w3-hide-small', [p()]),
						section('.w3-col.l10.m10.s12', [
							section('.w3-section', [
								label('.w3-label', {style: {color: '#000000'}}, 'Nome do Aluno'),
								input('.student-input.w3-input', {props: {type: 'text'}})
							]),

							section('.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Matrícula'),
								input('.student-id-input.w3-input', {props: {type: 'text'}})
							]),

							section('.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Projeto'),
								input('.project-input..w3-input', {props: {type: 'text'}})
							]),

							section('.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Descrição'),
								textarea('.description-input.w3-input', {props: {rows: '6'}})
							]),

							section('.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Local'),
								input('.location-input.w3-input', {props: {type: 'text'}})
							]),

							section('.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Data'),
								input('.date-input.w3-input', {props: {type: 'text'}})
							]),

							section('.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Coordenador'),
								input('.advisor-input.w3-input', {props: {type: 'text'}})
							]),

							section('.w3-center', {style: {'margin-top': '1em', 'margin-bottom': '4em'}}, [
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

							section('.w3-section', [
								header('.w3-container.w3-theme-d4', [
									h3('Pré-Visualização')
								]),

								article([
									span([
										img({props: {src: './assets/images/logo.png', alt: 'Logo Unipampa'}}),
										p({style: {'margin-top': '-7em', 'margin-left': '20em', 'font-size': '0.8em', 'text-align': 'justify'}}, [
											'MINISTÉRIO DA EDUCAÇÃO',
											br(),
											'FUNDAÇÃO UNIVERSIDADE FEDERAL DO PAMPA',
											br(),
											'CAMPUS ALEGRETE/RS',
											br(),
											state.project
										])
									]),

									section('.w3-center.w3-margin.atestado-corpo-section', [
										h3('ATESTADO'),
										p(interpretDescription(state))
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