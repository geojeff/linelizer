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
The theme.js file contains an example for SproutCore, which goes along with the example CHANGELOG-SC.md file. For your project, set the order of the categories, and the order of keywords within each category, which matters for first occurrence searching. The input file is changed to lower case for searching, so use lowercase keywords in theme.js.

Running
-------

**linelizer** may be run from the command line, with:

	node linelizer.js CHANGELOG-SC.md 

(where CHANGELOG-SC.md here is the filename of the itemized list text file).

This should print a color-coded version of the changelog to the console. Scroll back in your terminal window as needed.

If you would like to search for one or more theme categories, you may run as:

	node linelizer.js CHANGELOG-SC.md --targets=blue,red,cyan

or, with the filename also as a parameter, with:

	node linelizer.js --input=CHANGELOG-SC.md --targets=blue,red,cyan

A single theme category can be targeted with:

	node linelizer.js --input=CHANGELOG-SC.md --targets=red

Command Line Parameters
-----------------------

*input*: input filename, e.g. --input=CHANGELOG-SC.md

*targets*: search string, e.g. --targets=red,blue

*search*: search method, e.g. --search=exhaustive

Contributors
------------

Jeff Pittman (geojeff)

Maurits Lamers (mauritslamers)

Tests
=====
Tests are made in **linelizer** with the Vows testing framework. If you wish to install Vows for running tests, you may do so with:

	npm install vows

TODO Items
==========
* Add a command line parameter for controlling sorting, which is not done presently.
* Make the start-of-line markers, presently * and -, a configurable parameter.
* Consider using theme category names instead of color names in search targets parameter.![]()

