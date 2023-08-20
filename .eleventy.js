const tailwind = require('tailwindcss');
const postCss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const bundlerPlugin = require("@11ty/eleventy-plugin-bundle");
// const pluginTailwindCSS = require("eleventy-plugin-tailwindcss");
const lodash = require("lodash");
const {DateTime} = require("luxon");

module.exports = function(eleventyConfig) {
	eleventyConfig.addCollection("postsByYear", (collection) => {
		return lodash.chain(collection.getFilteredByTags("blog"))
			.sortBy((pair) => pair.date)
			.reverse()
			.groupBy((post) => post.date.getFullYear())
			.toPairs()
			.reverse()
			.value();
	});

	eleventyConfig.addFilter("toUTCString", function(value) { return DateTime.fromJSDate(value, {zone: 'utc'}).toLocaleString(DateTime.DATE_FULL) });

	eleventyConfig.addPlugin(bundlerPlugin);
	eleventyConfig.addPlugin(pluginWebc, {
		components: "src/_includes/components/**/*.webc",

	});

	eleventyConfig.addPassthroughCopy("src/style.css")
	eleventyConfig.addWatchTarget('./src/_includes/styles/tailwind.css');
	eleventyConfig.addNunjucksAsyncFilter('postcss', postcssFilter);
	return {
		passthroughFileCopy: true,
		dir: {
			input: "src",
			includes: "_includes",
			data: "_data",
			output: "_site",
		},
	};
};

const postcssFilter = (cssCode, done) => {
	// we call PostCSS here.
	postCss([tailwind(require('./tailwind.config')), autoprefixer(), cssnano({ preset: 'default' })])
		.process(cssCode, {
			// path to our CSS file
			from: './src/_includes/styles/tailwind.css'
		})
		.then(
			(r) => done(null, r.css),
			(e) => done(e, null)
		);
};
