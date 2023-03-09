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
  let result;
  if (token.type === 'link_open') {
    result = link.endsWith('.md') ? transformMarkdownLink(link, url) : undefined;
  } else if (token.type === 'image') {
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

// Root eleventy config export
module.exports = function(eleventyConfig) {
  // Add global data
  eleventyConfig.addGlobalData('meta', {
    url: process.env.URL || 'http://localhost:8080',
    siteName: 'Markipedia',
    siteDescription: ('Marcus Grant\'s personal Wikipedia, '
      + 'built with Eleventy & the Zettelkasten method.'),
    authorName: 'Marcus Grant',
  });

  eleventyConfig.addPlugin(require("eleventy-plugin-mathjax"));
  
  // Markdown-it customizations
  eleventyConfig.setLibrary('md', mdIt);

  // Add syntax highlighting plugin
  eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-syntaxhighlight"));

  // Add notes to collection
  eleventyConfig.addCollection('notes', function(collection) {
    return collection.getFilteredByGlob('site/notes/*.md')
      .sort(function(a, b) {
        return b.data.modified - a.data.modified;})
      .map(function(item){
        // Pull out the first markdown h1 header
        // debugger;
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
  });

  // Ignore all files except markdown in the notes folder
  eleventyConfig.setTemplateFormats(['liquid', 'md', 'njk', 'html', 'css', 'png', 'jpg', 'jpeg']);

  // Add debugger filter to debug data passed to templates
   eleventyConfig.addFilter('debugger', function(item) {
    console.log(item);
    debugger;
  });

  // Return object options
  return {
    dir: {
      input: 'site',
      output: '_site',
    }
  };
};