module.exports = function(eleventyConfig) {
  // Add global data
  eleventyConfig.addGlobalData('meta', {
    url: process.env.URL || 'http://localhost:8080',
    siteName: 'Markipedia',
    siteDescription: ('Marcus Grant\'s personal Wikipedia, '
      + 'built with Eleventy & the Zettelkasten method.'),
    authorName: 'Marcus Grant',
  });

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

  //Modify any image paths to be relative to the root
  eleventyConfig.addTransform('imgPath', function(content, outputPath) {
    if (outputPath && outputPath.endsWith('.html')) {
      const imgPathRegex = /(<img.*?src=")(.*?)"/g;
      content = content.replace(imgPathRegex, function(_, p1, p2) {
        // If the path has a current relative directory mark,
        // replace it with a parent dir mark
        let newTag = '';
        if (p2.startsWith('./')) {
          newTag = `${p1}${p2.replace('./', '../')}"`;
        } // If the path has no relative directory mark, add a parent dir mark
        else if (!p2.startsWith('../')) {
          newTag = `${p1}../${p2}"`;
        } else { // Otherwise just return the original tag
          newTag = `${p1}${p2}"`;
        } return newTag;
      });
    }

    return content;
  });

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