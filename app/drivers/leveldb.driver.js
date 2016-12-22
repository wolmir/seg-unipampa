import xs from 'xstream';

const ipc = require('electron').ipcRenderer;

function makeLevelDBDriver() {
	let response$ = xs.create({
		start: function (listener) {
			ipc.on('leveldb-response', function (selector, data) {
				listener.next({selector, data});
			});
		},

		stop: () => {}
	});

	return request$ => {
		request$.addListener({
			next: function(request) {
				if (request.type === 'get') {
					ipc.send('leveldb-get', request.key);
				} else if (request.type === 'put') {
					ipc.send('leveldb-put', request.key, request.value);
				} else {
					console.warn('LevelDB Driver >> Unknown request type "' + request.type + '". This will probably hang...');
				}
			}
		});

		return {
			select: function select(selector) {
				const theChosenOne$ = response$
					.filter(response => response.selector === selector);

				const data$ = theChosenOne$
					.map(response => response.data)
					.filter(value => typeof value !== 'undefined');

				const error$ = theChosenOne$
					.filter(response => response.error)
					.map(response => xs.throw(response.error))
					.flatten();

				return xs.merge(data$, error$);
			}
		};
	};
}


export default makeLevelDBDriver;