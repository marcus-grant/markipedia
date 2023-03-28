# Markipedia

[![Netlify Status](https://api.netlify.com/api/v1/badges/6ba39389-9b0a-40d7-b667-7a2f3c278f28/deploy-status)](https://app.netlify.com/sites/markipedia/deploys)

## Introduction

***TODO:*** A lot of these links could be note links, change them.
***TODO:*** A lot of words here reference concepts that have note links, apply them.

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

### Overview

***TODO:*** Add notes about all parts of
[this](https://www.11ty.dev/docs/config/) documentation page on the configs.

Configuration files are optional.
Add an `.eleventy.js` file to the root of your project directory to
configure Eleventy to your own project’s needs.
It might look like this:

```js
module.exports = function(eleventyConfig) {
  // Return your Object options:
  return {
    dir: {
      input: "views",
      output: "dist"
    }
  }
}
```

Returns are either object literals or callback functions.
Callback functions are preferred and
allow further customization using Eleventy's provided helper methods.

* Add [Filters][11ty-docs-filters]
* Add [Shortcodes][11ty-docs-shortcodes]
* Add [Javascript Functions][11ty-docs-js-funcs]
* Add custom [Collections][11ty-docs-collections]
* Add some [Plugins][11ty-docs-plugs]

### Configuration Options

#### Input Directory

Controls the top level directory/file/glob

## Templates

### Templates Overview

***TODO:*** *This includes notes on Nunjucks*
*Add note links to nunjucks and jinja explaining their similarities and differences*.

### Include/Extend Templates

Templates can be used as components to a larger composition of templates.
You might have a navigation bar template that is included in every site template.
You might also have a `main` HTML tag wrapper template.

To use another template in another template,
first you need to have an `_includes` directory in the root of one of
your Eleventy input directories and configurations.
Then you can use the `include` tag to include another template.

Below we'll define a `./_includes/hello.njk` template:

```njk
{# ./_includes/hello.njk #}
<h1>Hello World!</h1>
```

We could include it in our site index template by
using the template engine's `include` or `extends` tag.
It's a bit different for each template engine, there's a table below showing them.
Below is the root index template of the site using nunjucks,
it uses `include` to pull in the templates of `hello.njk`.

```njk
{# ./index.njk #}
<html>
  <body>
    {% include "hello.njk" %}
    <p>This is my site.</p>
  </body>
</html>
```

This results in the following HTML:

```html
<!-- ./_site/index/index.html -->
<html>
  <body>
    <h1>Hello World!</h1>
    <p>This is my site.</p>
  </body>
</html>
```

### Template Engine Include/Extend Tags

| Engine     | Include Tag                   | Extend Tag                    |
| ---------- | ----------------------------- | ----------------------------- |
| Nunjucks   | `{% include "hello.njk" %}`   | `{% extends "hello.njk" %}`   |
| Liquid     | `{% include "hello.njk" %}`   | `{% extends "hello.njk" %}`   |
| EJS        | `<%- include("hello.njk") %>` | `<%- include("hello.njk") %>` |
| Pug        | `include hello.njk`           | `include hello.njk`           |
| Handlebars | `{{> hello.njk}}`             | `{{> hello.njk}}`             |
| Mustache   | `{{> hello.njk}}`             | `{{> hello.njk}}`             |

### Layout Chaining

#### Layout Chaining Overview

Your layouts can use other layouts, in a chain of layout templates.
Add the same `layout` front matter data to your layout template and it'll chain.
You don't have to use the same template engine for each layout.

```markdown
<!--layout-chain-example.md-->
---
layout: mainlayout.njk
title: My Blog
---
# My Blog
```

We want to add a main element around our post's content because like accessibility.

Here's what `mainlayout.njk` would look like:

```njk
{# mainlayout.njk #}
---
layout: mylayout.njk
myOtherData: hello
---
<main>{{ content | safe }}</main>
```

This layout would then be itself wrapped in the same `mylayout.njk` from
the previous example.

```njk
{# ./_includes/mylayout.njk #}
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
  </head>
  <body>
    {{ content | safe }}
  </body>
</html>
```

Together, this *layout chain* renders the below HTML output:

```html
<!--./_site/layout-chain-example/index.html-->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Rad Blog</title>
  </head>
  <body>
    <main>
      <h1>My Rad Markdown Blog Post<h1>
    </main>
  </body>
</html>
```

#### Layout Chaining Further Reading

More detailed documentation exists on Eleventy's
[documentation on layout chaining][11ty-docs-layout-chain].

#### Eleventy Debugging: Further Reading

A lot of this section's tips came from these
[tips for debugging 11ty (from griffa.dev)][griffa-tips-debug-11ty].

### Pagination via Template Front Matter

Front matter can be used to paginate collections.
As in constructing a page from processing the data within a collection.

```njk
{# ./index.njk #}
---
pagination:
  data: collections
  size: 1
  alias: tag
permalink: /tags/{{ tag | slug }}/
---
<h1>Posts tagged with {{ tag }}</h1>
```

This template will be used to render a page for each tag in the collection.
The `pagination` front matter data is used to paginate the collection.
The `permalink` front matter data is used to set the permalink for each page.
Note that you can reference the aliased `tag` variable in the permalink which
comes from the pagination alias.

## Filters

### Filter Basics

Filters are functions that can be used in templates to transform data.
They are especially useful when accessed through templates.
They can be assigned in the configuration file,
or in the template itself.

```js
// .eleventy.js
module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("myFilter", function(value) {
    return value.toUpperCase();
  });
};
```

This filter `myFilter` simply takes incoming data and returns it in all caps.
It can be used in a template like so:

```njk
{# ./index.njk #}
{{ "hello world" | myFilter }}
```

Which results in the following HTML:

```html
<!-- ./_site/index/index.html -->
HELLO WORLD
```

### Accessing Collections in Filters

Filters can be used to access collections.
This is useful for filtering collections,
or grouping, sorting, mapping or otherwise transforming them.

```js
// .eleventy.js
module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("myFilter", function(collection) {
    return collection.filter(item => item.data.tags.includes("myTag"));
  });
};
```

This filter `myFilter` takes a collection and returns only the items
that have the tag `myTag`.
It can be used in a template like so:

```njk
{# ./index.njk #}
{% for post in collections.posts | myFilter %}
  <h1>{{ post.data.title }}</h1>
{% endfor %}
```

Which filters the posts collection to only include posts with the tag `myTag`.

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

## Data Cascade

The data cascade is a way to add data to a page,
that will be available to the page's template.
It can also be used to alter collections or global site data and
paginate said data.

### Data Cascade: Further Reading

* [11ty's docs on the data cascade][11ty-data-cascade]
* [Ben Myer's Explanation of the Data Cascade][11ty-data-cascade-benmyers]

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

## Eleventy Plugins

### Eleventy-Plugin-SyntaxHighlight

#### Syntax Highlighting Plugin

A pack of 11ty plugins for PrismJS

#### Install Highlight Plugin

```sh
npm install @11ty/eleventy-plugin-syntaxhighlight --save-dev
```

```js
// ./.eleventy.js
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
};
```

### Eleventy-Plugin-MathJax

In the end I found this plugin the easiest to use.
Though I would have preferred to use a markdown-it plugin,
but being based on eleventy it's reasonable to expect more simplicity and
tighter coupling to the workflow of the project.

#### Install Eleventy-Plugin-MathJax

```sh
npm install eleventy-plugin-mathjax
```

#### Use Eleventy-Plugin-MathJax

```js
// ./.eleventy.js
module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(require('eleventy-plugin-mathjax'));
};
```

#### More Info on Eleventy-Plugin-MathJax

* [Eleventy-Plugin-MathJax on Github][plug-mathjax-11ty]

## External Workflows

### TailwindCSS in Eleventy

#### TailwindCSS Introduction

***TODO:*** *Add TailwindCSS note when ready to move this to markipedia.*

TailwindCSS is a utility-first CSS framework for rapidly building custom designs.
It focuses on the design aspect of the CSS,
instead of creating a framework of pre-defined components.
Opting instead to give *utility classes* to the developer,
to compose together to create the desired design.

#### Initialize TailwindCSS

First you need the TailwindCSS package.

```sh
npm install --save-dev tailwindcss@latest
```

Then you need to initialize the TailwindCSS configuration file along with
a `./styles/` directory *(optional)*.
Here we'll put the TailwindCSS config file in `./tailwind.config.js` and
define it with starting configurations like this.

```js
// ./styles/tailwind.config.js
module.exports = {
  content: ['_site/**/*.html'],
  safelist: [],
  theme: {
    extend: {
      colors: {
        change: 'transparent',
      },
    },
  },
  plugins: [],
};
```

Then create a root stylesheet file `./styles/tailwind.css` and
import the first sets of tailwindcss styles.

```css
/* ./styles/tailwind.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .change {
    color: transparent;
  }
}
```

#### Configure Eleventy to use TailwindCSS

To use TailwindCSS with Eleventy,
we need to add a few things to the Eleventy configuration file.
Eleventy needs to know to watch file changes in the `./styles/` directory,
to do this we add a `addWatchTarget` call to the configuration file.
Then we repeat it for the `tailwind.config.js` file,
as changes there should trigger development server rebuilds.

```js
const now = Date.now()
const nowStr = String(now)
module.exports = function(eleventyConfig) {
  eleventyConfig.addWatchTarget('./styles/');
  eleventyConfig.addWatchTarget('./styles/tailwind.config.js');
  eleventyConfig.addPassthroughCopy({ './_tmp/style.css': './style.css' })
  eleventyConfig.addShortcode('version', function () {
    return nowStr;
  })
};
```

The `addPassthroughCopy` call is to copy the generated `./_tmp/style.css` file
to the root directory of the site,
so that the eleventy development server can hot reload the changes.
Finally, the `addShortcode` call is to add a short-code for eleventy to use,
it adds a version string based on the current time,
making it easier to track changes to stylesheets.

### Configure Node Scripts

Next, to make it easier to run the TailwindCSS build process along with Eleventy,
modify the `package.json` file to add a few scripts.

```json
{
  "scripts": {
    "build": "eleventy && npm run build:css",
    "build:css": "postcss ./styles/tailwind.css -o ./_tmp/style.css",
    "dev": "eleventy --serve",
    "dev:css": "postcss ./styles/tailwind.css -o ./_tmp/style.css --watch"
  }
}
```

## TailwindCSS

### Typography

#### Typography Plugin Overview

The official Tailwind CSS Typography plugin adds a rich set of
typographic utilities to your project.
It also provides a set of `prose` classes you can use to
add beautiful typographic defaults to any HTML you don't control,
like HTML rendered Markdown from static site generators or a CMS.

#### Typography Plugin Init

Install the plugin in your project with npm.

```sh
npm install -D @tailwindcss/typography
```

Then add the plugin to the tailwind configuration file `./styles/tailwind.config.js`.

```js
// ./styles/tailwind.config.js
module.exports = {
  // ...
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ],
};
```

#### Usage

The `prose` classes that `@tailwindcss/typography` provides are designed to
be applied to a container element that wraps content you don't control,
like Markdown rendered from a static site generator or a CMS.
Typically the `article` HTML element is a good choice for this,
but any will do where it's a parent element that you can pass classes to.

```html
<article class="prose lg:prose-xl">
  <!-- This content is assumed loaded from another source -->
  <h1>Hello World!</h1>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </p>
</article>
```

#### Choosing a Gray Scale

This plugin has a modifier class for
each of the give gray scales Tailwind includes by default.
So it's easy to use one of them for the whole section of content.

```html
<article class="prose prose-slate">
  {{ markdown | safe }}
</article>
```

These are the classes generated by default since Tailwind *2.0*.

| Class               | Gray-scale |
| ------------------- | ---------- |
| prose-gray(default) | Gray       |
| prose-slate         | Slate      |
| prose-zinc          | Zinc       |
| prose-neutral       | Neutral    |
| prose-stone         | Stone      |

***TODO:*** *Add this link and some notes about it in the CSS Note page.*

Modifier classes are designed to be used with
the [multi-class modifier pattern][multi-class-mod-pattern-gallagher]
and must be used in conjunction with the base `prose` class.

>**Note:** The `prose` class is required for specifying a modifier class.

#### Type Scale

Size modifier classes make it possible to adjust overall size of
the typography of the child elements in different contexts.

```html
<article class="prose prose-xl">
  {{ markdown }}
</article>
```

Five different typography scales are included out of the box:

| Class      | Body font size        |
| ---------- | --------------------- |
| prose-sm   | 0.875rem (14px)       |
| prose-base | 1rem (16px) (default) |
| prose-lg   | 1.125rem (18px)       |
| prose-xl   | 1.25rem (20px)        |
| prose-2xl  | 1.5rem (24px)         |

***TODO:*** *Add this link and some notes about it in the Tailwind Note page.*

These classes can be used in combination with
[breakpoint modifiers][resp-design-tailwind-docs]
to change the overall font size of a piece of content at different viewport sizes.

```html
<article class="prose md:prose-lg prose-blue lg:prose-xl">
  {{ markdown }}
</article>
```

Everything about the provided size modifiers has been hand-tuned by
professional designers to look as beautiful as possible,
including the relationships between font sizes,
heading spacing, code block padding and more.

Size modifiers are designed to be used with
the [multi-class modifier pattern][multi-class-mod-pattern-gallagher]
and must be used in conjunction with the base `prose` class.

#### Element Modifiers

To customize the style of different types of elements in your content,
use element modifiers.

```html
<article class="prose prose-img:rounded-xl prose-headings:underline prose-a:text-blue-600">
  {{ markdown }}
</article>
```

This makes it easy to do things like style links to match your brand,
add border radius to images, and a lot more.

Here's a complete list of available elements modifiers:

| Modifier                     | Target             |
| ---------------------------- | ------------------ |
| `prose-headings:{utility}`   | h1, h2, h3, h4, th |
| `prose-lead:{utility}`       | [class~="lead"]    |
| `prose-h1:{utility}`         | h1                 |
| `prose-h2:{utility}`         | h2                 |
| `prose-h3:{utility}`         | h3                 |
| `prose-h4:{utility}`         | h4                 |
| `prose-p:{utility}`          | p                  |
| `prose-a:{utility}`          | a                  |
| `prose-blockquote:{utility}` | blockquote         |
| `prose-figure:{utility}`     | figure             |
| `prose-figcaption:{utility}` | figcaption         |
| `prose-strong:{utility}`     | strong             |
| `prose-em:{utility}`         | em                 |
| `prose-code:{utility}`       | code               |
| `prose-pre:{utility}`        | pre                |
| `prose-ol:{utility}`         | ol                 |
| `prose-ul:{utility}`         | ul                 |
| `prose-li:{utility}`         | li                 |
| `prose-table:{utility}`      | table              |
| `prose-thead:{utility}`      | thead              |
| `prose-tr:{utility}`         | tr                 |
| `prose-th:{utility}`         | th                 |
| `prose-td:{utility}`         | td                 |
| `prose-img:{utility}`        | img                |
| `prose-video:{utility}`      | video              |
| `prose-hr:{utility}`         | hr                 |

When stacking these modifiers with others like `hover`,
you likely want the other modifier to come first:

```html
<article class="prose prose-a:text-blue-600 hover:prose-a:text-blue-500">
  {{ markdown }}
</article>
```

Read the Tailwind CSS documentation on
[ordering stacked modifiers][order-mod-stack-tailwind-docs]
to learn more.

#### Overriding max-width

Each size modifier comes with a baked in `max-width` value.
It is designed to keep the content as readable as possible.
This isn't always the desired behavior, so you can override it,
for example to fill the width of its container.

In those cases, add `max-w-none` to the content to override the embedded `max-width`:

```html
<div class="grid grid-cols-4">
  <div class="col-span-1">
      <!-- ... -->
  </div>
  <div class="col-span-3">
    <article class="prose max-w-none">
      {{ markdown }}
    </article>
  </div>
</div>
```

#### Undoing Typography Styles

If you have a block of markup embedded in
some content that shouldn’t inherit the `prose` styles,
use the `not-prose` class to sandbox it:

```html
<article class="prose">
  <h1>My Heading</h1>
  <p>...</p>

  <div class="not-prose">
    <!-- Some example or demo that needs to be prose-free -->
  </div>

  <p>...</p>
  <!-- ... -->
</article>
```

Note that you can’t nest new `prose` instances within
a `not-prose` block at this time.

#### Adding CUstom Color Themes

You can create your own color theme by adding a new key in the typography section of
your `tailwind.config.js` file and providing your colors under the css key:

```js
// ./tailwind.config.js
module.exports = {
  theme: {
    extend: {
      typography: ({ theme }) => ({
        pink: {
          css: {
            '--tw-prose-body': theme('colors.pink[800]'),
            '--tw-prose-headings': theme('colors.pink[900]'),
            '--tw-prose-lead': theme('colors.pink[700]'),
            '--tw-prose-links': theme('colors.pink[900]'),
            '--tw-prose-bold': theme('colors.pink[900]'),
            '--tw-prose-counters': theme('colors.pink[600]'),
            '--tw-prose-bullets': theme('colors.pink[400]'),
            '--tw-prose-hr': theme('colors.pink[300]'),
            '--tw-prose-quotes': theme('colors.pink[900]'),
            '--tw-prose-quote-borders': theme('colors.pink[300]'),
            '--tw-prose-captions': theme('colors.pink[700]'),
            '--tw-prose-code': theme('colors.pink[900]'),
            '--tw-prose-pre-code': theme('colors.pink[100]'),
            '--tw-prose-pre-bg': theme('colors.pink[900]'),
            '--tw-prose-th-borders': theme('colors.pink[300]'),
            '--tw-prose-td-borders': theme('colors.pink[200]'),
            '--tw-prose-invert-body': theme('colors.pink[200]'),
            '--tw-prose-invert-headings': theme('colors.white'),
            '--tw-prose-invert-lead': theme('colors.pink[300]'),
            '--tw-prose-invert-links': theme('colors.white'),
            '--tw-prose-invert-bold': theme('colors.white'),
            '--tw-prose-invert-counters': theme('colors.pink[400]'),
            '--tw-prose-invert-bullets': theme('colors.pink[600]'),
            '--tw-prose-invert-hr': theme('colors.pink[700]'),
            '--tw-prose-invert-quotes': theme('colors.pink[100]'),
            '--tw-prose-invert-quote-borders': theme('colors.pink[700]'),
            '--tw-prose-invert-captions': theme('colors.pink[400]'),
            '--tw-prose-invert-code': theme('colors.white'),
            '--tw-prose-invert-pre-code': theme('colors.pink[300]'),
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-invert-th-borders': theme('colors.pink[600]'),
            '--tw-prose-invert-td-borders': theme('colors.pink[700]'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ],
}
```

See our internal
[style definitions](https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js)
for some more examples.

#### Changing the Default Class Name

If you need to use a class name other than `prose` for any reason,
you can do so using the `className` option when registering the plugin:

```js
// ./tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('@tailwindcss/typography')({
      className: 'wysiwyg',
    }),
  ]
  ...
}
```

Now every instance of `prose` in
the default class names will be replaced by your custom class name:

```html
<article class="wysiwyg wysiwyg-slate lg:wysiwyg-xl">
  <h1>My Heading</h1>
  <p>...</p>

  <div class="not-wysiwyg">
    <!-- Some example or demo that needs to be prose-free -->
  </div>

  <p>...</p>
  <!-- ... -->
</article>
```

​

#### Customizing the CSS

If you want to customize the raw CSS generated by this plugin,
add your overrides under the `typography` key in
the `theme` section of your `tailwind.config.js` file:

```js
// ./tailwind.config.js
module.exports = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#333',
            a: {
              color: '#3182ce',
              '&:hover': {
                color: '#2c5282',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ],
}
```

Like with all theme customizations in Tailwind,
you can also define the `typography` key as a function if
you need access to the `theme` helper:

```js
// ./tailwind.config.js
module.exports = {
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),

            // ...
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ],
}
```

Customizations should be applied to a specific modifier like `DEFAULT` or `xl`,
and must be added under the `css` property.
Customizations are authored in
the same [CSS-in-JS syntax](https://tailwindcss.com/docs/plugins#css-in-js-syntax)
used to write Tailwind plugins.

### Further Reading

***TODO:*** *Add TailwindCSS note link*

* [Add TailwindCSS to Eleventy (by Greg Wolanski from CSS-Tricks)][11ty-tailwind-csstricks]
* [An Eleventy Starter with Tailwind CSS & Alpine.js (by Greg Wolanski from CSS-Tricks)][11ty-tailwind-csstricks]
[11ty-tailwind-csstricks]: https://css-tricks.com/eleventy-starter-with-tailwind-css-alpine-js/ "An Eleventy Starter with Tailwind CSS & Alpine.js (by Greg Wolanski from CSS-Tricks)"

## References

### Web Links

* [Eleventy (11ty) Homepage][11ty]
* [mdman: Markdown Frontmatter file utilities (from Github)][mg-mdman-gh]
* [Getting Started (from 11ty.dev/docs)][11ty-get-start]
* [Template Languages (from 11ty.dev/docs)][11ty-templates]
* [BrowserSync Docs: Requirements (from browsersync.io)][browsersync-docs]
* [Filters (from 11ty.dev/docs)][11ty-docs-filters]
* [Shortcodes (from 11ty.dev/docs)][11ty-docs-shortcodes]
* [Javascript Template Functions][11ty-docs-js-funcs]
* [Collections (using tags)(from 11ty.dev/docs)][11ty-docs-collections]
* [Plugins (from 11ty.dev/docs)][11ty-docs-plugs]
* [Layouts (from 11ty.dev/docs)][11ty-layouts]
* [Layout Chaining (from 11ty.dev/docs)][11ty-docs-layout-chain]
* [Collections: Custom Filtering & Sorting (from 11ty.dev/docs)][11ty-collections-custom-filt-sort]
* [Tips for Debugging 11ty (from griffa.dev)][griffa-tips-debug-11ty]
* [Transform (from 11ty.dev/docs)][11ty-docs-config-transform]
* [gray-matter: Frontmatter YAML parser (from Github by jonschlinkert)][gh-gray-matter]
* [Global Data (from 11ty.dev/docs)][11ty-data-global]
* [Data Cascade (from 11ty.dev/docs)][11ty-data-cascade]
* [I Finally Understand Eleventy's Data Cascade (from benmyers.dev)][11ty-data-cascade-benmyers]
* [Why I Migrated from Gatsby to Eleventy (from marcradziwill by Marc Radziwill)][why-gatsby-to-11ty-radziwill]
* [markdown-it-replace-link: Markdown-It plugin for replacing links (from GitHub by Martin Heidegger)][md-it-plug-replace-link]
* [Markdown-It Plugins: @mdit/plugin-mathjax][mdit-plug-mathjax]
* [Markdown-It Plugins: @mdit/plugin-tex][mdit-plug-tex]
* [Markdown It Plugin: MathJax3 (from npmjs.com by nzt)][mdit-mathjax3]
* [Eleventy-Plugin-MathJax on Github][plug-mathjax-11ty]
* [About HTML semantics and front-end architecture (by Nicolas Gallagher dot com)][multi-class-mod-pattern-gallagher]
* [Responsive Design (from tailwindcss.com/docs by TailwindCSS)][resp-design-tailwind-docs]
* [Handling Hover, Focus & Other State: Ordering Stacked Modifiers (from tailwindcss.com/docs by TailwindCSS)][order-mod-stack-tailwind-docs]

<!-- Hidden Reference Links Below Here -->
[11ty]: 11ty.dev "Eleventy (11ty) Homepage"
[mg-mdman-gh]: https://github.com/marcus-grant/mdman "mdman: Markdown Frontmatter file utilities (from Github)"
[11ty-get-start]: https://www.11ty.dev/docs/getting-started/ "Getting Started (from 11ty.dev/docs)"
[11ty-templates]: https://www.11ty.dev/docs/languages/ "Template Languages (from 11ty.dev/docs)"
[browsersync-docs]: https://browsersync.io/docs/#requirements "BrowserSync Docs: Requirements (from browsersync.io)"
[11ty-docs-filters]: https://www.11ty.dev/docs/filters/ "Filters (from 11ty.dev/docs)"
[11ty-layouts]: https://www.11ty.dev/docs/layouts/ "Layouts (from 11ty.dev/docs)"
[11ty-docs-layout-chain]: https://www.11ty.dev/docs/layout-chaining/ "Layout Chaining (from 11ty.dev/docs)"
[11ty-docs-shortcodes]: https://www.11ty.dev/docs/shortcodes/ "Shortcodes (from 11ty.dev/docs)"
[11ty-docs-js-funcs]: https://www.11ty.dev/docs/languages/javascript/#javascript-template-functions "Javascript Template Functions"
[11ty-docs-collections]: https://www.11ty.dev/docs/collections/ "Collections (using tags)(from 11ty.dev/docs)"
[11ty-docs-plugs]: https://www.11ty.dev/docs/plugins/ "Plugins (from 11ty.dev/docs)"
[11ty-collections-custom-filt-sort]: https://www.11ty.dev/docs/collections/#advanced-custom-filtering-and-sorting "Collections: Custom Filtering & Sorting (from 11ty.dev/docs)"
[griffa-tips-debug-11ty]: https://griffa.dev/posts/tips-for-debugging-in-11ty/ "Tips for Debugging 11ty (from griffa.dev)"
[11ty-docs-config-transform]: https://www.11ty.dev/docs/config/#transforms "Transform (from 11ty.dev/docs)"
[gh-gray-matter]: https://github.com/jonschlinkert/gray-matter "gray-matter: Frontmatter YAML parser (from Github by jonschlinkert)"
[11ty-data-global]: https://www.11ty.dev/docs/data-global/ "Global Data (from 11ty.dev/docs)"
[11ty-data-cascade]: https://www.11ty.dev/docs/data-cascade/ "Data Cascade (from 11ty.dev/docs)"
[11ty-data-cascade-benmyers]: https://benmyers.dev/blog/eleventy-data-cascade/ "I Finally Understand Eleventy's Data Cascade (from benmyers.dev)"
[why-gatsby-to-11ty-radziwill]: ./https://marcradziwill.com/blog/why-i-migrated-my-website-from-gatsbyjs-to-eleventy/ "Why I Migrated from Gatsby to Eleventy (from marcradziwill by Marc Radziwill)"
[md-it-plug-replace-link]: https://github.com/martinheidegger/markdown-it-replace-link "markdown-it-replace-link: Markdown-It plugin for replacing links (from GitHub by Martin Heidegger)"
[mdit-plug-mathjax]: https://mdit-plugins.github.io/mathjax.html "Markdown-It Plugins: @mdit/plugin mathjax"
[mdit-plug-tex]: https://mdit-plugins.github.io/tex.html "Markdown-It Plugins: @mdit/plugin-tex"
[mdit-mathjax3]: https://www.npmjs.com/package/markdown-it-mathjax3 "Markdown It Plugin: MathJax3 (from npmjs.com by nzt)"
[plug-mathjax-11ty]: https://github.com/tsung-ju/eleventy-plugin-mathjax "Eleventy-Plugin-MathJax on Github"
[multi-class-mod-pattern-gallagher]: https://nicolasgallagher.com/about-html-semantics-front-end-architecture/#component-modifiers "About HTML semantics and front-end architecture (by Nicolas Gallagher dot com)"
[resp-design-tailwind-docs]: https://tailwindcss.com/docs/responsive-design "Responsive Design (from tailwindcss.com/docs by TailwindCSS)"
[order-mod-stack-tailwind-docs]: https://tailwindcss.com/docs/hover-focus-and-other-states#ordering-stacked-modifiers "Handling Hover, Focus & Other State: Ordering Stacked Modifiers (from tailwindcss.com/docs by TailwindCSS)"

### Note Links

* [Glob Patterns][glob-zk]
* [Regular Expressions][regex-zk]
* [MathJax][mathjax-zk]

<!-- Hidden Reference Links Below Here -->
[glob-zk]: glob-pattern.md "Glob Patterns"
[regex-zk]: regex.md "Regular Expressions"
[mathjax-zk]: mathjax.md "MathJax"
