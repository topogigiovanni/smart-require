/*global module, asyncTest, test, ok, start, smartRequire, sinon*/
'use strict';
module('Test script API', {
	teardown: function() {
		localStorage.clear();
		smartRequire.fail = false;
		smartRequire.isValidItem = null;
		smartRequire.first = 0;
		smartRequire.second = 0;
	}
});


asyncTest('require() 1 script', 2, function() {
	var cancel = setTimeout(function() {
		ok(false, 'Callback never invoked');
		start();
	}, 2500);

	smartRequire.require({
			url: 'fixtures/jquery.min.js'
		})
		.then(function() {
			clearTimeout(cancel);

			ok(true, 'Callback invoked');
			ok(smartRequire.get('fixtures/jquery.min.js'), 'Data exists in localStorage');

			start();
		});
});


asyncTest('require() 2 scripts with .then()', 3, function() {
	var cancel = setTimeout(function() {
		ok(false, 'Callback never invoked');
		start();
	}, 2500);

	smartRequire.require({
			url: 'fixtures/jquery.min.js'
		}, {
			url: 'fixtures/modernizr.min.js'
		})
		.then(function() {
			clearTimeout(cancel);

			ok(true, 'Callback invoked');
			ok(smartRequire.get('fixtures/jquery.min.js'), 'Data exists in localStorage');
			ok(smartRequire.get('fixtures/modernizr.min.js'), 'Data exists in localStorage');

			start();
		});
});


asyncTest('require() 2 scripts (one non-executed) with .then()', 4, function() {
	var cancel = setTimeout(function() {
		ok(false, 'Callback never invoked');
		start();
	}, 2500);

	smartRequire.require({
			url: 'fixtures/fail-script.js',
			execute: false
		}, {
			url: 'fixtures/modernizr.min.js'
		})
		.then(function() {
			clearTimeout(cancel);

			ok(true, 'Callback invoked');
			ok(smartRequire.get('fixtures/modernizr.min.js'), 'Data exists in localStorage');
			ok(smartRequire.get('fixtures/fail-script.js'), 'Data exists in localStorage');
			ok(smartRequire.fail !== true, 'Script not executed');

			start();
		});
});


asyncTest('require(), custom key', 1, function() {
	var key = +new Date();

	smartRequire
		.require({
			url: 'fixtures/jquery.min.js',
			key: key
		})
		.then(function() {
			ok(smartRequire.get(key), 'Data exists in localStorage under custom key');

			start();
		});
});


asyncTest('require() doesn\'t execute', 1, function() {
	var cancel = setTimeout(function() {
		ok(false, 'Callback never invoked');
		start();
	}, 2500);

	smartRequire.require({
			url: 'fixtures/executefalse.js',
			execute: false
		})
		.then(function() {

			clearTimeout(cancel);

			ok(typeof smartRequire.executed === 'undefined', 'Scipt executed');

			start();
		});
});


asyncTest('require() twice doesn\'t execute on secound', 1, function() {
	var cancel = setTimeout(function() {
		ok(false, 'Callback never invoked');
		start();
	}, 2500);

	smartRequire.require({
			url: 'fixtures/executefalse2.js'
		})
		.then(function() {
			smartRequire.executed2 = undefined;

			smartRequire.require({
					url: 'fixtures/executefalse2.js',
					execute: false
				})
				.then(function() {

					clearTimeout(cancel);

					ok(typeof smartRequire.executed2 === 'undefined', 'Scipt executed');

					start();
				});
		});
});


asyncTest('require() once', 1, function() {
	var cancel = setTimeout(function() {
		ok(false, 'Callback never invoked');
		start();
	}, 2500);

	smartRequire.require({
			url: 'fixtures/once.js',
			once: true
		})
		.then(function() {
			smartRequire.require({
					url: 'fixtures/once.js',
					once: true
				})
				.then(function() {
					clearTimeout(cancel);

					ok(smartRequire.once === 1, 'Script loaded twice');

					start();
				});
		});
});


