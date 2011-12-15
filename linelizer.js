var fs = require('fs');
var colors = require('colors');
var theme = require('./theme');

var FIRST_OCCURRENCE = 0, // Sensitive to theme category order, and within those, keyword order.
    EXHAUSTIVE = 1;

var fixNewlines = function(lines) {
  var previousLine = '',
  fixedLines = [];

  lines.forEach(function(line) {
    line = line.trim();
    if (line.length > 0 && line[0] !== '*' && line[0] !== '-' && previousLine !== '') {
      fixedLines[-1] += line;
    } else {
      fixedLines.push(line);
      previousLine = line;
    }
  });

  return fixedLines;
};

var removeUnwantedLines = function(lines) {
  var keptLines = [];

  lines.forEach(function(line) {
    line = line.trim();
    if (line.length > 0 && (line[0] === '*' || line[0] === '-') && (line.length >= 3 && line.slice(0,3) !== '---') && line.slice(0,3) !== '===') {
      keptLines.push(line);
    } else if (line.length > 0 && parseInt(line[0]) == line[0]) { // Note the use of == here: http://floru.it/2011/implementing-pythons-string-isdigit-in-javascript/
      // Don't skip the numeric version label lines, e.g. 1.5, or 1.5.1, or 1.5.3.beta...
      keptLines.push(line);
    }
  });

  return keptLines;
};

var searchByFirstOccurrence = function(line) {
  var words = line.split(' '),
      winner = null,
      i = 0,
      j = 0,
      keyword = '';

  while (i < words.length-1 && !winner) {
    theme.categories.forEach(function(themeCategory) {
      j = 0;
      while (j < themeCategory.keywords.length-1 && !winner) {
        keyword = themeCategory.keywords[j];
        if (keyword === words[i] || line.indexOf(keyword) !== -1) {
          themeCategory.hitCount = 1;
          winner = themeCategory;
        }
        j++;
      }
    });
    i++;
  }

  return winner;
};

var searchExhaustivelyByKeywordCount = function(line) {
  var words = line.split(' '),
      winner = null;
      maxHitCount = 0,
      hitCount = 0;

  theme.categories.forEach(function(themeCategory) {    // For all categories...
    hitCount = 0;
    themeCategory.keywords.forEach(function(keyword) {  // For all keywords in category...
      words.forEach(function(word) {                    // How many times is the keyword found?
        if (keyword === word || line.indexOf(keyword) != -1) hitCount += 1;
      });
    });
    if (hitCount > maxHitCount) {
      winner = themeCategory;
      maxHitCount = hitCount;
    }
  });

  return winner;
};

var colorize = function(lines) {
  lines.forEach(function(originalLine) {
    var line = originalLine.toLowerCase();
    if (line.length > 0 && line[0] === '*' || line[0] === '-') {
      var winner = null; // winner === winning theme category.

      switch (parameters.search) {
        case 'first':
        case 'FIRST':
        case 'first-occurrence':
        case 'first_occurrence':
        case 'FIRST_OCCURRENCE':
        case FIRST_OCCURRENCE:
          winner = searchByFirstOccurrence(line);
          break;
        case 'exhaustive':
        case 'EXHAUSTIVE':
        case EXHAUSTIVE:
          winner = searchExhaustivelyByKeywordCount(line);
          break;
        default:
          winner = searchExhaustivelyByKeywordCount(line);
          break;
      }

      if (winner) {
        if (!parameters.targets || (parameters.targets && parameters.targets.indexOf(winner.name) !== -1)) {
          console.log(originalLine[winner.color]); // Equivalent to originalLine.blue; See colors framework.
        }
      } else if (!parameters.targets) { // Only let unmatched lines fall through if search is open.
        console.log(originalLine);
      }
    } else {  // These should only be version label lines, e.g., 1.5.3. Write out as markdown titles.
      console.log('');
      console.log(originalLine);
      console.log(new Array(originalLine.length+1).join('-'));
      console.log('');
    }
  });
};

var gatherCommandLineParameters = function(args) {
  var parameters = {};

  // Should be a bare minimum of 2, but in that case, as defined here, there
  // are no parameters in the call, not even an input file as simple filename.
  if (args.length <= 2) {
    return null;
  }

  // If the third argument is not a parameter, assume it is the input.
  if (args.length === 3 && args[2][0] !== '-') {
    // Return if the input file is the only argument as a simple filename.
    return { input: args[2] };
  }

  if (args[2][0] !== '-') {
    // input filename could have been provided as simple filename in third argument
    parameters['input'] = args[2];
  }

  args.forEach(function (arg) {
    if (arg.indexOf('=') != -1) {
      var parameter = '',
          value = '',
          parts = arg.split('=');

      if (parts[0].slice(0,2) === '--') {
        parameter = parts[0].slice(2);
        value = parts[1];

        if (parameter && value) {
          parameters[parameter] =  value;
        }
      }
    }
  });

  return parameters;
};

var parameters = null;

if (process.argv.length === 2) {
  if (process.argv[1] === 'linearizer.js') {
    console.log('See the README.md file at http://github.com/geojeff/linelizer');
  } else {
    console.log('linelizer Testing...');
    console.log('');
  }
} else {
  // This is a normal command line call with either an input file as 3rd argument only,
  // or with the 3rd argument as the input file and with additional parameters,
  // or with all arguments given as parameters, including the input file.
  parameters = gatherCommandLineParameters(process.argv);
}

if (parameters) {
  var lines = fs.readFileSync(parameters.input, 'utf-8').split('\n');
  lines = fixNewlines(lines);
  lines = removeUnwantedLines(lines);
  colorize(lines);
}

exports.fixNewlines = fixNewlines;
exports.removeUnwantedLines = removeUnwantedLines;
exports.gatherCommandLineParameters = gatherCommandLineParameters;
exports.searchByFirstOccurrence = searchByFirstOccurrence;
exports.searchExhaustivelyByKeywordCount = searchExhaustivelyByKeywordCount;
exports.colorize = colorize;

