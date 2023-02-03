module.exports = function(eleventyConfig) {
  // Add notes to collection
  // eleventyConfig.addFilter('debugger', function(...args) {
  //   console.log(args);
  //   debugger;
  // });
  eleventyConfig.addCollection('notes', function(collection) {
    return collection.getFilteredByGlob('site/notes/*.md').sort(function(a, b) {
      // debugger;
      return b.data.modified - a.data.modified;
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
    }
  };
};