asyncTest('require() once (force reload)', 1, function() {
	var cancel = setTimeout(function() {
		ok(false, 'Callback never invoked');
		start();
	}, 2500);

	smartRequire.require({
			url: 'fixtures/once2.js',
			once: true
		})
		.then(function() {
			smartRequire.require({
					url: 'fixtures/once2.js'
				})
				.then(function() {
					clearTimeout(cancel);

					ok(smartRequire.once2 === 2, 'Script loaded once');

					start();
				});
		});
});


asyncTest('clear()', 1, function() {
	smartRequire
		.require({
			url: 'fixtures/jquery.min.js'
		})
		.then(function() {
			smartRequire.clear();
			ok(!smartRequire.get('fixtures/jquery.min.js'), 'smartRequire.js data in localStorage cleared');

			start();
		});
});


asyncTest('clear( expired ) - remove only expired keys ', 2, function() {
	smartRequire
		.require({
			url: 'fixtures/largeScript.js',
			key: 'largeScript0',
			expire: -1
		}, {
			url: 'fixtures/largeScript.js',
			key: 'largeScript1'
		}).then(function() {
			smartRequire.clear(true);
			// check if scripts added was removed from localStorage
			ok(!smartRequire.get('largeScript0'), 'Expired script removed');
			ok(smartRequire.get('largeScript1'), 'Non-expired script exists in localstorage');

			start();
		});
});


asyncTest('store data using expiration (non-expired)', 2, function() {
	smartRequire
		.require({
			url: 'fixtures/stamp-script.js',
			expire: 1
		})
		.then(function() {
			var stamp = smartRequire.get('fixtures/stamp-script.js').stamp;
			ok(smartRequire.get('fixtures/stamp-script.js'), 'Data exists in localStorage');

			smartRequire
				.require({
					url: 'fixtures/stamp-script.js'
				})
				.then(function() {
					var stampAfter = smartRequire.get('fixtures/stamp-script.js').stamp;
					ok(stamp === stampAfter, 'Data retrieved from localStorage');

					start();
				});
		});
});


asyncTest('store data using expiration (expired)', 2, function() {
	smartRequire
		.require({
			url: 'fixtures/stamp-script.js',
			expire: -1
		})
		.then(function() {
			var stamp = smartRequire.get('fixtures/stamp-script.js').stamp;
			ok(smartRequire.get('fixtures/stamp-script.js'), 'Data exists in localStorage');

			smartRequire
				.require({
					url: 'fixtures/stamp-script.js'
				})
				.then(function() {
					var stampAfter = smartRequire.get('fixtures/stamp-script.js').stamp;
					ok(stamp !== stampAfter, 'Data retrieved from server');

					start();
				});
		});
});


asyncTest('get()', 2, function() {
	smartRequire
		.require({
			url: 'fixtures/jquery.min.js',
			key: 'jquery'
		})
		.then(function() {
			ok(smartRequire.get('jquery'), 'Data retrieved under custom key');
			ok(!smartRequire.get('anotherkey').stamp, 'No Data retrieved under custom key');

			start();
		});
});


asyncTest('store data using file-versioning (not previous explicit version)', 3, function() {
	smartRequire
		.require({
			url: 'fixtures/stamp-script.js'
		})
		.then(function() {
			var stamp = smartRequire.get('fixtures/stamp-script.js').stamp;
			ok(smartRequire.get('fixtures/stamp-script.js'), 'Data exists in localStorage');

			smartRequire
				.require({
					url: 'fixtures/stamp-script.js',
					unique: 123
				})
				.then(function() {
					var req = smartRequire.get('fixtures/stamp-script.js');
					ok(stamp !== req.stamp, 'Data retrieved from server');
					ok(req.url.indexOf('smartRequire-unique=123') > 0, 'Sending smartRequire unique parameter');

					start();
				});
		});
});


asyncTest('store data using file-versioning (same release)', 2, function() {
	smartRequire
		.require({
			url: 'fixtures/stamp-script.js',
			unique: 123
		})
		.then(function() {
			var stamp = smartRequire.get('fixtures/stamp-script.js').stamp;
			ok(smartRequire.get('fixtures/stamp-script.js'), 'Data exists in localStorage');

			smartRequire
				.require({
					url: 'fixtures/stamp-script.js',
					unique: 123
				})
				.then(function() {
					var stampAfter = smartRequire.get('fixtures/stamp-script.js').stamp;
					ok(stamp === stampAfter, 'Data retrieved from server');

					start();
				});
		});
});


