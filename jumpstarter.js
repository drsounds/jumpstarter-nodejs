/*************
 * Helper library for node.js to deal with the Jumpstarter.io app environment
 * Copyright (C) 2014 Alexander Forselius <alex@artistconnector.com>
 * License: MIT 
 */

var fs = require('fs');

/***
 * Class wrapper for Jumpstarter
 * @constructor
 * @param {String} path Your development path 
 */
var Jumpstarter = function (path) {
	this.devPath = path;
	this.productionRoot = '/app';
};

Jumpstarter.prototype = {
	/**
	 * Checks if you are in production 
	 */
	isProduction: function (callback) {
		return fs.exists(this.productionRoot, callback);
	},
	
	/**
	 * Checks if you are in production 
	 */
	isProductionSync: function () {
		return fs.existsSync(this.productionRoot);
	},
	
	/**
	 * 
 	 * @param {String} development_path
	 */
	getBaseDirectory: function () {
		var self = this;
		this.isProduction(function (isProduction) {
			return isProduction ? self.productionRoot : self.devPath; 
		});
	},
	
	/**
	 * 
 	 * @param {String} development_path
	 */
	getBaseDirectorySync: function () {
		return this.isProductionSync() ? this.productionRoot : self.devPath; 
	},
	
	/***
	 * Gets the writable (state directory) 
	 */
	getStateDirectorySync: function () {
		return this.getBaseDirectorySync() + '/state';
	},
	
	/***
	 * Gets the writable (state directory) 
	 */
	getStateDirectory: function (callback) {
		return this.getBaseDirectory(function (dir) {
			callback(dir + '/state');
		});
	},
	
	/***
	 * Load files, path base at /app
	 * @param {String} path The path to load from
	 */
	loadFile: function (path, cb) {
		return fs.readFile(this.getBaseDirectory() + path, function (err, data) {
			cb(data);
		});
	},
	
	/***
	 * Load files, path base at /app
	 * @param {String} path The path to load from
	 */
	loadFileSync: function (path) {
		return fs.readFileSync(this.getBaseDirectory() + path, 'utf8');
	},
	
	/**
	 * Save file to disk 
	 * @param {Object} file
	 */
	saveFile: function (path, data, cb) {
		fs.writeFile(this.getStateDirectory() + path, data, cb);	
	},
	
	/**
	 * Save file to disk 
	 * @param {Object} file
	 */
	saveFileSync: function (path, data) {
		return fs.writeFile(this.getStateDirectory() + path, data);	
	},
	
	/**
	 * Load environment json and returns it as a json object
	 * @param {Object} callback
	 */
	
	loadEnvJSON: function (callback) {
		fs.readFile(this.getBaseDirectory() + '/env.json', function (err, data) {
			var json = JSON.parse(data);
			callback(data);
		});
	},
	
	/**
	 * Load environment json and returns it as a json object
	 * @param {Object} callback
	 */
	
	loadEnvJSONSync: function () {
		var str = fs.readFileSync(this.getBaseDirectory() + '/env.json');
		var data = JSON.parse(str);
		return data;
	},
	
	loadAppSettings: function (callback) {
		this.loadEnvJSON(function (json) {
			return json['settings']['app'];
		})
	},
	
	loadAppSettingsSync: function (callback) {
		var data = this.loadEnvJSONSync();
		return data['settings']['app'];
	},
	
	
};

exports = Jumpstarter;
