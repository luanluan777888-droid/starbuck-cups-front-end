/**
 * fix_all_dynamic.js
 * Scans all .tsx/.ts files for broken `next/dynamic` -> `React.lazy` conversions
 * that left syntax like:   )) => <JSX fallback>}) or ,{loading...})
 * and rewrites those lines cleanly.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(name => {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, callback);
    else if (full.match(/\.(tsx|ts)$/)) callback(full);
  });
}

walk(SRC, filePath => {
  let src = fs.readFileSync(filePath, 'utf8');
  const orig = src;

  /* ---- Pattern 1 ----
   * Broken because refactor_dynamic.js did:
   *   dynamic(() => import("A"), {loading: () => <B />})
   *   -> React.lazy(() => import("A")), {loading: ...})    ← extra )), bad 2nd arg
   *
   * The line looks like:
   *   const Foo = React.lazy(() => import("...")), {loading: () => ... });
   *   const Foo = React.lazy(() => import("...")) => <Fallback />\n});
   */

  // Remove trailing `,{loading:...}` or `,{ ssr: false }` after the lazy call
  src = src.replace(
    /const (\w+) = React\.lazy\(\(\) => import\((['"][^'"]+['"])\)\)\),?\s*\{[^}]+\}\s*\);/g,
    (_, name, imp) => `const ${name} = React.lazy(() => import(${imp}).then(m => ({ default: m.${name} ?? m.default })));`
  );

  // Remove trailing `=> <JSX ... ` after the lazy call (the `loading` option became JSX)
  src = src.replace(
    /const (\w+) = React\.lazy\(\(\) => import\((['"][^'"]+['"])\)\)\) => [\s\S]+?\n\}\);/g,
    (_, name, imp) => `const ${name} = React.lazy(() => import(${imp}).then(m => ({ default: m.${name} ?? m.default })));`
  );

  // Clean up duplicated "use client" directives at top
  src = src.replace(/^("use client";\n){2,}/m, '"use client";\n');
  src = src.replace(/^"use client";\n"use client";/m, '"use client";');

  if (src !== orig) {
    fs.writeFileSync(filePath, src, 'utf8');
    console.log('Fixed:', filePath.replace(SRC, ''));
  }
});

console.log('All done!');
