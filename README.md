# WAI-ARIA: Authoring Practices Guide

This repository maintains the WAI-ARIA Authoring Practices Guide (APG).

* Published at: [w3.org/wai/aria/apg](https://www.w3.org/wai/aria/apg/)
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
3. Be sure you have linters installed and configured as described below.
4. Read our wiki page about [submitting pull requests](https://github.com/w3c/aria-practices/wiki/Submitting-Pull-Requests).
5. Do some fabulous work and submit a pull request.

Note: Please feel free to ask questions either through an issue or on the [Authoring Practices Task Force mailing list](http://lists.w3.org/Archives/Public/public-aria-practices/).

### Code conformance

This repository utilizes [linting](https://en.wikipedia.org/wiki/Lint_%28software%29) tools to do static code analysis and ensure consistent code quality across HTML, CSS, and JavaScript. Each linting tool and respective code standards are documented below and in the [code guide](https://github.com/w3c/aria-practices/wiki/Code-Guide).

Pull requests that contain linting errors will not be merged until the errors are resolved. To make this easier, you can install and run the tools locally before pushing code. Also note that the tools for CSS and JavaScript will automatically fix many issues if you have them installed locally. To install these tools:

1. Make sure that you have [Node.js](https://nodejs.org/en/) installed, which comes with [node package manager (npm)](https://www.npmjs.com/get-npm)
1. Open the directory that contains your `aria-practices` repository in a terminal
1. Run `npm install`

The HTML validator also requires the installation of a JDK in order to run. If you don't already have a JDK installed, [download the latest JDK from Oracle](https://www.oracle.com/technetwork/java/javase/downloads/index.html).

It is also highly recommended that you use a code editor that supports these tools and [EditorConfig](http://editorconfig.org/).

#### HTML

HTML is validated against the [NU HTML Validator](https://github.com/validator/validator).
Should a warning or error occur because a future ARIA feature is not yet implemented, it will be added to the [.vnurc file](.vnurc), allowing the error to pass through.

Run locally:

```sh
npm run lint:html
```

#### CSS

CSS is validated by [stylelint](https://stylelint.io/) using the [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard) ruleset.

**NOTE**: on commit, stylelint will be run on staged CSS files. If errors are found that can be [automatically fixed with the --fix flag](https://stylelint.io/user-guide/cli/#autofixing-errors), they will be fixed and the changes committed.

Run locally:

```sh
npm run lint:css
```

#### JavaScript

JavaScript is validated by [ESLint](http://eslint.org/), using [our own config](.eslintrc.json).

**NOTE**: on commit, eslint will be run on staged CSS files. If errors are found that can be [automatically fixed with the --fix flag](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems), they will be fixed and the changes committed.

Run locally:

```sh
npm run lint:js
```

### Test and fix your code

1. Open a terminal window to the directory that contains the `aria-practices` repository
1. The repository has a script defined that will test all JavaScript in the examples directory. To run it, execute the command `npm test`. Note: this may take a few minutes to run and will open several browser windows during the test that will gain focus.
1. Many errors can be fixed automatically with the command `npm run fix`.
1. After running fix, test again to see what you need to fix manually.

When the linter encounters errors, it will report them in the console.
The error report will contain the file name and line number, and it will
indicate the character or place in the line that raised the style violation. To
fix an error, satisfy the change that the violation indicates.

For example, here is an error for an invalid variable name style. Variables must
follow a camelCase convention.

```sh
/Users/user1/Documents/github/aria-practices/examples/slider/js/text-slider.js
  19:8  error  Identifier 'value_nodes' is not in camel case  camelcase
```

The error occurred in `examples/slider/js/text-slider.js`, on line 19 and the
offending character is indicated by the number `8` after the colon. Change the
variable `value_nodes` to `valueNodes` in your source file to eliminate this
error.

To see the complete list of style rules that are applied by ESLint, review the [.eslintrc.json](.eslintrc.json) file in the root of the project.

### Editorial documentation

See the [APG Editorial Style Guidelines](https://github.com/w3c/aria-practices/wiki/APG-Editorial-Style-Guidelines)
for information about writing prose for the APG.
The [ReadMe for the ARIA specification](https://github.com/w3c/aria/)
contains additional useful editorial guidance.

## ARIA Roles, Properties and States Referenced in Guidance and Examples(Also known as APG Coverage Report)

[APG Coverage Report](https://raw.githack.com/w3c/aria-practices/main/coverage/index.html) includes information on number of guidance and example references in the WAI-ARIA Authoring Practices for each ARIA role, property and state. 

As of January 11, 2022, APG has examples of 

1. CSV Files of Role, Properties and States Coverage
2. Roles with no Guidance or Examples (29)
3. Roles with at Least One Guidance or Example (13)
4. Roles with More than One Guidance or Example (36)
5. Properties and States with no Examples (12)
6. Properties and States with One Examples (8)
7. Properties and States with More than One Example (28)
8. Example Coding Practices
