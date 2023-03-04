# Markipedia

[![Netlify Status](https://api.netlify.com/api/v1/badges/6ba39389-9b0a-40d7-b667-7a2f3c278f28/deploy-status)](https://app.netlify.com/sites/markipedia/deploys)

## Introduction

Markipedia is my personal Wikipedia that
is created using an [eleventy][11ty] static site generator.
The notes are all markdown notes with
some front matter that is managed by [my node utility scripts][mg-mdman-gh].
And those scripts are run on a pre-commit hook or web apps on
my private notes repository.
Then git hooks inform a build server that changes are made and
this project needs to regenerate the notes into my Wikipedia site.
The result is a personal Wikipedia like site where I can review my notes.

## Eleventy: Getting Started

*These steps below follow*
[Eleventy's Getting Started documentation][11ty-get-start]

### Make a Project Directory

```sh
# Using mkdir
mkdir eleventy
# Using gh or other git server cli
gh repo create
# Pick one of the above then...
cd eleventy
```

### Install Eleventy

#### Create a package.json

Installing 11ty into our project requires a `package.json` file for node to use.
Create it with `npm init`, `yarn init` or `pnpm init`.
The `-y` parameter just skips the questions.

```sh
# npm
npm init -y
# yarn
yarn init -y
# pnpm 
pnpm init -y
```

#### Install Eleventy into package.json

Now install and save 11ty into the project's `package.json`

```sh
# npm
npm install --save-dev @11ty/eleventy
# yarn
yarn add -D @11ty/eleventy
# pnpm
pnpm add -D @11ty/eleventy
```

### RUN ELEVENTY

We can use npx to run our local project's version of Eleventy.
Let’s make sure our installation went okay and try to run Eleventy:
**NOTE** We'll continue in `npm` for now on,*
*just use equivalents in `yarn` or `pnpm`.*

```sh
npx @11ty/eleventy
Wrote 0 files in 0.03 seconds (v1.0.2)
```

Make sure that you see (v1.0.2) in your output.
This lets you know you’re using the newest version.
However, Eleventy didn’t process any files!
This is expected—we have an empty folder with no templates inside.

### Create some Templates

A *template* is a content file written in
a [format such as Markdown, HTML, Liquid, Nunjucks, and more][11ty-templates],
which Eleventy transforms into a page (or pages) when building the site.
Let's run two commands to create two new template files.

```sh
echo '<!doctype html><html><head><title>Page title</title></head><body><p>Hi</p></body></html>' > index.html
echo '# Page header' > README.md
```

Now there's an HTML template & a markdown template.
Let's run Eleventy again:

```sh
npx @11ty/eleventy
Writing _site/README/index.html from ./README.md
Writing _site/index.html from ./index.html
Processed 2 files in 0.12 seconds (v1.0.2)
```

This will compile any content templates in the current directory or
subdirectories into the output folder (defaults to `_site`).

### Gaze upon your Templates

Use `--serve` to startup a hot reloading local web server.

```sh
npx @11ty/eleventy --serve
Writing _site/README/index.html from ./README.md
Writing _site/index.html from ./index.html
Processed 2 files in 0.12 seconds (v1.0.2)
Watching…

 (some output truncated)

[Browsersync] Serving files from: _site
```

Go to `http://localhost:8080/` or `http://localhost:8080/README/` to
see your Eleventy site live!
Make a change to your template files and save them.
Eleventy using BrowserSync will refresh the browser with
your new changes automatically.

>**Important Note:** Editing README.md won't refresh your browser automatically,
>because [Browsersync requires a `<body>` tag in your template][browsersync-docs]
>for live-reload to work properly.
>Use Layouts to add a `<body>` around your Markdown content.

Congratulations—you made something with Eleventy!
Now put it to work with templating syntax, front matter, and data files.

## Eleventy Configuration

This is where all the logic happens, **FILL IN DOCUMENTATION**.

### Debugger Filter

#### Using a Filter to Debug 11ty

A helpful filter to add to the configuration is one used for debugging.
It will trigger the `debugger` and
it will `console.log()` the object passed to it.
This will make it much easier to figure out the data structures used to
template pages and work with the generator functions.

So in a template you would use the `debugger` filter by
taking some data in the template,
then passing it to the `debugger` filter added in the configuration.

```liquid
{{ post.data | debugger }}
```

The `console.log` will then print out in the terminal what
the `post`'s `data` looks like.
And if you're on an editor with a node debugger like VSCode,
it will pause on the filter so you can examine what's going on.
First however,
you need to implement the `debugger` filter in the 11ty configuration.

```js
// .eleventy.js
module.exports = {
  // ...
  eleventyConfig.addFilter("debugger", (...args) => {
    console.log(...args)
    debugger;
  });
  // ...
};
```

#### Debugging with VSCode

Sure,
`console.log` is helpful,
but having a full blown debugger like the one built into VSCode is better.
To debug with VSCode you need to:

1. Create a directory inside the workspace called `./.vscode`
2. Create a file called `./.vscode/launch.json` inside that directory.
3. Add a debug task inside the `launch.json` file to run 11ty with the debugger.

```json
  {
      "name": "11ty",
      "type": "node",
      "request": "launch",
      "program": "${workspaceRoot}/node_modules/.bin/eleventy",
      "stopOnEntry": false,
      "args": [],
      "cwd": "${workspaceRoot}",
      "console": "internalConsole",
  }
```

If you want to have it debug while it's live or watching for file changes...

```json
  "args": ["--watch"],
```

This also works really well when you need to
debug collection logic and structure during the data cascade.

```js
// .eleventy.js
module.exports = {
  // ...
  eleventyConfig.addCollection("series", function(collection) {
    // i don't know whats in collection.
    debugger;
  });
  // ...
};
```

#### Eleventy Debugging: Further Reading

A lot of this section's tips came from these
[tips for debugging 11ty (from griffa.dev)][griffa-tips-debug-11ty].

## Eleventy Collections

**FILL IN DOCUMENTATION!**

### Advanced Filtering & Sorting of Collection

To add custom filtering and sorting of frontmatter in the files,
go into the `./.eleventy.js` file.
Then add a snippet kind of like the code below,
which will look at each file in the [glob pattern][glob-zk],
`site/notes/*.md`.
Then add an anonymous callback function that returns `collection.getFilteredByGlob`.
Chain that with a `sort` method since we know it's an array.
Now for the good stuff,
add a `debugger` statement so we can use a console to debug
the items that will get sorted.

```js
// ./.eleventy.js
module.exports = {
  // ...
  eleventyConfig.addCollection('notes', function(collection) {
    return collection.getFilteredByGlob('site/notes/*.md').sort(function(a, b) {
      debugger;
      return b.data.modified - a.data.modified;
    });
  });
  // ...
};
```

If we examine the list of objects during that debug statement,
we can use a debug console to bring up the contents of `a`.
There's a lot in there.
Let's list some interesting things:

* `data`: This is the frontmatter data of that file merged with 11ty data
  * `collections`: The collection relationships found by 11ty by default
    * These can be used to create links to different tags
  * `page`: Contains properties about this page in particular
    * `date`: 11ty's file or git based computation of modified/creation date
    * `filePathStem`: Relative file path w.r.t. the collection location.
      * In this case it would be `/notes/NOTE_FILE_NAME_WITHOUT_EXTENSION`
    * `fileSlug`: The filename slug without extension
      * In this case it would be `NOTE_FILE_NAME_WITHOUT_EXTENSION`
      * Like `filePathStem` but without the relative directories to collection
    * `url`: The suffix url computed for this file
      * In this case it would be `/notes/NOTE_FILE_NAME_WITHOUT_EXTENSION`
    * Then all other frontmatter properties present in that file.
      * In my case I have a script to update `modified` times
      * I want the most recent `modified` file to show up first

By using the `a.data.modified - b.data.modified` statement,
inside of the `sort()` function,
I can tell it to sort the collection by any frontmatter data I want.
In this case I have a `modified` property in every front matter file.
Scripts keep it up to date with any changes in the file system,
that's another matter.
By using the date within `a.data.modified` & `b.data.modified`,
I can create a negative or positive predicate to determine which date is newer.
If I want the newer modified note in `a` to appear earlier,
I need to return a **negative** number.
Since when subtracting dates,
the larger number is the newer date,
I need to subtract `a`'s date to `b`'s date,
resulting in a negative.

>This can of course be verified at this point in the debugger console,
>just type `b.data.modified - a.data.modifed` and the answer should be negative.

### Computing Data During Collection Stage

To add extra data that wouldn't otherwise be created by 11ty or its plugins,
it's best to do this during any `addCollection` function calls
in the 11ty configuration.

```js
// ./.eleventy.js
module.exports = {
// ...
  eleventyConfig.addCollection('notes', function(collection) {
    return collection.getFilteredByGlob('site/notes/*.md')
      .sort(function(a, b) {
        return b.data.modified - a.data.modified;})
      .map(function(item){
        // Pull out the first markdown h1 header
        // debugger;
        let { content } = item.template.frontMatter;
        const title = content.split(/^# (.*)/m)[1];
        item.data = { ...item.data, title };
        return item;
      });
  });
  // ...
};
```

Here we add to the `sort` step of the `getFilteredGlob` callback,
a `map` function callback to pull out a `title` from
the built-in `frontMatter.content` property.
Every page added in a collection is checked for frontmatter,
using [the gray-matter frontmatter parser][gh-gray-matter].
Part if that parsing, seperates the `content` of the file,
not including the frontmatter,
then stores only the `contents` within the `frontMatter` object.

Knowing this,
there's now data from the collections that can be accessed to
extract a title from the first *h1* or `#` header in markdown.
The [regex][regex-zk] `/^#\s(.*)/m` does a few things:

* `^`: Matches the beginning of the string.
  * Or in this case, due to the `m` flag, the beginning of a line.
* `#`: Matches the markdown *h1* header marker.
* `SPACE`: Matches the expected space after the `#` character.
* `()`: Capture group:
  * Groups these tokens together for matching as substring.
  * `.`: Matches any character except line breaks.
    * `*`: Match 0 or more of the preceeding `.` token.
      * *ie match 0 or more of any character except line breaks.*
* `/m`: Multiline flag, beginning/end anchors start/end according to line-break.

Put these together and you will capture only *h1* headers and their text.
And when using Javascript's `string` prototype function `split`,
you are left with only lines of text preceeding an *h1* header.
So if we pull out the second item from that split, `[1]`,
we are left with the first *h1* header of every file ready to store as `title`.

Then in a template that might want the title,
like say an index of all notes pages,
we simply do something like this to render the title into HTML.

```liquid
<h1>Most Recently Modified Notes</h1>
{%- for note in collections.notes -%}
  <a href="{{ note.url }}">
    <div>
      <h3>{{ note.data.title | 'Untitled' }}</h3>
      <div>
        <span>Last Updated: {{ note.data.modified | default: 'n/a' }}</span>
        <span>First Created: {{ note.data.created | default: 'n/a' }}</span>
      </div>
    </div>
  </a>
{%- endfor -%}
```

### Eleventy Collections: Further Reading

A lot of this information came from this
[part of 11ty's docs on custom filtering & sorting][11ty-collections-custom-filt-sort]

### Adding Global Data

It's possible to [add global data to a site][11ty-data-global].

```js
module.exports = function(eleventyConfig) {
  // Add global data
  eleventyConfig.addGlobalData('meta', {
    url: process.env.URL || 'http://localhost:8080',
    siteName: 'Markipedia',
    siteDescription: ('Marcus Grant\'s personal Wikipedia, '
      + 'built with Eleventy & the Zettelkasten method.'),
    authorName: 'Marcus Grant',
  });
```

## Markdown-It

### Install Markdown-It

Markdown-It is the default markdown parser for 11ty.
To install it:

```sh
npm install markdown-it
```

### Configure Markdown-It

Here is some example configuration for markdown-it.

```js
// ./.eleventy.js
const md = require('markdown-it')({
  html: true,
  linkify: true,
  // ... other options ...
});
```

### Markdown-It Plugins

To install a plugin for markdown-it,
you can use the `use` method on the markdown-it instance.

```js
// ./.eleventy.js
const md = require('markdown-it')({
  html: true,
  linkify: true,
  // ... other options ...
}).use(require('markdown-it-replace-link'));
```

In the next section is information on some of the specific plugin usages of
some of the more common ones I use.
Starting with the [markdown-it-replace-link][md-it-plug-replace-link] plugin.

### Markdown-It Replace Link

The plugin [markdown-it-replace-link][md-it-plug-replace-link] allows you to
insert special replacement functions for the incoming text of a link.
This happens when markdown-it is parsing the text of a link,
and it's about to create a link element.
To install it:

```sh
npm install markdown-it-replace-link
```

Then in your 11ty configuration,
Assuming the markdown link syntax below,
of text `Hello` & link URL `test`,
and the following eleventy configuration using this plugin.

```markdown
[Hello](test)
```

```js
// ./.eleventy.js
const md = require('markdown-it')({
  html: true,
  linkify: true,
  replaceLink: function(link, env, token, htmlToken){
    return 'https://example.com/' + link;
  }
  // ... other options ...
}).use(require('markdown-it-replace-link'));
```

Now every link in the markdown files will be prefixed with `https://example.com/`.
So the example markdown link above would become: `https://example.com/test`.

Images work as well, you just need to check the `token.type` property.
Then run the same procedure to change the link.

```js
// ./.eleventy.js
const md = require('markdown-it')({
  html: true,
  linkify: true,
  replaceLink: function(link, env, token, htmlToken){
    if (token.type === 'image') {
      return 'https://example.com/img/' + link;
    }
    return link;
  }
  // ... other options ...
}).use(require('markdown-it-replace-link'));
```

### Plugin-MathJax

The plugin [@mdit/plugin-mathjax][mdit-plug-mathjax] allows *markdown-it* to
render math equations using the [MathJax][mathjax-zk] syntax.
It is based on the [@mdit/plugin-tex][mdit-plug-tex] plugin.
Decide which subset of LaTeX you need, if only math expressions, then use
`@mdit/plugin-mathjax`.

#### Install Plugin-MathJax

To install the plugin, just use npm or equivalent.

```sh
npm install @mdit/plugin-mathjax
```

### Configure Plugin-MathJax

This plugin comes in three parts, two of which gets *used* in
the markdown-it `use` call.
First you need to call `createMathJaxInstance` to create the instance.
Second you need to `use` the `mathjax` object from the plugin and
the created instance.

```js
const MarkdownIt = require('markdown-it');
const {
  createMathJaxInstance,
  mathjax,
  generateMathjaxStyle,
} = require('@mdit/plugin-mathjax');

mathJaxOptions = {
  // ... options ...
};

const mathjaxInstance = createMathJaxInstance(mathJaxOptions);
const mdIt = MarkdownIt().use(mathjax, mathjaxInstance);

const html = mdIt.render('$$E = mc^2$$')
const style = generateMathjaxStyle(mathjaxInstance);
```

### Markdown-It Plugin: MathJax3

#### Install

```sh
npm install markdown-it markdown-it-mathjax3
```

#### Use
  
```js
var md = require('markdown-it')(),
    mathjax3 = require('markdown-it-mathjax3');

md.use(mathjax3);

// double backslash is required for javascript strings, but not html input
var result = md.render('# Math Rulez! \n  $\\sqrt{3x-1}+(1+x)^2$');
```

### Eleventy-Plugin-MathJax

In the end I found this plugin the easiest to use.
Though I would have preferred to use a markdown-it plugin,
but being based on eleventy it's reasonable to expect more simplicity and
tighter coupling to the workflow of the project.

#### Install

```sh
npm install eleventy-plugin-mathjax
```

#### Use

```js
// ./.eleventy.js
module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(require('eleventy-plugin-mathjax'));
};
```

https://github.com/tsung-ju/eleventy-plugin-mathjax

## References

### Web Links

* [Eleventy (11ty) Homepage][11ty]
* [mdman: Markdown Frontmatter file utilities (from Github)][mg-mdman-gh]
* [Getting Started (from 11ty.dev/docs)][11ty-get-start]
* [Template Languages (from 11ty.dev/docs)][11ty-templates]
* [BrowserSync Docs: Requirements (from browsersync.io)][browsersync-docs]
* [Layouts (from 11ty.dev/docs)][11ty-layouts]
* [Collections: Custom Filtering & Sorting (from 11ty.dev/docs)][11ty-collections-custom-filt-sort]
* [Tips for Debugging 11ty (from griffa.dev)][griffa-tips-debug-11ty]
* [Transform (from 11ty.dev/docs)][11ty-docs-config-transform]
* [gray-matter: Frontmatter YAML parser (from Github by jonschlinkert)][gh-gray-matter]
* [Global Data (from 11ty.dev/docs)][11ty-data-global]
* [Why I Migrated from Gatsby to Eleventy (from marcradziwill by Marc Radziwill)][why-gatsby-to-11ty-radziwill]
* [markdown-it-replace-link: Markdown-It plugin for replacing links (from GitHub by Martin Heidegger)][md-it-plug-replace-link]
* [Markdown-It Plugins: @mdit/plugin-mathjax][mdit-plug-mathjax]
* [Markdown-It Plugins: @mdit/plugin-tex][mdit-plug-tex]
* [Markdown It Plugin: MathJax3 (from npmjs.com by nzt)][mdit-mathjax3]

<!-- Hidden Reference Links Below Here -->
[11ty]: 11ty.dev "Eleventy (11ty) Homepage"
[mg-mdman-gh]: https://github.com/marcus-grant/mdman "mdman: Markdown Frontmatter file utilities (from Github)"
[11ty-get-start]: https://www.11ty.dev/docs/getting-started/ "Getting Started (from 11ty.dev/docs)"
[11ty-templates]: https://www.11ty.dev/docs/languages/ "Template Languages (from 11ty.dev/docs)"
[browsersync-docs]: https://browsersync.io/docs/#requirements "BrowserSync Docs: Requirements (from browsersync.io)"
[11ty-layouts]: https://www.11ty.dev/docs/layouts/ "Layouts (from 11ty.dev/docs)"
[11ty-collections-custom-filt-sort]: https://www.11ty.dev/docs/collections/#advanced-custom-filtering-and-sorting "Collections: Custom Filtering & Sorting (from 11ty.dev/docs)"
[griffa-tips-debug-11ty]: https://griffa.dev/posts/tips-for-debugging-in-11ty/ "Tips for Debugging 11ty (from griffa.dev)"
[11ty-docs-config-transform]: https://www.11ty.dev/docs/config/#transforms "Transform (from 11ty.dev/docs)"
[gh-gray-matter]: https://github.com/jonschlinkert/gray-matter "gray-matter: Frontmatter YAML parser (from Github by jonschlinkert)"
[11ty-data-global]: https://www.11ty.dev/docs/data-global/ "Global Data (from 11ty.dev/docs)"
[why-gatsby-to-11ty-radziwill]: ./https://marcradziwill.com/blog/why-i-migrated-my-website-from-gatsbyjs-to-eleventy/ "Why I Migrated from Gatsby to Eleventy (from marcradziwill by Marc Radziwill)"
[md-it-plug-replace-link]: https://github.com/martinheidegger/markdown-it-replace-link "markdown-it-replace-link: Markdown-It plugin for replacing links (from GitHub by Martin Heidegger)"
[mdit-plug-mathjax]: https://mdit-plugins.github.io/mathjax.html "Markdown-It Plugins: @mdit/plugin mathjax"
[mdit-plug-tex]: https://mdit-plugins.github.io/tex.html "Markdown-It Plugins: @mdit/plugin-tex"
[mdit-mathjax3]: https://www.npmjs.com/package/markdown-it-mathjax3 "Markdown It Plugin: MathJax3 (from npmjs.com by nzt)"

### Note Links

* [Glob Patterns][glob-zk]
* [Regular Expressions][regex-zk]
* [MathJax][mathjax-zk]

<!-- Hidden Reference Links Below Here -->
[glob-zk]: glob-pattern.md "Glob Patterns"
[regex-zk]: regex.md "Regular Expressions"
[mathjax-zk]: mathjax.md "MathJax"
