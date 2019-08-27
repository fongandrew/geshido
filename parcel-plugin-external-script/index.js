/* eslint-disable */
const fs = require('fs');

// Replace
const externalStartRe = /<external-script\b/g;
const externalEndRe = /<\/external-script>/g;

function replaceScriptTags(bundle) {
	if (bundle.type === 'html') {
		const filePath = bundle.name;
		let content = fs.readFileSync(filePath, 'utf8');
		content = content.replace(externalStartRe, '<script');
		content = content.replace(externalEndRe, '</script>');
		fs.writeFileSync(filePath, content);
	}
}

// Bundle iteration borrowed from parcel-plugin-html-root-syntax
function forEachBundle(fn, bundle) {
	fn(bundle);
	if (bundle.childBundles && bundle.childBundles.size) {
		for (let childBundle of bundle.childBundles) {
			fn(childBundle);
		}
	}
}

module.exports = function parcelPluginExternalScript(bundler) {
	bundler.on('bundled', bundle => {
		forEachBundle(replaceScriptTags, bundle);
	});
};
