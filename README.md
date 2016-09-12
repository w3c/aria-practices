# WAI-ARIA: Authoring Practices Guide

This repository maintains the WAI-ARIA Authoring Practices Guide.
This is developed by the [ARIA Working Group](http://www.w3.org/WAI/ARIA/).
The staff contact is [Michael Cooper](http://www.w3.org/People/cooper/).
Please do not provide commit access to this repository without coordination.

## Contributing to this Repository

### Code conformance

* All code should validate in the NU HTML Validator.
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

### Editorial documentation

General documentation for editing ARIA deliverables is available in the 
[ARIA repository](https://github.com/w3c/aria/).
Some of that documentation covers technical procedures not needed 
for this specification.

## How to update document snapshot

1. Go to the [editors draft on rawgit](https://cdn.rawgit.com/w3c/aria-practices/master/aria-practices.html)
2. Press the ReSpec button (top right hand corner)
3. Select 'Save snapshot'
4. Select 'Save as HTML'
5. Open the gh-pages branch of the `aria-practices` repository
6. Open `index.html` in your preferred editor
7. Overwrite contents of `index.html` with the snapshot copy you saved
8. Commit and push changes
9. Review changes at [GitHub pages APG snapshot](http://w3c.github.io/aria-practices/)
