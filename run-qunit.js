function forEach(object, callback) {

    for (var i in object) {
        if (({}).hasOwnProperty.call(object, i)) {
            callback(object[i], i);
        }
    }

}

var Suite = function(testSuite){

    var fs = require('fs');
    var workingDir = fs.workingDirectory;

    phantom.injectJs(workingDir + '/' + testSuite + '/config.js');

    this.config = config;
    this.fs = fs;

    this.workingDir = workingDir;
    this.compiledPath = workingDir + config.target.location;
    this.sourcePath = workingDir + config.target.location + '_tmp';

    this.testRunnerSource = this.sourcePath + '/test.html';
    this.testRunnerCompiled = this.compiledPath + '/test.html';
    this.report = this.compiledPath + '/test-report.html';

    this.runnerTemplate = workingDir + '/test/index.html';
    this.coverageTemplate = workingDir + '/vendor/qunit-coverage/template-fileCoverage.html';
    this.reportTemplate = workingDir + '/vendor/qunit-coverage/template-report.html';

};

/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean
 * @param onReady what to do when testFx condition is fulfilled
 * @param timeOutMsec the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMsec) {

    var maxTimeOutMsec = timeOutMsec ? timeOutMsec : 3001; //< Default Max Timout is 3s
    var start = new Date().getTime();
    var condition = false;
    var interval = setInterval(function() {

        var elapsedTime = new Date().getTime() - start;

        if ((elapsedTime < maxTimeOutMsec) && !condition) {

            // If not time-out yet and condition not yet fulfilled
            condition = testFx();

        } else {

            // If condition still not fulfilled (timeout but condition is 'false')
            if (!condition)  throw 'waitFor() timeout';

            console.log('Page load time: ' + elapsedTime + 'ms.');
            onReady();
            clearInterval(interval);

        }

    }, 250);

}

function getCoveragesJSON() {

    return page.evaluate(function() {

        return getCoverage();

    });

}

function parseCoverages(json) {

    var coverages = JSON.parse(json);
    var parsedCoverages = [];

    forEach(coverages, function(coverage, fileName) {

        parsedCoverages.push(getInfoFromFileCoverage(coverage, fileName));

    });

    return parsedCoverages;

}

function getInfoFromFileCoverage(coverage, fileName) {

    var reportHtml = [];
    var sourceCodeHtml = [];

    //var source = fs.read(suite.sourcePath + '/' + fileName).split('\n');
    var source = coverage.source;

    var testableLines = 0;
    var testedLines = 0;
    var untestableLines = 0;

    sourceCodeHtml.push('<table class="coverage">');

    forEach(source, function(line, j) {

        j = parseInt(j, 10);
        var cvg = coverage.coverage[j + 1];
        var hitmiss = '';

        if (cvg !== undefined) {
            testableLines++;
            if (cvg > 0) testedLines++;
            hitmiss = ' ' + (cvg > 0 ? 'hit' : 'miss');
        } else {
            hitmiss = ' ' + 'undef';
            untestableLines++;
        }

        sourceCodeHtml.push('<tr><td>' + (j + 1) + '</td><td class="code' + hitmiss + '">' + line + '</td></tr>\n');

    });

    sourceCodeHtml.push('</table>');

    var coveragePercentInt = Math.floor(100 * testedLines / testableLines);
    var coveragePercent = coveragePercentInt + '%';

    reportHtml.push('<h1>' + fileName + '</h1>');
    reportHtml.push('<h2>Coverage: ' + coveragePercent + '</h2>');
    reportHtml.push(sourceCodeHtml.join('\n'));

    return {
        testableLines: testableLines,
        testedLines: testedLines,
        coveragePercentInt: coveragePercentInt,
        coveragePercent: coveragePercent,
        fileCoverageHtml: reportHtml.join('\n'),
        fileName: fileName,
        fileReport: fileName.replace('.js', '.js.html')
    };

}

function getTestResultsHTML() {

    return page.evaluate(function() {
        return document.getElementById('qunit-tests').parentNode.innerHTML;
    });

}

function getTestResults() {

    return JSON.parse(page.evaluate(function() {

        try {

            var el = document.getElementById('qunit-testresult');
            var passed = el.getElementsByClassName('passed')[0].innerText;
            var total = el.getElementsByClassName('total')[0].innerText;
            var failed = el.getElementsByClassName('failed')[0].innerText;

            return JSON.stringify({
                passed: parseInt(passed, 10),
                total: parseInt(total, 10),
                failed: parseInt(failed, 10)
            });

        } catch (e) {}

        // In case of any errors just return zeroes
        return JSON.stringify({
            passed: 0,
            total: 0,
            failed: 0
        });

    }));

}

