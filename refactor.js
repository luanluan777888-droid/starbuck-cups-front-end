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

  // 1. Replace next/link
  content = content.replace(/import Link from ["']next\/link["'];?/g, 'import { Link } from "react-router-dom";');
  content = content.replace(/<Link([^>]+)href=/g, '<Link$1to=');

  // 2. Replace next/image with standard img
  content = content.replace(/import Image from ["']next\/image["'];?/g, '');
  content = content.replace(/<Image([^>]+)src=/g, '<img$1src=');

  // 3. Replace next/navigation
  // This is tricky because we need to replace useRouter with useNavigate, usePathname with useLocation, etc.
  
  if (content.includes('next/navigation')) {
    // Replace the import line itself
    let newImports = [];
    if (content.includes('useRouter')) newImports.push('useNavigate');
    if (content.includes('usePathname')) newImports.push('useLocation');
    if (content.includes('useSearchParams')) newImports.push('useSearchParams'); // same name
    if (content.includes('useParams')) newImports.push('useParams'); // same name
    
    if (newImports.length > 0) {
       let reactRouterImports = `import { ${newImports.join(', ')} } from "react-router-dom";`;
       content = content.replace(/import \{[^}]+\}\s+from ["']next\/navigation["'];?/g, reactRouterImports);
    } else {
       content = content.replace(/import \{[^}]+\}\s+from ["']next\/navigation["'];?/g, '');
    }

    // Replace usage in code
    content = content.replace(/useRouter\(\)/g, 'useNavigate()');
    // For usePathname, it usually assigns: const pathname = usePathname();
    // In React Router, it's const location = useLocation(); const pathname = location.pathname;
    // We can do a hacky regex or just replace usePathname() with useLocation().pathname
    content = content.replace(/usePathname\(\)/g, 'useLocation().pathname');

    // Remove notFound import and usage if any
    content = content.replace(/import \{[^}]*notFound[^}]*\}\s+from ["']next\/navigation["'];?/g, '');
    content = content.replace(/notFound\(\);?/g, '/* TODO: Handle notFound */');
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Modified:', filePath);
  }
}

walk('./src', function(err) {
  if (err) throw err;
  console.log('Done refactoring Next.js imports.');
});
