'use strict';

angular
	.module('sidenavServiceModule', [])
	.service('sidenavService', sidenavService);

function sidenavService() {
	var service = {
		onAddOpcao: onAddOpcao,
		addOpcao: addOpcao,
		escolher: escolher,
		onEscolha: onEscolha,
		getOpcoes: getOpcoes
	};

	var navs = [];
	var listeners = [];
	var opcoes = [];

	return service;

	function onAddOpcao(callback) {
		navs.push(callback);
	}

	function addOpcao(opcao) {
		opcoes.push(opcao);

		navs.forEach(function (nav) {
			nav(opcao);
		});
	}

	function onEscolha(callback) {
		listeners.push(callback);
	}

	function escolher(opcao, parametros) {
		var op = opcoes.find(function (op) {
			return op.nome === opcao.nome;
		});

		if (angular.isUndefined(op)) {
			throw new Error('Opcao nula');
		}

		opcoes.forEach(function (op) {
			op.ativa = false;
		});

		op.ativa = true;
		
		listeners.forEach(function(cb) {
			cb(opcao, parametros);
		});
	}

	function getOpcoes() {
		return opcoes;
	}
}