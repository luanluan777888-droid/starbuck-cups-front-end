/**
 * rename_env_vars.js
 * Renames NEXT_PUBLIC_ env vars to VITE_ equivalents across all source files.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
let modifiedCount = 0;

const RENAMES = [
  { from: 'process.env.NEXT_PUBLIC_API_URL', to: 'import.meta.env.VITE_API_URL' },
  { from: 'process.env.NEXT_PUBLIC_SITE_URL', to: 'import.meta.env.VITE_SITE_URL' },
  { from: 'process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID', to: 'import.meta.env.VITE_GA_MEASUREMENT_ID' },
  { from: 'process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION', to: 'import.meta.env.VITE_GOOGLE_SITE_VERIFICATION' },
  { from: 'process.env.NEXT_PUBLIC_YANDEX_VERIFICATION', to: 'import.meta.env.VITE_YANDEX_VERIFICATION' },
  // Catch-all for any others
  { from: 'process.env.NEXT_PUBLIC_', to: 'import.meta.env.VITE_' },
];

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

  for (const { from, to } of RENAMES) {
    while (content.includes(from)) {
      content = content.replace(from, to);
    }
  }

  if (content !== orig) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedCount++;
    console.log('Renamed env vars in:', filePath.replace(SRC, ''));
  }
});

console.log(`\nDone! Modified ${modifiedCount} files.`);
console.log('\n⚠️  Remember to update your .env file:');
console.log('  - Rename NEXT_PUBLIC_API_URL to VITE_API_URL');
console.log('  - Rename NEXT_PUBLIC_SITE_URL to VITE_SITE_URL');
console.log('  - Rename NEXT_PUBLIC_GA_MEASUREMENT_ID to VITE_GA_MEASUREMENT_ID');
