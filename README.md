[![Build Status](https://travis-ci.org/w3c/aria-practices.svg?branch=master)](https://travis-ci.org/w3c/aria-practices)

# WAI-ARIA: Authoring Practices Guide

This repository maintains the WAI-ARIA Authoring Practices Guide.

* [Latest editor's draft built from master branch](http://w3c.github.io/aria-practices/)
* [Most recent version published on w3.org](https://www.w3.org/TR/wai-aria-practices-1.1/)
* Developed by the [Authoring Practices Task Force](https://www.w3.org/WAI/ARIA/task-forces/practices/) of the [ARIA Working Group](http://www.w3.org/WAI/ARIA/).
* Staff contact: [Michael Cooper](http://www.w3.org/People/cooper/).

Please do not provide commit access to this repository without coordination.

## How the work is organized

* Work is planned and prioritized in our [milestones](https://github.com/w3c/aria-practices/milestones?direction=asc&sort=due_date&state=open). Each milestone corresponds to a working draft or release published to w3.org.
* Work is organized by topic in our [projects](https://github.com/w3c/aria-practices/projects). Each project corresponds to a type of design pattern or section of guidance.
* The [scope of work and roadmap](https://github.com/w3c/aria-practices/wiki/Scope) are described in the project wiki.

## Contributing
1. Comment in an existing issue or raise a new issue, expressing your willingness to help and briefly summarizing the nature of your proposed resolution.
2. An editor will confirm there are no conflicting plans and, if needed, provide guidance.
3. Be sure you have ESLint configured as described below.
4. Read our wiki page about [submitting pull requests](https://github.com/w3c/aria-practices/wiki/Submitting-Pull-Requests).
5. Do some fabulous work and submit a pull request.

Note: Please feel free to ask questions either through an issue or on the [Authoring Practices Task Force mailing list](http://lists.w3.org/Archives/Public/public-aria-practices/).

### Code conformance

* All HTML should validate in the NU HTML Validator. Exceptions to this rule are warnings and errors related to future ARIA features that are not yet implemented.
* To keep code in this repository consistent; editors should use a text editor that supports [EditorConfig](http://editorconfig.org/).
* All code should test clean with ESLint.

### Running ESLint, the pluggable linting utility for JavaScript and JSX

[ESLint](http://eslint.org/) is an automated code style checker. We use it to
ensure common code styling practices in this repository.
Pull requests with ESLint errors will not be merged.

### Setup ESLint so you can run it locally

1. If you do not already have node.js installed, go to the [node installer](https://nodejs.org/en/download/)
1. When you install Node, NPM is included.
1. In a terminal window from the directory that contains the `aria-practices`
repository, run `npm install`.
A successful install will display a tree of installed packages.

### Test and fix your code

1. Open a terminal window to the directory that contains the `aria-practices` repository
1. The repository has a script defined that will test all JavaScript in the examples directory. To run it, execute the command `npm test`.
1. Many errors can be fixed automatically with the command `npm run fix`.
1. After running fix, test again to see what you need to fix manually.

When the linter encounters errors, it will report them in the console.
The error report will contain the file name and line number, and it will
indicate the character or place in the line that raised the style violation. To
fix an error, satisfy the change that the violation indicates.

For example, here is an error for an invalid variable name style. Variables must
follow a camelCase convention.

```
/Users/user1/Documents/github/aria-practices/examples/slider/js/text-slider.js
  19:8  error  Identifier 'value_nodes' is not in camel case  camelcase
```

The error occurred in `examples/slider/js/text-slider.js`, on line 19 and the
offending character is indicated by the number `8` after the colon. Change the
variable `value_nodes` to `valueNodes` in your source file to eliminate this
error.

To see the complete list of style rules that are applied by ESLint, review the [.eslint.json](https://github.com/w3c/aria-practices/blob/master/.eslint.json) file in the root of the project.

### Editorial documentation

General documentation for editing ARIA deliverables is available in the
[ARIA repository](https://github.com/w3c/aria/).
Some of that documentation covers technical procedures not needed
for this specification.

## How to update document snapshot

Note: These instructions are for editors of the APG who have repository commit access.

1. Go to the [editors draft on rawgit](https://cdn.rawgit.com/w3c/aria-practices/master/aria-practices.html)
2. Press the ReSpec button (top right hand corner)
3. Select 'Save snapshot'
4. Select 'Save as HTML'
5. Open the gh-pages branch of the `aria-practices` repository
6. Open `index.html` in your preferred editor
7. Overwrite contents of `index.html` with the snapshot copy you saved
8. Commit and push changes
9. Review changes at [GitHub pages APG snapshot](http://w3c.github.io/aria-practices/)
