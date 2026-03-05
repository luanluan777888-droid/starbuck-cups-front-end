const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdir(dir, function (err, list) {
    if (err) return callback(err);
    let pending = list.length;
    if (!pending) return callback(null);
    list.forEach(function (file) {
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err) {
            if (!--pending) callback(null);
          });
        } else {
          if (file.endsWith('.tsx') || file.endsWith('.ts')) {
             processFile(file);
          }
          if (!--pending) callback(null);
        }
      });
    });
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // React.lazy(() => import("...").then(m => ({ default: m.ProductsHeader })))
  // We need to parse: const ComponentName = React.lazy(() => import("..."));
  // And change it to: const ComponentName = React.lazy(() => import("...").then(module => ({ default: module.ComponentName || module.default })));

  const regex = /(const|let|var)\s+([A-Za-z0-9_]+)\s*=\s*React\.lazy\(\s*\(\)\s*=>\s*import\(([^)]+)\)\s*\);/g;
  
  content = content.replace(regex, (match, declaration, componentName, importPath) => {
    return `${declaration} ${componentName} = React.lazy(() => import(${importPath}).then(module => ({ default: module.${componentName} || module.default })));`;
  });


  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed lazy typing:', filePath);
  }
}

walk('./src', function(err) {
  if (err) throw err;
  console.log('Done fixing next/dynamic named exports.');
});
