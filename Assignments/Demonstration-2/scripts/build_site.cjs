// Build the assessment from shared assets and the canonical Lab 4-6 sources.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const lab = path.resolve(root, '../../Lab');
const output = path.join(root, 'dist');
assert.equal(path.dirname(output), root);
// Only the generated site is replaced; source exercises and local archives stay intact.
fs.rmSync(output, {recursive:true, force:true});
fs.mkdirSync(output, {recursive:true});
for (const entry of ['index.html', 'methodology.html', 'shared', 'output/pdf']) {
  fs.cpSync(path.join(root, entry), path.join(output, entry), {recursive:true});
}
for (const folder of ['Lab-4', 'Lab-5', 'Lab-6']) {
  for (const name of fs.readdirSync(path.join(lab, folder))) {
    if (/\.(html|js|svg)$/.test(name) || name === 'data') {
      fs.cpSync(path.join(lab, folder, name), path.join(output, folder, name), {recursive:true});
    }
  }
}
for (const name of fs.readdirSync(path.join(root, 'evidence'))) {
  if (/^(house-|website-).*\.(png|svg)$/.test(name)) {
    fs.mkdirSync(path.join(output, 'evidence'), {recursive:true});
    fs.copyFileSync(path.join(root, 'evidence', name), path.join(output, 'evidence', name));
  }
}
// Source pages work from the repository root; the public build is self-contained.
for (const folder of ['', 'Lab-4', 'Lab-5', 'Lab-6']) {
  for (const name of fs.readdirSync(path.join(output, folder))) {
    if (!name.endsWith('.html')) continue;
    const file = path.join(output, folder, name);
    const html = fs.readFileSync(file, 'utf8')
      .replaceAll('../../Assignments/Demonstration-2/', '../')
      .replaceAll('../../Lab/', '');
    fs.writeFileSync(file, html);
  }
}
assert.ok(fs.existsSync(path.join(output, 'Lab-6/data/Ex6_TVdata_withStar.csv')));
assert.ok(!fs.existsSync(path.join(output, 'Lab-5/KNIME-Exercise-5')));
assert.ok(!fs.existsSync(path.join(output, 'scripts')));
console.log('Static Demo 2 site ready in Assignments/Demonstration-2/dist.');
