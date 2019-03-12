"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var express = require('express');

var Project = require('@lerna/project');

var server = function server(projectPackages) {
  var app = express(); // const lernaProject = new Project();
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

  function getDotElements(packages) {
    return packages.map(function (pkg) {
      if (pkg.dependencies) {
        return Object.keys(pkg.dependencies).map(function (dependency) {
          if (dependency.match(/@abcaustralia/gi)) {
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

  console.log(process.cwd());
  app.use('/', function (req, res) {
    try {
      // console.log(projectPackages);
      var dotElements = getDotElements(projectPackages); // console.log(dotElements);

      var dotScript = "\n      digraph  {\n        rankdir=LR;\n        node [ fontsize=18 ];\n        edge [ fontsize=10 ];\n          \n        ".concat(dotElements, "\n      }\n      ");
      var html = "\n        <!DOCTYPE html>\n        <meta charset=\"utf-8\">\n        <body>\n        <script src=\"//d3js.org/d3.v4.min.js\"></script>\n        <script src=\"https://unpkg.com/viz.js@1.8.0/viz.js\" type=\"javascript/worker\"></script>\n        <script src=\"https://unpkg.com/d3-graphviz@1.4.0/build/d3-graphviz.min.js\"></script>\n        <div id=\"graph\" style=\"text-align: center;\"></div>\n        <script>\n  \n        d3.select(\"#graph\").graphviz()\n          .fade(false)\n          .renderDot('".concat(dotScript.replace(/\n/gi, ''), "');\n  \n        </script>\n        <pre>").concat(dotScript, "</pre>\n      ");
      res.send(html);
    } catch (err) {
      console.error(err);
    }
  });
  app.listen(3001, function () {
    console.log('listening http://localhost:3001');
  });
};

var _default = server;
exports.default = _default;