function getReportHTML(coverages) {

    var reportHTML = [];
    var perFileReports = [];
    var overallTestableLines = 0;
    var overallTestedLines = 0;

    perFileReports.push('<ul class="coverage">');

    forEach(coverages, function(coverage) {

        overallTestableLines += coverage.testableLines;
        overallTestedLines += coverage.testedLines;

        var coverageClass = 'coverage-low';
        if (coverage.coveragePercentInt > 30) coverageClass = 'coverage-medium';
        if (coverage.coveragePercentInt > 70) coverageClass = 'coverage-high';
        if (coverage.coveragePercentInt == 100) coverageClass = 'coverage-full';

        perFileReports.push('<li class="' + coverageClass + '"><a href="' + coverage.fileReport + '">' + coverage.fileName + '</a> : <span class="coverage-percent">' + coverage.coveragePercent + '</span></li>');

    });

    perFileReports.push('</ul>');

    var overallCoveragePercent = Math.floor(100 * overallTestedLines / overallTestableLines) + '%';

    reportHTML.push('<h1>Test suite: ' + testSuite + ' (' + (new Date()).toGMTString() + ')</h1>');
    reportHTML.push(getTestResultsHTML());
    reportHTML.push('<h1>Code coverage: ' + overallCoveragePercent + '</h1>');
    reportHTML.push(perFileReports.join('\n'));

    return reportHTML.join('\n');

}

function isTestCompleted() {

    return page.evaluate(function() {
        var el = document.getElementById('qunit-testresult');
        return (el && el.innerText.match('completed'));
    });

}

var testSuite = phantom.args[0];
var suite = new Suite(testSuite);
var page = new WebPage();
var fs = suite.fs;

try {

    console.log('Test suite: ' + testSuite);
    console.log('Running tests from: ' + suite.testRunnerCompiled);

    // Copy needed assets
    fs.copy(fs.absolute('vendor/qunit-coverage/style.css'), suite.compiledPath + '/style.css');
    fs.copy(fs.absolute('vendor/qunit/qunit/qunit.css'), suite.compiledPath + '/qunit.css');
    fs.copy(fs.absolute('vendor/qunit-coverage/coverage.css'), suite.compiledPath + '/coverage.css');
    fs.copy(fs.absolute('vendor/qunit/qunit/qunit.js'), suite.compiledPath + '/qunit.js');

    // Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
    page.onConsoleMessage = function(msg) {
        console.log('Browser: ' + msg);
    };

    // Run tests
    page.open(suite.testRunnerCompiled, function(status) {

        if (status !== "success") {

            throw 'Unable to access network';

        } else {

            waitFor(function() {

                return isTestCompleted();

            }, function() {

                // Raw coverage data
                var coveragesString = getCoveragesJSON();
                fs.write(suite.compiledPath + '/coverage.json', coveragesString, 'w');

                // Parse coverage data
                var coverages = parseCoverages(coveragesString);

                // Per-file reports HTML
                var fileCoverage = fs.read(suite.coverageTemplate);
                forEach(coverages, function(coverage) {

                    // Write coverage report HTML
                    fs.write(suite.compiledPath + '/' + coverage.fileReport, fileCoverage.replace('<div id="code"></div>', coverage.fileCoverageHtml), 'w');

                });

                // Report HTML
                var reportHTML = getReportHTML(coverages);
                var suiteReportTemplate = fs.read(suite.reportTemplate);
                fs.write(suite.report, suiteReportTemplate.replace('<div id="report"></div>', reportHTML), 'w');

                // Cleanup
                fs.remove(suite.compiledPath + '/jscoverage-highlight.css');
                fs.remove(suite.compiledPath + '/jscoverage-ie.css');
                fs.remove(suite.compiledPath + '/jscoverage.css');
                fs.remove(suite.compiledPath + '/jscoverage-throbber.gif');
                fs.remove(suite.compiledPath + '/jscoverage.html');
                fs.remove(suite.compiledPath + '/jscoverage.js');
                fs.removeTree(suite.sourcePath);

                // Some logging
                var result = getTestResults();
                console.log('Test results');
                console.log('Total: ' + result.total + ', Passed: ' + result.passed + ', Failed: ' + result.failed);
                console.log('Generated report: ' + suite.report);

                phantom.exit(result.failed > 0 ? 1 : 0);

            }, 3001);
        }
    });

} catch (e) {

    console.log('Critical error: ' + JSON.stringify(e));
    phantom.exit(1);

}

