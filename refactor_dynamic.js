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

  // Replace next/dynamic
  if (content.includes('next/dynamic')) {
    // Replace import
    content = content.replace(/import dynamic from ["']next\/dynamic["'];?\n?/g, 'import React, { Suspense } from "react";\n');
    
    // Replace usage: const Comp = dynamic(() => import('./Comp'), { ssr: false }) => const Comp = React.lazy(() => import('./Comp'))
    // This Regex tries to capture the import part and drop the options object
    content = content.replace(/dynamic\(\s*\(\)\s*=>\s*import\(([^)]+)\)[^)]*\)/g, 'React.lazy(() => import($1))');
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Modified:', filePath);
  }
}

walk('./src', function(err) {
  if (err) throw err;
  console.log('Done refactoring next/dynamic to React.lazy.');
});
