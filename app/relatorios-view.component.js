'use strict';
import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {
	div, 
	section, 
	a, 
	span, 
	i, 
	nav, 
	header, 
	h5, 
	h3, 
	label, 
	input, 
	table, 
	th, 
	td, 
	tr, 
	thead, 
	tbody, 
	button, 
	footer, 
	makeDOMDriver
} from '@cycle/dom';

import DataGrid from './data-grid.component';

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
		title: 'SEG Menu',
		initial: 'relatorios'
	});

	const sideNavOption$ = xs.of([
		{
			icon: 'fa-file-word-o',
			label: 'Atestados',
			name: 'atestados'
		},

		{
			icon: 'fa-file-text-o',
			label: 'Relatórios',
			name: 'relatorios'
		}
	]);

	const sideNav = SideNav({DOM: sources.DOM, props: sideNavProp$, options: sideNavOption$});
	const sideNavDom$ = sideNav.DOM;
	const sideNavModel$ = sideNav.model;

	const dataGridProp$    = xs.of({title: 'Lista de Atestados'});

	const dataGridColumns$ = xs.of([
		{ label: 'Nome', name: 'nome' }, 
		{ label: 'Matrícula', name: 'matricula' },
		{ label: 'Projeto', name: 'projeto' },
		{ label: 'Coordenador(a)', name: 'coordenador' }
	]);

	const dataGridData$ = xs.fromArray([
		{
			nome: 'Aluno X',
			matricula: '101678743',
			projeto: 'Gambis da Magia',
			coordenador: 'Stephen Strange'
		}
	]);

	const dataGridActions$ = xs.of([
		{icon: 'fa-trash', color: 'w3-red'},
		{icon: 'fa-edit', color: 'w3-dark-grey'}
	]);

	const dataGrid = DataGrid({
		DOM: sources.DOM,
		columns: dataGridColumns$, 
		data: dataGridData$,
		props: dataGridProp$,
		actions: dataGridActions$
	});

	const dataGridDom$ = dataGrid.DOM;

	return {
		DOM: xs.combine(topNavDom$, sideNavDom$, dataGridDom$).map(([topNavDom, sideNavDom, dataGridDom]) =>
			div('#bn-sistema-wrapper', [
				section('.w3-row', [
					topNavDom,
					div('#bn-sistema-conteudo', [
						sideNavDom,
						dataGridDom
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