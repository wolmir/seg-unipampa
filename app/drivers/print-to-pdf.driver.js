import xs from 'xstream';

const ipc = require('electron').ipcRenderer;

function printToPdfDriver (print$) { 
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

export default printToPdfDriver;