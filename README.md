# Markipedia

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

## My Notes

### Eleventy Configuration

This is where all the logic happens, **FILL IN DOCUMENTATION**.

#### Eleventy Collecitons

**FILL IN DOCUMENTATION**

#### Advanced Filtering & Sorting of Collection

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

## References

* [Eleventy (11ty) Homepage][11ty]
* [mdman: Markdown Frontmatter file utilities (from Github)][mg-mdman-gh]
* [Getting Started (from 11ty.dev/docs)][11ty-get-start]
* [Template Languages (from 11ty.dev/docs)][11ty-templates]
* [BrowserSync Docs: Requirements (from browsersync.io)][browsersync-docs]
* [Layouts (from 11ty.dev/docs)][11ty-layouts]

<!-- Hidden Reference Links Below Here -->
[11ty]: 11ty.dev "Eleventy (11ty) Homepage"
[mg-mdman-gh]: https://github.com/marcus-grant/mdman "mdman: Markdown Frontmatter file utilities (from Github)"
[11ty-get-start]: https://www.11ty.dev/docs/getting-started/ "Getting Started (from 11ty.dev/docs)"
[11ty-templates]: https://www.11ty.dev/docs/languages/ "Template Languages (from 11ty.dev/docs)"
[browsersync-docs]: https://browsersync.io/docs/#requirements "BrowserSync Docs: Requirements (from browsersync.io)"
[11ty-layouts]: https://www.11ty.dev/docs/layouts/ "Layouts (from 11ty.dev/docs)"

### Note Links

* [Glob Patterns][glob-zk]

<!-- Hidden Reference Links Below Here -->
[glob-zk]: ./site/notes/glob-pattern.md "Glob Patterns"