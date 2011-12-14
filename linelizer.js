var fs = require('fs');
var colors = require('colors');
var theme = require('./theme');

var FIRST_OCCURRENCE = 0, // Sensitive to theme category order, and within those, keyword order.
    EXHAUSTIVE = 1,
    searchMethod = EXHAUSTIVE;

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
      winningThemeCategory = null,
      i = 0,
      j = 0,
      keyword = '';

  while (i < words.length-1 && !winningThemeCategory) {
    theme.categories.forEach(function(themeCategory) {
      j = 0;
      while (j < themeCategory.keywords.length-1 && !winningThemeCategory) {
        keyword = themeCategory.keywords[j];
        if (keyword === words[i] || line.indexOf(keyword) !== -1) {
          themeCategory.hitCount = 1;
          winningThemeCategory = themeCategory;
        }
        j++;
      }
    });
    i++;
  }

  return winningThemeCategory;
};

var searchExhaustivelyByKeywordCount = function(line) {
  var words = line.split(' '),
      i = 0,
      winningThemeCategory = null,
      maxHitCount = 0;

  // Zero out hitCounts for theme.categories.
  theme.categories.forEach(function(themeCategory) {
    themeCategory.hitCount = 0;
  });

  while (i < words.length-1) {
    theme.categories.forEach(function(themeCategory) {
      themeCategory.keywords.forEach(function(keyword) {
        if (keyword === words[i] || line.indexOf(keyword) !== -1) {
          themeCategory.hitCount += 1;
        }
      });
    });
    i++;
  }

  theme.categories.forEach(function(themeCategory) {
    if (themeCategory.hitCount > maxHitCount) {
      maxHitCount = themeCategory.hitCount;
      winningThemeCategory = themeCategory;
    }
  });

  return winningThemeCategory;
};

var colorize = function(lines) {
  lines.forEach(function(originalLine) {
    line = originalLine.toLowerCase();
    if (line.length > 0 && line[0] === '*' || line[0] === '-') {
      var color = '',
          winningThemeCategory = null;

      switch (searchMethod) {
        case FIRST_OCCURRENCE:
          winningThemeCategory = searchByFirstOccurrence(line);
          break;
        case EXHAUSTIVE:
          winningThemeCategory = searchExhaustivelyByKeywordCount(line);
          break;
        default:
          winningThemeCategory = searchByFirstOccurrence(line);
          break;
      }

      if (winningThemeCategory) {
        if (!parameters.targets || (parameters.targets && parameters.targets.indexOf(winningThemeCategory.color) !== -1)) {
          console.log(originalLine[winningThemeCategory.color]);
        }
      } else if (!parameters.targets) { // Only let unmatched lines fall through if search is open.
        console.log(originalLine);
      }
    } else {  // These should only be version label lines, so write out as markdown titles.
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
          console.log('parameters', parameters);
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

