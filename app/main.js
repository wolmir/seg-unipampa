import angular from 'angular';
import moment from 'moment';

require('./modelos.service');
require('./sidenav.component');

angular.module('segUnipampa', ['modelosServiceModule', 'sidenavServiceModule', 'sidenavComponentModule']);

angular
	.module('segUnipampa')
	.controller('listaCtrl', listaCtrl);

listaCtrl.$inject = ['$rootScope', 'modelosService', '$timeout', 'sidenavService'];

function listaCtrl($rootScope, modelosService, $timeout, sidenavService) {
	var meses = [
		"Janeiro",
		"Fevereiro",
		"Março",
		"Abril",
		"Maio",
		"Junho",
		"Julho",
		"Agosto",
		"Setembro",
		"Outubro",
		"Novembro",
		"Dezembro"
	];

	var vm = this;

	vm.modelos = [];
	vm.atestados = [];
	vm.sucessoModal = {display: 'none'};
	vm.exclusaoModal = {display: 'none'};
	vm.state = 'lista';

	vm.aluno = {
		nome: '',
		horas: 0
	};

	vm.modelo = {
		nome: '',
		alunos: [],
		projeto: '',
		descricao: '',
		local: '',
		data: null,
		orientador: ''
	};

	vm.opcaoForm = {
		nome: 'Atestados',
		icone: 'fa fa-file-word-o',
		ativa: false,
		estado: 'form'
	};

	vm.opcaoLista = {
		nome: 'Lista',
		icone: 'fa fa-file-text-o',
		ativa: true,
		estado: 'lista'
	};

	vm.addAluno = addAluno;
	vm.removerAluno = removerAluno;
	vm.salvar = salvar;
	vm.dispensarModal = dispensarModal;
	vm.imprimir = imprimir;
	vm.abrirForm = abrirForm;
	vm.abrirLista = abrirLista;
	vm.editar = editar;
	vm.excluir = excluir;

	init();

	function init() {
		sidenavService.onEscolha(function (opcao, parametros) {
			if (opcao.estado === 'lista') {
				vm.abrirLista();
			} else {
				vm.abrirForm(parametros);
			}
		});

		sidenavService.addOpcao(vm.opcaoForm);

		sidenavService.addOpcao(vm.opcaoLista);

		$rootScope.$watch(function () { return vm.modelo; }, regenerarAtestados, true);

		carregarModelos();
	}

	function carregarModelos() {
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

	function addAluno() {
		vm.modelo.alunos.push({
			nome: vm.aluno.nome,
			horas: vm.aluno.horas
		});

		vm.aluno.nome = '';
		vm.aluno.horas = '';
	}

	function removerAluno(aluno) {
		vm.modelo.alunos = vm.modelo.alunos.filter(function (alunoi) {
			return alunoi !== aluno;
		});
	}

	function regenerarAtestados() {
		if (vm.modelo) {
			vm.atestados = vm.modelo.alunos.map(gerarAtestado);
		}
	}

	function gerarAtestado(aluno) {
		return angular.extend({}, vm.modelo, {
			descricao: interpretarDescricao(vm.modelo, aluno),
			data: interpretarData(vm.modelo)
		});
	}

	function interpretarDescricao(modelo, aluno) {
		return modelo.descricao
			.replace('{{aluno}}', aluno.nome)
			.replace('{{horas}}', aluno.horas)
			.replace('{{projeto}}', modelo.projeto);
	}

	function interpretarData(modelo) {
		var dataMoment = moment(modelo.data);
		var dia = dataMoment.format('DD');
		var mes = meses[parseInt(dataMoment.format('M')) - 1];
		var ano = dataMoment.format('YYYY');

		return modelo.local + ', ' + dia + ' de ' + mes + ' de ' + ano;
	}

	function salvar() {
		modelosService.salvar(angular.copy(vm.modelo))
			.then(function(resposta) {
				vm.modelo.id = resposta.modeloId;

				$timeout(function () {
					vm.sucessoModal.display = 'block';
				});
			});
	}

	function dispensarModal() {
		vm.sucessoModal.display = 'none';
		vm.exclusaoModal.display = 'none';
	}

	function imprimir() {
		modelosService.imprimir()
			.then(console.log);
	}

	function abrirForm(modelo) {
		vm.modelo = {
			nome: '',
			alunos: [],
			projeto: '',
			descricao: '',
			local: '',
			data: null,
			orientador: ''
		};

		if (modelo) {
			vm.modelo = angular.extend({}, modelo, {
				data: new Date(modelo.data)
			});
		}

		vm.state = 'form';

		vm.atestados = [];
	}

	function abrirLista() {
		vm.state = 'lista';
		vm.modelo = null;
		vm.atestados = null;

		carregarModelos();
	}

	function editar(modelo) {
		sidenavService.escolher(vm.opcaoForm, modelo);
	}

	function excluir(modelo) {
		modelosService.excluir(modelo)
			.then(mostrarModalExclusao)
			.then(carregarModelos);
	}

	function mostrarModalExclusao() {
		$timeout(function () {
			vm.exclusaoModal.display = 'block';
		});
	}
}