asyncTest('store data using file-versioning (different release)', 3, function() {
	smartRequire
		.require({
			url: 'fixtures/stamp-script.js',
			unique: 123
		})
		.then(function() {
			var stamp = smartRequire.get('fixtures/stamp-script.js').stamp;
			ok(smartRequire.get('fixtures/stamp-script.js'), 'Data exists in localStorage');

			smartRequire
				.require({
					url: 'fixtures/stamp-script.js',
					unique: 456
				})
				.then(function() {
					var req = smartRequire.get('fixtures/stamp-script.js');
					ok(stamp !== req.stamp, 'Data retrieved from server');
					ok(req.url.indexOf('smartRequire-unique=456') > 0, 'Sending smartRequire unique parameter');
					start();
				});
		});
});


asyncTest('remove oldest script in localStorage when Quote Exceeded', 2, function() {
	var i = 0;
	var l = 10;

	(function add() {
		// Try add script in localStorage
		smartRequire
			.require({
				url: 'fixtures/largeScript.js',
				key: 'largeScript' + i
			})
			.then(function() {
				if (i < l) {
					// add one more file
					add(++i);
				} else {
					// check if first script added was removed from localStorage
					ok(!smartRequire.get('largeScript0'), 'First Script deleted');
					// check if the last script added still on localStorage
					ok(smartRequire.get('largeScript10'), 'Last Script still alive');
					start();
				}
			});
	})();
});

/*
asyncTest( 'file is larger than quota limit ', 2, function() {
	smartRequire
		.require({ url: 'fixtures/largeScript.js', key: 'largeScript0' }, { url: 'fixtures/largeScript.js', key: 'largeScript1' })
		.thenRequire({ url: 'fixtures/veryLargeScript.js', key: 'largeScript2' })
		.then(function() {
			// check if scripts added was removed from localStorage
			ok( !smartRequire.get( 'largeScript0' ) , 'First Script deleted' );
			ok( !smartRequire.get( 'largeScript1' ) , 'Second Script deleted' );
			// check if the last script added still on localStorage
			// TODO: Test is now failing in Chrome due to an anomoly,
			// but passes in Safari. Investigate later.
			// ok( !smartRequire.get( 'largeScript2' ) , 'Last Script not added' );
			start();
		});
});*/

asyncTest('non-existant file causes error handler to be called', 2, function() {
	smartRequire
		.require({
			url: 'non-existant.js'
		})
		.then(function() {
			ok(false, 'The success callback should not be called');
			start();
		}, function(error) {
			ok(error, 'Error callback called');
			ok(!smartRequire.get('non-existant.js'), 'No cache entry for missing file');
			start();
		});
});

asyncTest('handle the case where localStorage contains something we did not expect', 2, function() {
	localStorage.setItem('smartRequire-test', 'An invalid JSON string');
	smartRequire
		.require({
			url: 'fixtures/jquery.min.js',
			key: 'test'
		})
		.then(function() {
			start();
			ok(smartRequire.get('test'), 'successfully retrieved the script');
			ok(smartRequire.get('test').key === 'test', 'got a valid cache object');
		});
});

asyncTest('chaining with thenRequire', 3, function() {
	smartRequire.clear();
	smartRequire
		.require({
			url: 'fixtures/first.js',
			key: 'first'
		})
		.thenRequire({
			url: 'fixtures/second.js',
			key: 'second'
		})
		.then(function() {
			start();
			ok(smartRequire.get('first'), 'first script loaded');
			ok(smartRequire.get('second'), 'second script loaded');
			ok(smartRequire.order === 'firstsecond', 'scripts loaded in correct order');
		}, function() {
			start();
			ok(false, 'error handler called unexpectedly');
		});
});

