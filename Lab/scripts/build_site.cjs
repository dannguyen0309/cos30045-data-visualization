// Copy only website assets: KNIME caches, old labs and development scripts stay off the public site.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const entries = ['index.html', 'methodology.html', 'shared', 'output/pdf'];
for (const folder of ['Lab-4', 'Lab-5', 'Lab-6']) {
  for (const name of fs.readdirSync(path.join(root, folder))) {
    if (/\.(html|js|svg)$/.test(name) || name === 'data') entries.push(`${folder}/${name}`);
  }
}
for (const name of fs.readdirSync(path.join(root, 'evidence'))) {
  if (/^(house-|website-).*\.(png|svg)$/.test(name)) entries.push(`evidence/${name}`);
}
assert.equal(path.dirname(output), root);
// Remove only this generated output folder so deleted source files cannot remain public.
fs.rmSync(output, {recursive:true,force:true});
fs.mkdirSync(output, {recursive:true});
for (const entry of entries) fs.cpSync(path.join(root, entry), path.join(output, entry), {recursive:true});
assert.ok(fs.existsSync(path.join(output, 'Lab-6/data/Ex6_TVdata_withStar.csv')));
assert.ok(!fs.existsSync(path.join(output, 'Lab-5/KNIME-Exercise-5')));
assert.ok(!fs.existsSync(path.join(output, 'scripts')));
console.log(`Static site ready: ${entries.length} entries copied to Lab/dist.`);
