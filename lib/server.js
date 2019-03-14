"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _project = _interopRequireDefault(require("@lerna/project"));

var _opener = _interopRequireDefault(require("opener"));

var _Ora = _interopRequireDefault(require("Ora"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const express = require('express');
// const Project = require('@lerna/project');
// const opener = require('opener');
// const lernaProject = new Project();
// test this in http://www.webgraphviz.com/
// const dot = `
// digraph  {
//   rankdir=LR;
//   node [ fontsize=18 ];
//   edge [ fontsize=10 ];
//   rocket [
//     style = filled,
//     fontsize = 36,
//     fontname = "Helvetica-Outline",
//     fontcolor = white,
//     color = "0.06666666666666667 1 1"
//   ];
//   rocket -> b [ fontsize=12, label = "import", style="filled",fillcolor="0.647 0.204 1.000", color="0.647 0.204 1.000"];
//   b -> c [ label = "import" ];
//   rocket -> c [ label = "import" ];
// }
// `;
// "@abcaustralia/rocket" [
//   style = filled,
//   fontcolor = white,
//   color = "0.06666666666666667 1 1"
// ];
var server = function server(projectPackages, scopedDependencies, options) {
  var spinner = new _Ora.default({
    text: 'Preparing server',
    spinner: 'dots' // check more here https://github.com/sindresorhus/cli-spinners/blob/master/spinners.json

  });
  spinner.start();
  var app = (0, _express.default)();
  var open = options.open;

  function getDotElements(packages, scopedDependencies) {
    return packages.map(function (pkg) {
      if (pkg.dependencies) {
        return Object.keys(pkg.dependencies).map(function (dependency) {
          if (dependency.match(new RegExp(scopedDependencies))) {
            return "\n                 \"".concat(pkg.name, "\" [\n                    style = filled,\n                    fontcolor = white,\n                    color = \"0.06666666666666667 1 1\"\n                  ];\n                  \"").concat(pkg.name, "\" -> \"").concat(dependency, "\";\n                ");
          }

          return '';
        }).filter(function (el) {
          return el !== '';
        }).join('\n');
      }

      return '';
    }).filter(function (el) {
      return el !== '';
    }).join('\n');
  }

  app.use('/', function (req, res) {
    try {
      // console.log(projectPackages);
      var dotElements = getDotElements(projectPackages, scopedDependencies); // console.log(dotElements);

      var dotScript = "\n      digraph  {\n        rankdir=LR;\n        node [ fontsize=18 ];\n        edge [ fontsize=10 ];\n          \n        ".concat(dotElements, "\n      }\n      ");
      var html = "\n        <!DOCTYPE html>\n        <meta charset=\"utf-8\">\n        <body>\n        <script src=\"//d3js.org/d3.v4.min.js\"></script>\n        <script src=\"https://unpkg.com/viz.js@1.8.0/viz.js\" type=\"javascript/worker\"></script>\n        <script src=\"https://unpkg.com/d3-graphviz@1.4.0/build/d3-graphviz.min.js\"></script>\n        <div id=\"graph\" style=\"text-align: center;\"></div>\n        <script>\n  \n        d3.select(\"#graph\").graphviz()\n          .fade(false)\n          .renderDot('".concat(dotScript.replace(/\n/gi, ''), "');\n  \n        </script>\n        <pre style=\"display: none\">").concat(dotScript, "</pre>\n      ");
      res.send(html);
    } catch (err) {
      console.error(err);
    }
  });
  spinner.succeed();
  app.listen(3001, function () {
    console.log('listening http://localhost:3001');
  });

  if (open) {
    (0, _opener.default)('http://localhost:3001');
  }
};

var _default = server;
exports.default = _default;