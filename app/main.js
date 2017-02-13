import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {div, section, makeDOMDriver} from '@cycle/dom';

import {makeMsgDriver}       from './drivers/messages.driver';
import printToPdfDriver      from './drivers/print-to-pdf.driver';
import { makeLevelDBDriver } from './drivers/leveldb.driver';

import View          from './view.component';
import TopNav        from './top-nav.component';
import SideNav       from './side-nav.component';
import FormAtestado  from './FormAtestado';
import ListaAtestado from './ListaAtestados';


function main(sources) {
	const mailbox$ = xs.of({}).remember();

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

	const viewStateMap$ = xs.fromArray([
		{
			name: '/relatorios',
			component: ListaAtestado,
			sources: sources
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

	const viewStateFromMailbox$ = sources.mailbox
		.select('formAtestado')
		.map(inbox => inbox.filter(msg => msg.msg === 'EDIT_MODEL'))
		.filter(x => x.length > 0)
		.mapTo('/atestados');

	const view = View({
		stateMap: viewStateMap$,
		currentState: xs.merge(viewStateFromMailbox$, viewCurrentState$),
		DOM: sources.DOM,
		print: sources.print,
		leveldb: sources.leveldb
	});

	const viewDom$ = view.DOM;

	const viewPrint$ = view.print;

	const viewLeveldb$ = view.leveldb;

	const viewMailbox$ = view.mailbox;

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

		print: xs.merge(xs.of(false), viewPrint$).filter(x => x).debug('printDriver ==== '),
		leveldb: viewLeveldb$.debug('levelDriver ==== '),
		mailbox: viewMailbox$.debug('mailboxDriver ==== ')
	};
}

const drivers = {
	DOM: makeDOMDriver('#seg-app'),
	print: printToPdfDriver,
	leveldb: makeLevelDBDriver(),
	mailbox: makeMsgDriver()
};

run(main, drivers);