asyncTest('file is fetched from server even if it exists when isValidItem answers no', 2, function() {
	smartRequire
		.require({
			url: 'fixtures/stamp-script.js'
		})
		.then(function() {
			var stamp = smartRequire.get('fixtures/stamp-script.js').stamp;
			ok(smartRequire.get('fixtures/stamp-script.js'), 'Data exists in localStorage');
			smartRequire.isValidItem = function() {
				return false;
			};
			smartRequire
				.require({
					url: 'fixtures/stamp-script.js'
				})
				.then(function() {
					var stampAfter = smartRequire.get('fixtures/stamp-script.js').stamp;
					ok(stamp !== stampAfter, 'Data retrieved from server');

					start();
				});
		});
});

asyncTest('when first file fails, second file is fetched but not executed', 3, function() {
	var server = sinon.fakeServer.create();
	smartRequire.first = smartRequire.second = 0;

	server.respondWith('GET', '/second.js', [200, {
		'Content-Type': 'text/javascript'
	}, 'smartRequire.second = 1;']);

	smartRequire.require({
			url: '/first.js'
		})
		.thenRequire({
			url: '/second.js'
		})
		.then(function() {},
			function() {
				ok(!smartRequire.get('/first.js'), 'first script failed to load');
				ok(smartRequire.get('/second.js'), 'second script was loaded and stored');
				ok(smartRequire.second === 0, 'second script did not execute');

				start();
				server.restore();
			});

	server.respond();
});

asyncTest('second file is fetched early but executes later', 6, function() {
	var server = sinon.fakeServer.create();
	smartRequire.first = smartRequire.second = 0;


	var firstPromise = smartRequire.require({
		url: '/first.js'
	});
	firstPromise.then(function() {
		ok(smartRequire.get('/second.js'), 'second script was already loaded and stored');
		ok(smartRequire.first === 1, 'first script should have been executed');
		ok(smartRequire.second === 0, 'second script should not have been executed yet');
	});

	firstPromise
		.thenRequire({
			url: '/second.js'
		})
		.then(function() {
			ok(smartRequire.first === 1, 'first script is eventually executed');
			ok(smartRequire.second === 2, 'second script is eventually executed second');

			start();
			server.restore();
		});

	ok(server.requests.length === 2, 'Both requests have been made');

	server.requests[1].respond(200, {
		'Content-Type': 'text/javascript'
	}, 'smartRequire.second = smartRequire.first + 1;');

	setTimeout(function() {
		server.requests[0].respond(200, {
			'Content-Type': 'text/javascript'
		}, 'smartRequire.first = 1;');
	}, 50);
});

test('with thenRequire all requests fired immediately', 1, function() {
	var server = sinon.fakeServer.create();

	smartRequire
		.require({
			url: '/first.js'
		})
		.thenRequire({
			url: '/second.js'
		})
		.thenRequire({
			url: '/third.js'
		});

	ok(server.requests.length === 3, 'all requests were fired');

	server.restore();
});

asyncTest('the type of the stored object is the Content-Type of the resource', 4, function() {
	smartRequire.clear();

	var server = sinon.fakeServer.create();

	server.respondWith('GET', '/example.txt', [200, {
		'Content-Type': 'text/plain'
	}, 'Some text']);
	server.respondWith('GET', '/example.js', [200, {
		'Content-Type': 'text/javascript'
	}, 'Some JavaScript']);
	server.respondWith('GET', '/example.xml', [200, {
		'Content-Type': 'application/xml'
	}, '<tag>Some XML</tag>']);
	server.respondWith('GET', '/example.json', [200, {
		'Content-Type': 'application/json'
	}, '["some JSON"]']);

	// Without execute: false, the default handler will try to execute all of
	// these files as JS, leading to Syntax Errors being reported.
	smartRequire.require({
			url: '/example.txt',
			execute: false
		}, {
			url: '/example.js',
			execute: false
		}, {
			url: '/example.xml',
			execute: false
		}, {
			url: '/example.json',
			execute: false
		})
		.then(function() {
			ok(smartRequire.get('/example.txt').type === 'text/plain', 'text file had correct type');
			ok(smartRequire.get('/example.js').type === 'text/javascript', 'javascript file had correct type');
			ok(smartRequire.get('/example.xml').type === 'application/xml', 'xml file had correct type');
			ok(smartRequire.get('/example.json').type === 'application/json', 'json file had correct type');

			start();
			server.restore();
		});

	server.respond();
});

