const transformMarkdownLink = function(link, url) {
  const noteUrl = `${url}/notes/`;
  return noteUrl + link.replace(/\.md$/, '') // Remove the .md extension
                      .replace(/^\.\//, '') // Remove ./ prefix if it exists
                      .replace(/\.\.\//g, ''); // Remove parent prefix (../)
};

const transformImageLink = function(link, url) {
  let linkSuffix = link;
  const linkPrefix = `${url}/notes/`; // Define base/prefix part of URL
  // While the link contains a ./ or ../ prefix, remove it
  while(linkSuffix.startsWith('./') || linkSuffix.startsWith('../')) {
    linkSuffix = linkSuffix.replace('./', '');
    linkSuffix = linkSuffix.replace('../', '');
  } return linkPrefix + linkSuffix; // Combine the base/prefix and suffix of link
}

const replaceLink = function(link, env, token) {
  const { url } = env.meta;
  let result = link;
  if (token.type === 'link_open' && link.includes('.md')) {
      result = transformMarkdownLink(link, url);
  } 
  else if (token.type === 'image') {
    result = transformImageLink(link, url);
  }
  return result;
};

const mdOptions = {
  html: true,
  linkify: true,
  replaceLink: replaceLink,
};

const mdIt = require('markdown-it')({
  html: true,
  linkify: true,
  replaceLink,
}).use(
  require('markdown-it-replace-link'),
);

// Compute build datetime
const now = new Date();
const nowIso = now.toISOString();
const nowKebab = nowIso.replace(/:/g, '-').replace(/\./g, '-');

// Util functions, move to util module with subdirs
// Capitalize first letter of string
const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const tagHelpers = require('./utils/tag-helpers.js');

// Root eleventy config export
module.exports = function(eleventyConfig) {
  // Add global data
  eleventyConfig.addGlobalData('meta', {
    buildDateIso: nowIso,
    buildDateKebab: nowKebab,
  });

  eleventyConfig.addPlugin(require("eleventy-plugin-mathjax"), {
    output: 'chtml',
    chtml: {
      fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2',
    },
  });
  
  // Markdown-it customizations
  eleventyConfig.setLibrary('md', mdIt);

  // Add syntax highlighting plugin
  eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-syntaxhighlight"));

  // Add notes to collection
  eleventyConfig.addCollection('notes', function(collection) {
    const notesCollection =
      collection.getFilteredByGlob('site/notes/*.md')
      .sort(function(a, b) {
        return b.data.modified - a.data.modified;})
      .map(function(item){
        if (item.data.title) {
          return item;
        }
        
        let title = 'Untitled!';
        const h1 = item.template.frontMatter.content.split(/^# (.*)/m)[1];
        if (!h1 || h1 === '' || h1.length > 80) {
          title = 'Untitled!';
        } else { title = h1; }

        item.data = { ...item.data, title };

        return item;
      });
    return notesCollection;
  });

  eleventyConfig.addCollection('tags', function(collection) {
    const taggedNotesCollection = collection
      .getFilteredByGlob('site/notes/*.md')
      .filter((item) => !!item.data.tags);
    const allTags = tagHelpers.allTags(taggedNotesCollection);
    const tagsCollection = allTags
      .map((tag) => (
        {
          tag,
          items: tagHelpers.filterByTag(taggedNotesCollection, tag),
          count: tagHelpers.countTag(taggedNotesCollection, tag),
          associatedTags: tagHelpers.findAssociatedTags(taggedNotesCollection, tag),
        }
      )).sort((tagObjA, tagObjB) => tagObjB.count - tagObjA.count);
    return tagsCollection;
  });

  // Ignore all files except markdown in the notes folder
  eleventyConfig.setTemplateFormats(['liquid', 'md', 'njk', 'html', 'css',
    'png', 'jpg', 'jpeg', 'svg', 'gif', 'webp', 'ico', 'woff', 'woff2', 'ttf', 'oft']);

  // Add debugger filter to debug data passed to templates
   eleventyConfig.addFilter('debugger', function(item) {
    console.log(item);
    debugger;
  });

  // Capitalize first letter of string
  eleventyConfig.addFilter('capitalizeFirst', capitalizeFirst);

  // Date filters
  const dateHelpers = require('./utils/date-helpers.js');
  eleventyConfig.addFilter('shortDateString', dateHelpers.shortDateString);

  // Filter by keys of object
  // TODO: DELETEME these might not be necessary after the tags collection
  const tagHelpers = require('./utils/tag-helpers.js')
  eleventyConfig.addFilter('allTags', tagHelpers.allTags);
  eleventyConfig.addFilter('filterByTag', tagHelpers.filterByTag);
  eleventyConfig.addFilter('countTag', tagHelpers.countTag);
  eleventyConfig.addFilter('countAllTags', tagHelpers.countAllTags);
  eleventyConfig.addFilter('sortAllTagsByCount', tagHelpers.sortAllTagsByCount);

  // Object keys filter
  eleventyConfig.addFilter('keys', obj => Object.keys(obj)); 

  // Tailwind CSS
  eleventyConfig.addWatchTarget('./styles/');
  eleventyConfig.addWatchTarget('./styles/tailwind.config.js');
  eleventyConfig.addPassthroughCopy({ './_tmp/style.css': './style.css' })
  eleventyConfig.addShortcode('version', function () {
    return nowStr;
  })

  // Return object options
  return {
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'site',
      output: '_site',
    }
  };
};