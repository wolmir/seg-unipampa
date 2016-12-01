'use strict';
import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {div, section, a, span, i, nav, header, h5, h3, label, input, table, th, td, tr, thead, tbody, button, footer, makeDOMDriver} from '@cycle/dom';
import TopNav from './top-nav.component';
import SideNav from './side-nav.component';


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

function main(sources) {
	const topNavProp$ = xs.of({
		appIcon: {
			src: './assets/images/logo_trans.png',
			alt: 'Logo Unipampa',
			width: '60px'
		},
		appTitle: 'Sistema de Extensão Gerenciado'
	});

	const topNavActions$ = xs.of([]);

	const topNav = TopNav({DOM: sources.DOM, props: topNavProp$, actions: topNavActions$});
	const topNavDom$ = topNav.DOM;

	const sideNavProp$ = xs.of({
		title: 'SEG Menu'
	});

	const sideNavOption$ = xs.of([
		{
			icon: 'fa-file-word-o',
			label: 'Atestados'
		},

		{
			icon: 'fa-file-text-o',
			label: 'Relatórios'
		}
	]);

	const sideNav = SideNav({DOM: sources.DOM, props: sideNavProp$, options: sideNavOption$});
	const sideNavDom$ = sideNav.DOM;

	return {
		DOM: xs.combine(topNavDom$, sideNavDom$).map(([topNavDom, sideNavDom]) =>
			div('#bn-sistema-wrapper', [
				section('.w3-row', [
					topNavDom,
					// viewMenuTopo(),
					div('#bn-sistema-conteudo', [
						// viewNav(),
						sideNavDom,
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