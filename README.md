[![Build Status](https://travis-ci.org/w3c/aria-practices.svg?branch=master)](https://travis-ci.org/w3c/aria-practices)

# WAI-ARIA: Authoring Practices Guide

This repository maintains the WAI-ARIA Authoring Practices Guide.
This is developed by the [ARIA Working Group](http://www.w3.org/WAI/ARIA/).
The staff contact is [Michael Cooper](http://www.w3.org/People/cooper/).
Please do not provide commit access to this repository without coordination.

## Contributing to this Repository

### Code conformance

* All HTML should validate in the NU HTML Validator.
Exceptions to this rule are warnings and errors related to
future ARIA features we need to implement.
* To keep code in this repository consistent; editors should use a text editor
that supports [EditorConfig](http://editorconfig.org/).

### Writing code examples

- Choose a pattern from the
  [Design Patterns Status](https://github.com/w3c/aria-practices/wiki/Design-Patterns-Status)
  document that is missing a code example.
- Via the command line, run:

        $ bin/generate <name>

  Where `<name>` is the dasherized name of the design pattern example. This
  creates a new example directory and file with the same name, based on a
  template.

- Edit the new html file with an example corresponding to the description in
  `aria-practices.html`

### Running JSCS, the JavaScript code style checker

[JSCS](http://jscs.info/) is an automated code style checker. We use it to ensure
common code styling practices in this repository. 
Pull requests with JSCS errors will not be merged.

### Setup JSCS so you can run it locally
 
1. If you do not already have node.js installed, 
 go to the [node installer](https://nodejs.org/en/download/)
1. When you install Node, NPM is included.
1. In a terminal window from the directory that contains the `aria-practices`
repository, run `npm install`.
A successful install will display a tree of installed packages.

### Test and fix your code

1. Open a terminal window to the directory that contains the `aria-practices` 
repository
1. The repository has a script defined that will test all JavaScript in the examples 
directory. To run it, execute the command `npm test`.
1. Many errors can be fixed automatically with the command `npm run jscs --fix`.
1. After running fix, test again to see what you need to fix manually.
  
When JSCS encounters errors, it will report them in the console. 
The error report will contain the file name and line number, 
and it will indicate the character or place in the line 
that raised the style violation. 
To fix an error, satisfy the change
that the violation indicates.

For example, here is an error for an invalid quotation mark. Quotation marks must
be single quotation marks, not double.

```
validateQuoteMarks: Invalid quote mark found at examples/alert/js/alert.js :
     1 |window.addEventListener('load', function () {
     2 |
     3 |  var button = document.getElementById("alert-trigger");
-----------------------------------------------^
     4 |
     5 |  button.addEventListener('click', addAlert);
```

The error occurred in `examples/alert/js/alert.js`, on line 3 and the offending
character is indicated by the dashed line and a caret pointing up. Change the
double quotation mark to a single quotation mark in your source file to eliminate
this error.

To see the complete list of style rules that are applied by JSCS,
Check out the [.jscsrc](https://github.com/w3c/aria-practices/blob/master/.jscsrc) file in the root of the project. 

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
