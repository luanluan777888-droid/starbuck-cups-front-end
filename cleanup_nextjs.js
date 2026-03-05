/**
 * cleanup_nextjs.js
 * Removes all Next.js-specific patterns from the codebase:
 * 1. "use client"; directives  
 * 2. "use server"; directives
 * 3. NEXT_PUBLIC_ env var references (flags them for review)
 * 4. Tracks remaining next/ imports
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
let modifiedCount = 0;
let nextImportFiles = [];
let envVarFiles = [];

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(name => {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, callback);
    else if (full.match(/\.(tsx|ts|jsx|js)$/)) callback(full);
  });
}

walk(SRC, filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const orig = content;

  // Remove "use client"; and "use server"; directives (not needed in Vite)
  content = content.replace(/^["']use client["'];?\r?\n?/gm, '');
  content = content.replace(/^["']use server["'];?\r?\n?/gm, '');
  
  // Remove duplicate blank lines at the top
  content = content.replace(/^\n{2,}/, '\n');

  // Track files that still have next/ imports
  if (content.includes('from "next/') || content.includes("from 'next/")) {
    nextImportFiles.push(filePath.replace(SRC, ''));
  }

  // Track NEXT_PUBLIC_ env var references
  const envMatches = content.match(/process\.env\.NEXT_PUBLIC_\w+/g);
  if (envMatches) {
    envVarFiles.push({ file: filePath.replace(SRC, ''), vars: [...new Set(envMatches)] });
  }

  if (content !== orig) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
  }
});

console.log(`\nModified ${modifiedCount} files.`);

if (nextImportFiles.length > 0) {
  console.log('\n⚠️  Files still importing from next/:');
  nextImportFiles.forEach(f => console.log('  -', f));
} else {
  console.log('\n✅ No remaining next/ imports found!');
}

if (envVarFiles.length > 0) {
  console.log('\n⚠️  Files using NEXT_PUBLIC_ env vars (rename to VITE_):');
  envVarFiles.forEach(({ file, vars }) => {
    console.log(`  - ${file}:`);
    vars.forEach(v => console.log(`      ${v}`));
  });
} else {
  console.log('\n✅ No NEXT_PUBLIC_ env vars found!');
}
