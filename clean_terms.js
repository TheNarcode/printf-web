const fs = require('fs');

let html = fs.readFileSync('src/app/terms/termsContent.ts', 'utf8');
// Extract the HTML string
let match = html.match(/export const termsHTML = `([\s\S]*)`;/);
if (!match) process.exit(1);
let content = match[1];

// Fix malformed tag
content = content.replace('<h3>Your submissions </strong>', '<h3>Your submissions</h3>');

// Remove all <a> tags that have only name or href starting with # and no text
content = content.replace(/<a\s+(name|href)="[^"]*">\s*<\/a>/gi, '');
content = content.replace(/<a\s+href="#[^"]*">([\s\S]*?)<\/a>/gi, '$1');

// Unwrap h1, h2, h3
content = content.replace(/<\/?strong>/gi, '');
content = content.replace(/<div>\s*<h([1-3])>(.*?)<\/h\1>\s*<\/div>/gi, '<h$1>$2</h$1>');
content = content.replace(/<h([1-3])>\s*(.*?)\s*<\/h\1>/gi, '<h$1>$2</h$1>');

// Replace div with p for normal text
// We can just strip out empty divs
content = content.replace(/<div>\s*<\/div>/gi, '');

// Convert remaining divs to p if they don't contain other block elements
// Actually, in prose, a bunch of divs act like paragraphs. We can just replace <div> with <p> and </div> with </p>
content = content.replace(/<div[^>]*>/gi, '<p>');
content = content.replace(/<\/div>/gi, '</p>');

// Now we might have nested p tags like <p><p>...</p></p>. Let's unnest them.
// A simple way is to just remove all <p> and </p> that wrap block elements like h1, h2, h3, ul
content = content.replace(/<p>\s*<h([1-3])>(.*?)<\/h\1>\s*<\/p>/gi, '<h$1>$2</h$1>');
content = content.replace(/<p>\s*<ul>([\s\S]*?)<\/ul>\s*<\/p>/gi, '<ul>$1</ul>');

// Remove empty paragraphs
content = content.replace(/<p>\s*<\/p>/gi, '');
content = content.replace(/<p>\s*&nbsp;\s*<\/p>/gi, '');

// Replace multiple <p> wrappers
content = content.replace(/<p>\s*<p>/gi, '<p>');
content = content.replace(/<\/p>\s*<\/p>/gi, '</p>');

// Add bold back to the specific terms defined in the text
content = content.replace(/"Company," "we," "us," "our"/g, '"<strong>Company</strong>," "<strong>we</strong>," "<strong>us</strong>," "<strong>our</strong>"');
content = content.replace(/"Site"/g, '"<strong>Site</strong>"');
content = content.replace(/"App"/g, '"<strong>App</strong>"');
content = content.replace(/"Legal Terms"/g, '"<strong>Legal Terms</strong>"');
content = content.replace(/"Services"/g, '"<strong>Services</strong>"');
content = content.replace(/"you"/g, '"<strong>you</strong>"');

// Fix the title
content = content.replace(/<p><p><h1>TERMS AND CONDITIONS<\/h1><\/p><p>Last updated June 28, 2026<\/p><p><h2>AGREEMENT TO OUR LEGAL TERMS<\/h2><\/p><\/p>/, '<h1>TERMS AND CONDITIONS</h1><p>Last updated: June 28, 2026</p><h2>AGREEMENT TO OUR LEGAL TERMS</h2>');

// One more pass to remove empty paragraphs
content = content.replace(/<p>\s*<\/p>/gi, '');

// Format the code nicely
content = content.replace(/>\s*</g, '>\n<');

fs.writeFileSync('src/app/terms/termsContent.ts', 'export const termsHTML = `\n' + content.replace(/`/g, '\\`').replace(/\$/g, '\\$') + '\n`;');

console.log("Done cleaning");
