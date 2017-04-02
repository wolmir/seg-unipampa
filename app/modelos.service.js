import angular from 'angular';

const ipc = require('electron').ipcRenderer;

angular.module('modelosServiceModule', []);

angular
	.module('modelosServiceModule')
	.service('modelosService', modelosService);

function modelosService() {
	var service = {
		getAll: getAll,
		getById: getById
	};

	return service;

	function getAll() {
		return new Promise(function(resolve, reject) {
			ipc.once('leveldb-response', function (event, selector, response) {
				if (response.error) {
					reject(response.error);
				} else if (selector === 'list-request') {
					resolve(response.data);
				}
			});

			ipc.send('leveldb-keys', 'list-request');
		})
		.then(function(keys) {
			return Promise.all(keys.map(function (key) {
				return getById(key);
			}));
		});
	}

	function getById(id) {
		return new Promise(function(resolve, reject) {
			ipc.on('leveldb-response', function (event, selector, response) {
				if (response.error) {
					reject(response.error);
				} else if (selector === 'model-request-' + id) {
					resolve(response.data);
				}
			});

			ipc.send('leveldb-get', 'model-request-' + id, id);
		})
		.then(Modelo);
	}

	function Modelo(dados) {
		return {
			nome: dados.input_model_name,
			projeto: dados.input_project
		};
	}
}