var xs = require('xstream').default;

describe('stuff', () => {
	it('should happen', (done) => {
		var stream = xs.merge(
			xs.periodic(1000).mapTo('a').take(1)
		).debug('s1 > ');

		var stream2 = stream
			// .debug()
			.fold((acc, char) => acc + char, '').debug('s2 > ');

		var stream3 = stream2
			.debug('s3 > ')
			.map(s => s.length);
			// .map(s => {
			// 	if (s > 0) {
			// 		throw 'f';
			// 	}
			// 	return s;
			// });

		var stream4 = stream2
			.debug('s4 > ')
			.filter(s => s === 'a');

		stream3.addListener({
			next: data => {
				console.log('data3', data);
				if (data === 10) {
					done();
				}
			}
		});

		stream4.addListener({
			next: data => {
				console.log('data4', data);
			}
		});
	});
});