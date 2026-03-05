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

  // Cleanup React.lazy syntax parsing mistakes
  // Example: const Comp = React.lazy(() => import("...")), { ssr: false });
  // Example: const Comp = React.lazy(() => import("...")), { loading: () => <div /> });
  
  content = content.replace(/React\.lazy\(([^)]+\))\)\),?\s*\{[^}]+\}\s*\);/g, 'React.lazy($1);');
  content = content.replace(/React\.lazy\(([^)]+\))\)\)\s*=>.*?\);/g, 'React.lazy($1);');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed lazy syntax:', filePath);
  }
}

walk('./src', function(err) {
  if (err) throw err;
  console.log('Done fixing next/dynamic syntax issues.');
});
