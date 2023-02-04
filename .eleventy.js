module.exports = function(eleventyConfig) {
  // Add debugger filter to debug data passed to templates
   eleventyConfig.addFilter('debugger', function(item) {
    console.log(item);
    debugger;
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
  // Get static assets like images
  eleventyConfig.addPassthroughCopy('site/notes/*.jpg');
  eleventyConfig.addPassthroughCopy('site/notes/*.jpeg');
  eleventyConfig.addPassthroughCopy('site/notes/*.png');
  eleventyConfig.addPassthroughCopy('site/notes/*.svg');
  // Return object options
  return {
    dir: {
      input: 'site',
      output: '_site',
    },
  };
};