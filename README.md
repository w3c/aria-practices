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
