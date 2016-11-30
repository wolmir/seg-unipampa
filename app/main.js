'use strict';
import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {div, section, ul, li, a, img, br, span, i, nav, header, h5, h3, label, input, table, th, td, tr, thead, tbody, button, footer, makeDOMDriver} from '@cycle/dom';

var viewMenuTopo = function() {
	return div([
				ul('.w3-navbar.w3-theme-d4.w3-card-4.w3-left-align.w3-large', [
					li([
						a('.w3-padding-large.w3-theme-l5', [
							img({
								props: {
									src: './assets/images/logo_trans.png',
									alt: 'Logo Unipampa'
								},
								style: {width: '60px'}
							}, [])
						])
					]),

					li('.w3-center', [
						br(),
						span('.w3-large', {style: {'margin-left': '10px', 'font-style': 'italic'}}, ['Sistema de Extensão Gerenciado'])
					]),

					li('.w3-hide-small.w3-right', [
						a('.w3-padding-large.w3-hover-white', {props: {title: 'Log Out'}}, [
							i('.fa.fa-sign-out.w3-xlarge', {style: {color: '#000000 !important', 'margin-top': '0.3em'}})
						])
					]),

					li('.w3-hide-small.w3-right', [
						a('.w3-padding-large.w3-hover-white', {props: {title: 'Bloquear'}}, [
							i('.fa.fa-expeditedssl.w3-xlarge', {style: {color: '#000000 !important', 'margin-top': '0.3em'}})
						])
					])
				])
			]);
};


function TopNav(sources) {
	const state$ = sources.props.remember();

	const iconActionsDOM$ = state$
		.map(state =>
			const actionDom$$  = state.actions.map(action => {
				const actionProp$ = xs.of(action);
				const actionSources = {DOM: sources.DOM, props: actionProps$};
				return IconAction(actionSources).DOM;
			});

			return xs.combine(actionDom$$)
				.map(actionDoms => actionDoms.map(ad => li('.w3-hide-small.w3-right', [ad])));
		)
		.flatten();

	const vdom$ = state$
		.map(state => 
			div([
				ul('.w3-navbar.w3-theme-d4.w3-card-4.w3-left-align.w3-large', [
					li([
						a('.w3-padding-large.w3-theme-l5', [
							img({
								props: {
									src: state.appIcon.src,
									alt: state.appIcon.alt
								},
								style: {width: state.appIcon.width}
							})
						])
					]),

					li('.w3-center', [
						br(),
						span('.w3-large', {style: {'margin-left': '10px', 'font-style': 'italic'}}, state.appTitle)
					])
				].concat(actions.map()))
			])
		);
}


var viewNav = function() {
	return nav('.w3-sidenav.w3-theme-d1.w3-card-8.w3-large', {style: {width: '20%'}}, [
				header('.w3-container.w3-theme-d4', [
					h5('Menu SEG')
				]),
				div({style: {'margin-top': '2em'}}, [
					a({style: {'cursor': 'pointer'}}, [span('.fa.fa-file-word-o', {style: {color:'#000000', 'margin-bottom': '1em'}}), ' Atestados']),
					a({style: {'cursor': 'pointer'}}, [span('.fa.fa-file-text-o', {style: {color:'#000000', 'margin-bottom': '1em'}}), ' Relatórios'])
				])
			]);
};


var viewInputPesquisa = function() {
	return div('.w3-container.w3-section', {style: {position: 'relative'}}, [
				label('.w3-label', [
					span('.fa.fa-search'),
					' Pesquisar'
				]),
				input('.w3-input', {props: {type: 'text'}})
			]);
};

var viewTable = function() {
	return table('.w3-table.w3-bordered.w3-striped.w3-hoverable', [
				thead([
					tr('.w3-theme-d1', [
						th('Aluno'),
						th('Matrícula'),
						th('Projeto'),
						th('Coordenador'),
						th('Ações')
					])
				]),
				tbody([
					tr([
						td('Juliano'),
						td('1115143068'),
						td('Programa'),
						td('Aline'),
						td([
							button('.w3-btn.w3-red', [i('.fa.fa-trash')]),
							button('.w3-btn.w3-dark-grey.w3-hover-cyan', [i('.fa.fa-edit')])
						]),
					])
				])
			]);
};

function main() {
	return {
		DOM: xs.of(
			div('#bn-sistema-wrapper', [
				section('.w3-row', [
					viewMenuTopo(),
					div('#bn-sistema-conteudo', [
						viewNav(),
						section('.w3-container.w3-row', {style:{'margin-left': '20%'}}, [
							section('.w3-section.w3-card-16.w3-col.l12.m12.s12', [
								header('.w3-container.w3-theme-d4.w3-padding', [
									h3('Lista de Atestados')
								]),
								section('.w3-row', [
									section('.w3-col.l12.m12.s12', [
										viewInputPesquisa(),
										viewTable()
									])
								]),
								footer('.w3-theme-d4.w3-center', [i('.fa.fa-pagelines')])
							])
						])
					])
				])
			])
		)
	};
}

const drivers = {
	DOM: makeDOMDriver('#seg-app')
};

run(main, drivers);