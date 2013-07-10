#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

*/

var util = require('util');
var fs = require('fs');
var rest = require('restler');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://www.google.com";



var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)){
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1);
    }
    return instr;
};


var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var cheerioHtml = function(html) {
    return cheerio.load(html);
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks =loadChecks(checksfile).sort();
    var out ={};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] =present;
    }
    return out;
};

var checkHtml = function(html, checksfile) {
    $ = cheerioHtml(html);
    var checks =loadChecks(checksfile).sort();
    var out ={};
    for(var ii in checks) {
	var presnet = $(checks[ii]).length > 0;
	out[checks[ii]] =present;
    }
    return out;
};


var clone = function(fn) {
    return fn.bind({});
};


if(require.main == module) {
    var checkJson = null;
    var outJson = null;
    program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'PAth to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <URL>', 'The URL to check', URL_DEFAULT)
	.parse(process.argv);


    if (program.file) {
	checkJson = checkHtmlFile(program.file,program.checks);
	outJson = JSON.stringify(checkJson, null, 4);
    } else if (program.url) {
	rest.get(program.url).on('complete',function(result,response) {
	    if (result instanceof Error) {
		console.log('Error: ' + util.format(response.message));
	    } else {
		checkJson = checkHtml(result,program.checks);
		outJson = JSON.stringify(checkJson, null, 4);
	    }
	});
    }
    console.log(outJson);

} else {
    exports.checkHtmlFile = checkHtmlFile;
}
