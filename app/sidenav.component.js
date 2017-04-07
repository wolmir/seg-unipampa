'use strict';

import angular from 'angular';

require('./sidenav.service');

angular
	.module('sidenavComponentModule', ['sidenavServiceModule'])
	.component('sidenav', {
		templateUrl: require('file-loader?name=sidenav.component.html!./sidenav.component.html'),
		controller: sidenavController,
		controllerAs: 'sideVm',

		bindings: {
			titulo: '@'
		}
	});

sidenavController.$inject = ['sidenavService', '$timeout'];

function sidenavController(sidenavService, $timeout) {
	var sideVm = this;

	sideVm.opcoes = [];

	sideVm.escolher = sidenavService.escolher;

	init();

	function init() {
		$timeout(function() {
			sideVm.opcoes = sidenavService.getOpcoes();
		});

		sidenavService.onAddOpcao(function (opcao) {
			$timeout(function() {
				sideVm.opcoes = sidenavService.getOpcoes();
			});
		});

		sidenavService.onEscolha(function () {
			$timeout(function() {
				sideVm.opcoes = sidenavService.getOpcoes();
			});
		});
	}

	// function escolher(opcao) {
		// sideVm.opcoes.forEach(function (op) {
		// 	op.ativa = false;
		// });

	// 	opcao.ativa = true;

	// 	sidenavService.escolher(opcao);
	// }
}