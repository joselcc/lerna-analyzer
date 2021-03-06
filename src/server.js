import express from 'express';
import Project from '@lerna/project';
import opener from 'opener';
import Ora from 'Ora';

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

const server = (projectPackages, scopedDependencies, options) => {
  const spinner = new Ora({
    text: 'Preparing server',
    spinner: 'dots' // check more here https://github.com/sindresorhus/cli-spinners/blob/master/spinners.json
  });
  spinner.start();
  const app = express();

  const { open } = options;

  function getDotElements(packages, scopedDependencies) {
    return packages
      .map(pkg => {
        if (pkg.dependencies) {
          return Object.keys(pkg.dependencies)
            .map(dependency => {
              if (dependency.match(new RegExp(scopedDependencies))) {
                return `
                 "${pkg.name}" [
                    style = filled,
                    fontcolor = white,
                    color = "0.06666666666666667 1 1"
                  ];
                  "${pkg.name}" -> "${dependency}";
                `;
              }
              return '';
            })
            .filter(el => el !== '')
            .join('\n');
        }
        return '';
      })
      .filter(el => el !== '')
      .join('\n');
  }

  app.use('/', (req, res) => {
    try {
      // console.log(projectPackages);
      const dotElements = getDotElements(projectPackages, scopedDependencies);
      // console.log(dotElements);

      const dotScript = `
      digraph  {
        rankdir=LR;
        node [ fontsize=18 ];
        edge [ fontsize=10 ];
          
        ${dotElements}
      }
      `;

      const html = `
        <!DOCTYPE html>
        <meta charset="utf-8">
        <body>
        <script src="//d3js.org/d3.v4.min.js"></script>
        <script src="https://unpkg.com/viz.js@1.8.0/viz.js" type="javascript/worker"></script>
        <script src="https://unpkg.com/d3-graphviz@1.4.0/build/d3-graphviz.min.js"></script>
        <div id="graph" style="text-align: center;"></div>
        <script>
  
        d3.select("#graph").graphviz()
          .fade(false)
          .renderDot('${dotScript.replace(/\n/gi, '')}');
  
        </script>
        <pre style="display: none">${dotScript}</pre>
      `;
      res.send(html);
    } catch (err) {
      console.error(err);
    }
  });

  spinner.succeed();

  app.listen(3001, () => {
    console.log('listening http://localhost:3001');
  });

  if (open) {
    opener('http://localhost:3001');
  }
};

export default server;
