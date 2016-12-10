'use strict';
import xs from 'xstream';
import {section, header, h3, p, label, input, textarea, button, i, article} from '@cycle/dom';
import isolate from '@cycle/isolate';

function intent(sources) {
	return sources;
}

function model(sources) {
	return sources;
}

function view(sources) {
	return {
		DOM: xs.of(
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
								input('.w3-input', {props: {type: 'text'}})
							]),

							section('.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Matrícula'),
								input('.w3-input', {props: {type: 'text'}})
							]),

							section('.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Projeto'),
								input('.w3-input', {props: {type: 'text'}})
							]),

							section('.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Descrição'),
								textarea('.w3-input', {props: {rows: '6'}})
							]),

							section('.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Local'),
								input('.w3-input', {props: {type: 'text'}})
							]),

							section('.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Data'),
								input('.w3-input', {props: {type: 'text'}})
							]),

							section('.w3-section.atestado-form-input-section', {style: {color: '#000000'}}, [
								label('.w3-label', {style: {color: '#000000'}}, 'Coordenador'),
								input('.w3-input', {props: {type: 'text'}})
							]),

							section('.w3-center', {style: {'margin-top': '1em', 'margin-bottom': '4em'}}, [
								button('.w3-btn.w3-theme-d1.w3-hover-grey.w3-margin.w3-large', [
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