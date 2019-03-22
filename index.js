'use strict'
var fs = require('fs')
var colors = require('colors')
var fileUtils = require('./utils/file')
var client = require('./utils/sftp')

function SftpWebpackPlugin(options) {
	if (!options || !options.port || !options.host || !options.username || !options.password || !options.from || !options.to) {
		console.info('Some parameters of the problem，please set as the follow:')
		console.info(" new".red + " SftpWebpackPlugin({");
		console.info("   port:'your port',".yellow);
		console.info("   host: 'your host',".yellow);
		console.info("   username: 'your username',".yellow);
		console.info("   password: 'your password',".yellow);
		console.info("   from: 'you neeed upload file path',".yellow);
		console.info("   to: 'you want to destination',".yellow);
		console.info(" })");
		throw new Error('Some parameters of the problem')
	}
	this.fileArray = [];
	this.options = options;
}

SftpWebpackPlugin.prototype.apply = function(compiler) {
	var _this = this;
	compiler.plugin("done", function(compilation) {
		_this.sftp();
	});
};

SftpWebpackPlugin.prototype.sftp = function() {
	client.sftp(this.options.port, this.options.host, this.options.username, this.options.password, this.options.from, this.options.to)
}

module.exports = SftpWebpackPlugin;