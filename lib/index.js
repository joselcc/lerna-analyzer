"use strict";

var express = require('express');

var Project = require('@lerna/project');

var app = express();
var lernaProject = new Project(); // test this in http://www.webgraphviz.com/

var dot = "\ndigraph  {\n  rankdir=LR;\n  node [ fontsize=18 ];\n  edge [ fontsize=10 ];\n\n  rocket [\n    style = filled,\n    fontsize = 36,\n    fontname = \"Helvetica-Outline\",\n    fontcolor = white,\n    color = \"0.06666666666666667 1 1\"\n  ];\n    \n  rocket -> b [ fontsize=12, label = \"import\", style=\"filled\",fillcolor=\"0.647 0.204 1.000\", color=\"0.647 0.204 1.000\"];\n  b -> c [ label = \"import\" ];\n  rocket -> c [ label = \"import\" ];\n}\n";

function getDot(packages) {
  return packages.map(function (pkg) {
    if (pkg.dependencies) {
      return Object.keys(pkg.dependencies).map(function (dependency) {
        if (dependency.match(/@abcaustralia/gi)) {
          return "\"".concat(pkg.name, "\" -> \"").concat(dependency, "\";");
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
  lernaProject.getPackages().then(function (projectPackages) {
    // console.log(projectPackages);
    var dots = getDot(projectPackages);
    console.log(dots);
    var dotx = "\n    digraph  {\n      rankdir=LR;\n      node [ fontsize=18 ];\n      edge [ fontsize=10 ];\n    \n      \"@abcaustralia/rocket\" [\n        style = filled,\n        fontcolor = white,\n        color = \"0.06666666666666667 1 1\"\n      ];\n        \n      ".concat(dots, "\n    }\n    ");
    var html = "\n      <!DOCTYPE html>\n      <meta charset=\"utf-8\">\n      <body>\n      <script src=\"//d3js.org/d3.v4.min.js\"></script>\n      <script src=\"https://unpkg.com/viz.js@1.8.0/viz.js\" type=\"javascript/worker\"></script>\n      <script src=\"https://unpkg.com/d3-graphviz@1.4.0/build/d3-graphviz.min.js\"></script>\n      <div id=\"graph\" style=\"text-align: center;\"></div>\n      <script>\n\n      d3.select(\"#graph\").graphviz()\n        .fade(false)\n        .renderDot('".concat(dotx.replace(/\n/gi, ''), "');\n\n      </script>\n      <pre>").concat(dotx, "</pre>\n    ");
    res.send(html);
  }).catch(function (err) {
    console.error(err);
  });
});
app.listen(3001, function () {
  console.log('listening http://localhost:3001');
});