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

## How to update document snapshot

1. Go to the [editors draft on rawgit](http://rawgit.com/w3c/aria/master/practices/aria-practices.html)
2. Press the ReSpec button (top right hand corner)
3. Select 'Save snapshot'
4. Select 'Save as HTML'
5. Open the gh-pages branch of the ARIA repository
6. Open `aria-practices.html` in your preferred editor
7. Overwrite contents of `aria-practices.html` with the snapshot copy you saved
8. Commit and push changes
9. Review changes at [GitHub pages APG snapshot](http://w3c.github.io/aria/practices/aria-practices.html)
