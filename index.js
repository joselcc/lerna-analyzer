const express = require('express');
const Project = require('@lerna/project'); 

const app = express();
const lernaProject = new Project();




// test this in http://www.webgraphviz.com/
const dot = `
digraph  {
  rankdir=LR;
  node [ fontsize=18 ];
  edge [ fontsize=10 ];

  rocket [
    style = filled,
    fontsize = 36,
    fontname = "Helvetica-Outline",
    fontcolor = white,
    color = "0.06666666666666667 1 1"
  ];
    
  rocket -> b [ fontsize=12, label = "import", style="filled",fillcolor="0.647 0.204 1.000", color="0.647 0.204 1.000"];
  b -> c [ label = "import" ];
  rocket -> c [ label = "import" ];
}
`;




function getDot(packages) {

  return packages.map((pkg) => {
    if (pkg.dependencies) {
      return Object.keys(pkg.dependencies).map(dependency => {
        if (dependency.match(/@abcaustralia/gi)) {
          return `"${pkg.name}" -> "${dependency}";`;
        }
        return '';
      }).filter(el => el !== '').join('\n');  
    }
    return '';
  }).filter(el => el !== '').join('\n');
}

console.log(process.cwd());

app.use('/', (req, res) => {
  lernaProject
  .getPackages()
  .then(projectPackages => {
    // console.log(projectPackages);
    const dots = getDot(projectPackages);
    console.log(dots);

    const dotx = `
    digraph  {
      rankdir=LR;
      node [ fontsize=18 ];
      edge [ fontsize=10 ];
    
      "@abcaustralia/rocket" [
        style = filled,
        fontcolor = white,
        color = "0.06666666666666667 1 1"
      ];
        
      ${dots}
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
        .renderDot('${dotx.replace(/\n/gi, '')}');

      </script>
      <pre>${dotx}</pre>
    `;
    res.send(html);

  })
  .catch(err => {
    console.error(err);
  });



});

app.listen(3001, () => {
  console.log('listening http://localhost:3001');
});