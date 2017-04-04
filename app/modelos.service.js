import angular from 'angular';
import _ from 'lodash';

const ipc = require('electron').ipcRenderer;
const uuid = require('uuid/v4');

angular.module('modelosServiceModule', []);

angular
	.module('modelosServiceModule')
	.service('modelosService', modelosService);

function modelosService() {
	var service = {
		getAll: getAll,
		getById: getById,
		salvar: salvar,
		imprimir: imprimir,
		excluir: excluir
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
		});
	}

	function salvar(model) {
		var modelo = angular.copy(model);

		if (!modelo.id) {
			modelo.id = uuid();
		}

		return new Promise(function(resolve, reject) {
			ipc.once('leveldb-response', function (event, selector, response) {
				if (response.error) {
					reject(response.error);
				} else if (selector === 'model-save-' + modelo.id) {
					resolve({
						modeloId: modelo.id
					});
				}
			});

			ipc.send('leveldb-put', 'model-save-' + modelo.id, modelo.id, modelo);
		});
	}

	function imprimir() {
		return new Promise(function(resolve, reject) {
			ipc.once('wrote-pdf', function (event, pdfPath, error) {
				if (error) {
					reject(response.error);
				} else if (pdfPath) {
					resolve({
						filePath: pdfPath
					});
				}
			});

			ipc.send('print-to-pdf');
		});
	}

	function excluir(modelo) {
		return new Promise(function(resolve, reject) {
			ipc.once('leveldb-response', function (event, selector, response) {
				if (response.error) {
					reject(response.error);
				} else if (selector === 'model-delete-' + modelo.id) {
					resolve(response.data);
				}
			});

			ipc.send('leveldb-delete', 'model-delete-' + modelo.id, modelo.id);
		});
	}
}