asyncTest('the type of the stored object can be overriden at original require time', 1, function() {
	smartRequire.clear();

	var server = sinon.fakeServer.create();

	server.respondWith('GET', '/example.json', [200, {
		'Content-Type': 'application/json'
	}, '["some JSON"]']);

	smartRequire.require({
			url: '/example.json',
			execute: false,
			type: 'misc/other'
		})
		.then(function() {
			ok(smartRequire.get('/example.json').type === 'misc/other', 'json file had overriden type');

			start();
			server.restore();
		});

	server.respond();
});

asyncTest('different types can be handled separately', 1, function() {
	var text = 'some example text';
	var server = sinon.fakeServer.create();

	smartRequire.clear();
	smartRequire.addHandler('text/plain', function(obj) {
		ok(obj.data === text, 'the text/plain handler was used');
		start();
		server.restore();
		smartRequire.removeHandler('text/plain');
	});

	server.respondWith('GET', '/example.txt', [200, {
		'Content-Type': 'text/plain'
	}, text]);

	smartRequire.require({
		url: '/example.txt'
	});

	server.respond();
});

asyncTest('handlers can be removed', 1, function() {
	var js = '// has to be valid JS to avoid a Syntax Error';
	var handled = 0;
	var server = sinon.fakeServer.create();

	smartRequire.clear();
	smartRequire.addHandler('text/plain', function() {
		handled++;
		smartRequire.removeHandler('text/plain');
	});

	server.respondWith('GET', '/example.js', [200, {
		'Content-Type': 'text/plain'
	}, js]);
	server.respondWith('GET', '/example2.js', [200, {
		'Content-Type': 'text/plain'
	}, js]);

	smartRequire.require({
			url: '/example.js'
		})
		.thenRequire({
			url: '/example2.js'
		})
		.then(function() {
			ok(handled === 1, 'the text/plain handler was only used once');
			start();
			server.restore();
		});

	server.respond();
});

asyncTest('the same resource can be handled differently', 2, function() {
	var server = sinon.fakeServer.create();

	smartRequire.clear();

	smartRequire.addHandler('first', function() {
		ok(true, 'first handler was called');
	});

	smartRequire.addHandler('second', function() {
		ok(true, 'second handler was called');
		start();
		server.restore();
	});

	server.respondWith('GET', '/example.txt', [200, {
		'Content-Type': 'text/plain'
	}, '']);

	smartRequire.require({
			url: '/example.txt',
			type: 'first'
		})
		.thenRequire({
			url: '/example.txt',
			type: 'second'
		});

	server.respond();
});

asyncTest('type falls back to Content-Type, even if previously overriden', 2, function() {
	var server = sinon.fakeServer.create();

	smartRequire.clear();

	smartRequire.addHandler('first', function() {
		ok(true, 'first handler was called');
	});

	smartRequire.addHandler('text/plain', function() {
		ok(true, 'text/plain handler was called');
		start();
		server.restore();
	});

	server.respondWith('GET', '/example.txt', [200, {
		'Content-Type': 'text/plain'
	}, '']);

	smartRequire.require({
			url: '/example.txt',
			type: 'first'
		})
		.thenRequire({
			url: '/example.txt'
		});

	server.respond();
});

// This test is here to cover the full set of possibilities for this section
// It doesn't really test anything that hasn't been tested elsewhere
asyncTest('with live: false, we fallback to the network', 1, function() {
	smartRequire.clear();
	var server = sinon.fakeServer.create();
	server.respondWith('GET', '/example.txt', [200, {
		'Content-Type': 'text/plain'
	}, 'foo']);

	smartRequire.require({
			url: '/example.txt',
			execute: false,
			live: false
		})
		.then(function() {
			ok(smartRequire.get('/example.txt').data === 'foo', 'nothing in the cache so we fetched from the network');
			server.restore();
			start();
		});

	server.respond();
});

