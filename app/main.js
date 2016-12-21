'use strict';
import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {div, section, makeDOMDriver} from '@cycle/dom';
import TopNav from './top-nav.component';
import SideNav from './side-nav.component';
import DataGrid from './data-grid.component';
import View from './view.component';
import FormAtestado from './FormAtestado';
// import HelloWorld from './hello-world.component';

const ipc = require('electron').ipcRenderer;

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
		initial: 'atestados'
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

	const dataGridSources = {
		DOM: sources.DOM,
		columns: dataGridColumns$, 
		data: dataGridData$,
		props: dataGridProp$,
		actions: dataGridActions$
	};

	const viewStateMap$ = xs.fromArray([
		{
			name: '/relatorios',
			component: DataGrid,
			sources: dataGridSources
		},

		{
			name: '/atestados',
			component: FormAtestado,
			sources: sources
		}
	]);

	const viewCurrentState$ = sideNavModel$
		.map(model => model.filter(option => option.active)[0])
		.map(option => option.name)
		.map(name => '/' + name);

	const view = View({
		stateMap: viewStateMap$,
		currentState: viewCurrentState$,
		DOM: sources.DOM,
		print: sources.print
	});

	const viewDom$ = view.DOM;

	const viewPrint$ = view.print;

	return {
		DOM: xs.combine(topNavDom$, sideNavDom$, viewDom$).map(([topNavDom, sideNavDom, viewDom]) =>
			div('#bn-sistema-wrapper', [
				section('.w3-row', [
					topNavDom,
					div('#bn-sistema-conteudo', [
						sideNavDom,
						viewDom
					])
				])
			])
		),

		print: xs.merge(xs.of(false), viewPrint$).filter(x => x)
	};
}

const drivers = {
	DOM: makeDOMDriver('#seg-app'),

	print: print$ => { 
		print$.addListener({next: ev => ipc.send('print-to-pdf')});

		return xs.create({
			start: function (listener) {
				ipc.on('wrote-pdf', function(event, path) {
					listener.next(path);
				})
			},

			stop: function () {}
		});
	}
};

run(main, drivers);