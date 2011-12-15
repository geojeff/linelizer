Description
===============
**linelizer**, a node.js program, was written as a changelog analyzer for SproutCore, but it is generally useful for any text file with an itemized list. Out-of-the-box, the program pays attention to lines that begin with a number, for release version label lines, or with an asterisk (*) or a dash (-), for item lines. These do not have to be at the very beginning of the line. Item lines are searched for keywords and highlighted according to the color that has been set for theme categories of keywords. Lines which do not begin with either * or - are not processed, and are simply printed to the console unchanged. Release version lines, for example 1.5.3, are printed to the console followed by a line of dashes to produce a markdown style heading.

**linelizer** uses the node.js colors module, which you may install with:

	npm install colors

Preparing Input File
--------------------
Generally, markdown format is assumed. CHANGELOG-SC.md is an example input file from SproutCore.

If the input file is a changelog for a software project, go through the version headings and make sure each one is a simple numeric label. For example, change:

	CHANGELOG for 1.4

to

	1.4

Also, look for blocks of items that do not fall under one of these simple numeric version labels.

You can leave blank lines, text-only labels, the markdown marker lines (e.g., '-----------' or '============'), as these will be skipped.

You can make comments about your fixes with // style comments, e.g.:

	// Added simple numeric version label
	1.4
	CHANGELOG FOR 1.4

Preparing Theme File
--------------------
The theme.js file contains an example for SproutCore, which goes along with the example CHANGELOG-SC.md file. For your project, set the order of the categories, and the order of keywords within each category, which matters for first occurrence searching. The input file is changed to lower case for searching, so use lowercase keywords in theme.js. An exact match will be made for each keyword against separate words on a line, and there will also be a simple search for the keyword within the line. This means that the keyword test will match test, tests, testing, etc., so emphasize short unique keywords. You may also wish to erect a system of functions that process and parse words from API docs, etc.

Use color names allowed by the node.js colors framework.

Running
-------

**linelizer** may be run from the command line, with:

	node linelizer.js CHANGELOG-SC.md 

(where CHANGELOG-SC.md here is the filename of the itemized list text file).

This should print a color-coded version of the changelog to the console. Scroll back in your terminal window as needed.

Search targets can be specified as:

    node linelizer.js --input=CHANGELOG-SC.md --targets='statecharts and routes, testing, docs'

which would match lines fitting at least partially these theme categories (three of them: statecharts and routes, testing, and docs), and would color-code them according to which category has the most keywords per line, using the colors set per theme category in the theme.js file.

Command Line Parameters
-----------------------

*input*: input filename, e.g. --input=CHANGELOG-SC.md

*targets*: search string, e.g. --targets='statecharts and routes, testing'

Contributors
------------

Jeff Pittman (geojeff)

Maurits Lamers (mauritslamers)

Tests
=====
Tests are made in **linelizer** with the Vows testing framework. If you wish to install Vows for running tests, you may do so with:

	npm install vows

Then, you should be able to run all tests with:

    vows tests/*

and individual tests with:

    node tests/searching.js, for example

TODO Items
==========
* Add a command line parameter for controlling sorting, which is not done presently.
* Make the start-of-line markers, presently * and -, a configurable parameter.
* Review the keywords and search system.

