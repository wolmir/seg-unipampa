import angular from 'angular';

require('./modelos.service');

angular.module('segUnipampa', ['modelosServiceModule']);

angular
	.module('segUnipampa')
	.controller('listaCtrl', listaCtrl);

listaCtrl.$inject = ['modelosService', '$timeout'];

function listaCtrl(modelosService, $timeout) {
	var vm = this;

	vm.modelos = [];

	vm.gambi = 0;

	vm.increaseGambi = function() { vm.gambi += 1};

	init();

	function init() {
		modelosService.getAll()
			.then(function (modelos) {
				// Gambi necessária para usar AngularJS com Electron
				$timeout(function () {
					vm.modelos = modelos;
				});
			})
			.catch(function (err) {
				console.error(err);
			});
	}
}