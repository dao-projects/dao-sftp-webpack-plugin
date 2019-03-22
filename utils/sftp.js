'use strict';

var client = require('scp2');
var waterfall = require('async-waterfall');
var fileUtils = require('./file');
var fs = require('fs');
var colors = require('colors')

exports.sftp = function(port, host, username, password, from, to) {
	client.defaults({
		port: port,
		host: host,
		username: username,
		password: password
	});
	var queue = []
	if (from && Array.isArray(from)) {
		from.forEach(function(f) {
			putQueue(f, to, queue, client);
		})
	} else {
		putQueue(from, to, queue, client);
	}
	queue.push(
		function(callback) {
			client.close()
			callback()
		}
	)
	waterfall(queue, function(err, result) {
		if (err) {
			console.info(err)
		} else {
			if (from && Array.isArray(from)) {
				from.forEach(function(f) {
					console.info("Files ( ".yellow + f + " ) uploaded".yellow)
				})
			} else {
				console.info("Files ( ".yellow + from + " ) uploaded".yellow)
			}
		}
	})


	function putQueue(from, to, queue, client) {
		var stats = fs.statSync(from)
		if (stats.isDirectory()) {
			fileUtils.eachFileSync(from, function(filename, stats) {
				queue.push(
					function(callback) {
						client.upload(filename, to, function(err) {
							// console.log(filename,to)
							callback()
						})
					}
				)
			});
		} else {
			queue.push(
				function(callback) {
					var arr=from && from.split('/');
					if(arr.length>1){
						client.upload(from, to+'/'+arr[arr.length-1], function(err) {
								console.log(from,to)
							callback()
						})
					}else{
						client.upload(from, to, function(err) {
								console.log(from,to)
							callback()
						})
					}

				}
			)
		}
	}

}