asyncTest('with live: false, we attempt to fetch from the cache first', 1, function() {
	smartRequire.clear();
	var server = sinon.fakeServer.create();
	server.respondWith('GET', '/example.txt', [200, {
		'Content-Type': 'text/plain'
	}, 'bar']);

	// Add the item directly to the cache
	localStorage.setItem('smartRequire-/example.txt', JSON.stringify({
		url: '/example.txt',
		key: '/example.txt',
		data: 'foo',
		originalType: 'text/plain',
		type: 'text/plain',
		stamp: +new Date(),
		expire: +new Date() + 5000 * 60 * 60 * 1000
	}));

	smartRequire.require({
			url: '/example.txt',
			execute: false,
			live: false
		})
		.then(function() {
			ok(smartRequire.get('/example.txt').data === 'foo', 'fetched from the cache rather than getting fresh data from the network');
			server.restore();
			start();
		});


	server.respond();
});

asyncTest('with live: true, we attempt to fetch from the network first', 1, function() {
	smartRequire.clear();
	var server = sinon.fakeServer.create();
	server.respondWith('GET', '/example.txt', [200, {
		'Content-Type': 'text/plain'
	}, 'bar']);

	// Add the item directly to the cache
	localStorage.setItem('smartRequire-/example.txt', JSON.stringify({
		url: '/example.txt',
		key: '/example.txt',
		data: 'foo',
		originalType: 'text/plain',
		type: 'text/plain',
		stamp: +new Date(),
		expire: +new Date() + 5000 * 60 * 60 * 1000
	}));

	smartRequire.require({
			url: '/example.txt',
			execute: false,
			live: true
		})
		.then(function() {
			ok(smartRequire.get('/example.txt').data === 'bar', 'fetched from the network even though cache was available');
			server.restore();
			start();
		});

	server.respond();
});

asyncTest('with live: true, we still store the result in the cache', 1, function() {
	smartRequire.clear();
	var server = sinon.fakeServer.create();
	server.respondWith('GET', '/example.txt', [200, {
		'Content-Type': 'text/plain'
	}, 'foo']);

	smartRequire.require({
			url: '/example.txt',
			execute: false,
			live: true
		})
		.then(function() {
			ok(smartRequire.get('/example.txt'), 'result stored in the cache');
			server.restore();
			start();
		});

	server.respond();
});

asyncTest('with live: true, we fallback to the cache', 2, function() {
	// TODO: How to test the navigator.onLine case?
	smartRequire.clear();
	var server = sinon.fakeServer.create();
	var clock = sinon.useFakeTimers();
	server.respondWith('GET', '/example.txt', [200, {
		'Content-Type': 'text/plain'
	}, 'baz']);

	// Add the item directly to the cache
	localStorage.setItem('smartRequire-/example.txt', JSON.stringify({
		url: '/example.txt',
		key: '/example.txt',
		data: '12345',
		originalType: 'text/plain',
		type: 'text/plain',
		stamp: +new Date(),
		expire: +new Date() + 5000 * 60 * 60 * 1000
	}));

	ok(smartRequire.get('/example.txt'), 'already exists in cache');

	smartRequire.timeout = 100;
	smartRequire.require({
			url: '/example.txt',
			execute: false,
			live: true
		})
		.then(function() {
			ok(smartRequire.get('/example.txt').data === '12345', 'server timed out, so fetched from cache');
			server.restore();
			clock.restore();
			start();
		}, function() {
			ok(false, 'the require failed due to lack of network, but should have used the cache');
			server.restore();
			clock.restore();
			start();
		});

	clock.tick(6000);
	server.respond();
	smartRequire.timeout = 5000;
});

asyncTest('with skipCache: true, we do not cache data', 1, function() {
	smartRequire
		.require({
			url: 'fixtures/jquery.min.js',
			skipCache: true
		})
		.then(function() {
			ok(!smartRequire.get('fixtures/jquery.min.js'), 'Data does not exist in localStorage');

			start();
		});
});

asyncTest('execute a cached script when execute: true', 2, function() {
	var cancel = setTimeout(function() {
		ok(false, 'Callback never invoked');
		start();
	}, 2500);

	function requireScript(execute, cb) {
		smartRequire.require({
				url: 'fixtures/executefalse.js',
				execute: execute
			})
			.then(cb);
	}

	requireScript(false, function() {
		clearTimeout(cancel);

		ok(typeof smartRequire.executed === 'undefined', 'None-cached script was not executed');

		requireScript(true, function() {
			ok(smartRequire.executed === true, 'Cached script executed');

			start();
		});
	});
});
