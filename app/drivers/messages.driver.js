import xs from 'xstream';

const ipc = require('electron').ipcRenderer;

function makeMsgDriver() {
	let response$ = xs.create({
		start: function (listener) {
			ipc.on('message-ping', function (event, selector, data) {
				console.log('%cmessage response', "color:#ff9900;font-size:14px;");
				listener.next({selector, data});
			});
		},

		stop: () => {}
	});

	return request$ => {
		request$.addListener({
			next: function(msg) {
				ipc.send('new-message', msg.to, msg);
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

				return xs.merge(data$, error$)
				.map(stuff => {
					console.log("%cthe stuff", "color:#ff9900;font-size:14px");
					return stuff;
				});
			}
		};
	};
}

export { makeMsgDriver};