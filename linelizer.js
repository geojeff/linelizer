var fs = require('fs');
try {
  var colors = require('colors');
} catch (err) {
  console.log('Running without colors module...');
}
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

var searchExhaustivelyByKeywordCount = function(line, theme_file) {
  var words = line.split(' '),
      winner = null;
      maxHitCount = 0,
      hitCount = 0,
      active_theme = {};

  if (theme_file) {
    var theme_with_path = ''; // For require to work, if needed, the custom theme path must be as './custom_theme.js'.

    if (parameters.theme[0] === '/' || parameters.theme[0] === '.') {
      theme_with_path = parameters.theme;
    } else {
      theme_with_path = './' + parameters.theme;
    }

    active_theme = require(theme_with_path);
  } else {
    active_theme = theme;
  }

  active_theme.categories.forEach(function(themeCategory) {  // For all categories...
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

var emitLines = function(lines, theme_file) {
  lines.forEach(function(originalLine) {
    var line = originalLine.toLowerCase();
    if (line.length > 0 && line[0] === '*' || line[0] === '-') {
      var winner = null; // winner === winning theme category.

      winner = searchExhaustivelyByKeywordCount(line, theme_file);

      if (winner) {
        if (!parameters.targets || (parameters.targets && parameters.targets.indexOf(winner.name) !== -1)) {
          if (parameters.colors && parameters.colors.toLowerCase() !== 'no') {
            console.log(originalLine[winner.color]); // Equivalent to originalLine.blue; See colors framework.
          } else {
            console.log(originalLine);
          }
        }
      } else if (!parameters.targets) { // Only let unmatched lines fall through if search is open. And never colors.
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

var theme_file = null;

if (parameters) {
  if (parameters.theme) {
    try {
      theme_file = fs.readFileSync(parameters.theme, 'utf-8');
    } catch (err) {
      console.log('Problem reading custom theme file');
    }
  }
  var lines = fs.readFileSync(parameters.input, 'utf-8').split('\n');
  lines = fixNewlines(lines);
  lines = removeUnwantedLines(lines);
  emitLines(lines, theme_file);
}

exports.fixNewlines = fixNewlines;
exports.removeUnwantedLines = removeUnwantedLines;
exports.gatherCommandLineParameters = gatherCommandLineParameters;
exports.searchExhaustivelyByKeywordCount = searchExhaustivelyByKeywordCount;
exports.emitLines = emitLines;

