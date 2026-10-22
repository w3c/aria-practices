<header class="masthead">

<div class="container">

# APG Coding standards

Standards for developing contributing HTML, CSS, and JavaScript to W3C WAI-ARIA APG.

</div>

</header>

<div class="heading" id="toc">

## Table of contents

</div>

<div class="section toc">

<div class="col">

#### [HTML](#html-1)

- [Syntax](#syntax)
- [HTML doctype](#html-doctype)
- [Language attribute](#language-attribute)
- [Character encoding](#character-encoding)
- [CSS and JavaScript includes](#css-and-javascript-includes)
- [Practicality over purity](#practicality-over-purity)
- [Boolean attributes](#boolean-attributes)
- [Reducing markup](#reducing-markup)
- [JavaScript generated markup](#javascript-generated-markup)

</div>

<div class="col">

#### [CSS](#css-1)

- [CSS syntax](#syntax-1)
- [Declaration order](#declaration-order)
- [Don't use @import](#dont-use-import)
- [Media query placement](#media-query-placement)
- [Prefixed properties](#prefixed-properties)
- [Shorthand notation](#shorthand-notation)
- [Comments](#comments)
- [Class names](#class-names)

</div>

<div class="col">

#### [JavaScript](#javascript-1)

- [JavaScript style & syntax](#general-code-style--syntax)
- [Function Naming](#function-naming)
- [Function Design](#function-design)
- [Widget Structure](#widget-structure)
- [Comments](#comments-1)
- [Opening example in Codepen](#codepen)

</div>

</div>

<div class="section" id="introduction">

<div class="col">

## Introduction

These standards are provided as a guide to contributing to W3C WAI-ARIA APG

They are based on [Code Guide](http://codeguide.co/) by [@mdo](https://github.com/mdo/code-guide).

</div>

</div>

<div class="section" id="golden-rule">

<div class="col">

## Principles

The following priorities have been used to determine these standards:

1.  Readability / understandability
2.  Familiarity
3.  Ease of maintenance
4.  Ease of contribution
5.  Performance

### Browser support

- Latest version of Google Chrome
- Latest version of Mozilla Firefox

</div>

</div>

<div class="heading" id="html">

## HTML

</div>

<div class="section" id="html-syntax">

<div class="col">

### Syntax

- Use soft tabs with two spaces—they're the only way to guarantee code renders the same in any environment.
- Nested elements should be indented once (two spaces).
- Always use double quotes, never single quotes, on attributes.
- Don't include a trailing slash in self-closing elements—the [HTML standard](https://html.spec.whatwg.org/multipage/syntax.html#syntax-start-tag) says they're optional.
- Don’t omit optional closing tags (e.g. `</li>` or `</body>`).

</div>

<div class="col">

<figure class="highlight">

    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Page title</title>
      </head>
      <body>
        <img src="images/company-logo.png" alt="Company">
        <h1 class="hello-world">Hello, world!</h1>
      </body>
    </html>

</figure>

</div>

</div>

<div class="section" id="html-doctype">

<div class="col">

### HTML doctype

Enforce standards mode and more consistent rendering in every browser possible with this simple doctype at the beginning of every HTML page.

</div>

<div class="col">

<figure class="highlight">

    <!DOCTYPE html>

</figure>

</div>

</div>

<div class="section" id="html-lang">

<div class="col">

### Language attribute

From the HTML standard:

> Authors are encouraged to specify a `lang` attribute on the root `html` element, giving the document's language. This aids speech synthesis tools to determine what pronunciations to use, translation tools to determine what rules to use, and so forth.

Read more about the `lang` attribute [in the spec](https://html.spec.whatwg.org/multipage/semantics.html#the-html-element).

Head to Sitepoint for a [list of language codes](https://www.sitepoint.com/iso-2-letter-language-codes/).

</div>

<div class="col">

<figure class="highlight">

    <html lang="en-us">
      <!-- ... -->
    </html>

</figure>

</div>

</div>

<div class="section" id="html-encoding">

<div class="col">

### Character encoding

Use UTF-8, and use the short form `<meta charset="UTF-8">` as the first child in `head`.

</div>

<div class="col">

<figure class="highlight">

    <head>
      <meta charset="UTF-8">
      ...
    </head>

</figure>

</div>

</div>

<div class="section" id="html-style-script">

<div class="col">

### CSS and JavaScript includes

Per the HTML standard, there is no need to specify a `type` when including CSS and classic JavaScript files as `text/css` and `text/javascript` are their respective defaults.

#### HTML standard links

- [Using `link`](https://html.spec.whatwg.org/multipage/semantics.html#the-link-element)
- [Using `style`](https://html.spec.whatwg.org/multipage/semantics.html#the-style-element)
- [Using `script`](https://html.spec.whatwg.org/multipage/scripting.html#the-script-element)

</div>

<div class="col">

<figure class="highlight">

    <!-- External CSS -->
    <link rel="stylesheet" href="code-guide.css">

    <!-- In-document CSS -->
    <style>
      /* ... */
    </style>

    <!-- JavaScript -->
    <script src="code-guide.js"></script>

</figure>

</div>

</div>

<div class="section" id="html-practicality">

<div class="col">

### Practicality over purity

Strive to maintain HTML standards and semantics, but not at the expense of practicality. Use the least amount of markup with the fewest intricacies whenever possible.

</div>

</div>

<div class="section" id="html-boolean-attributes">

<div class="col">

### Boolean attributes

A boolean attribute is one that needs no declared value. XHTML required you to declare a value, but HTML has no such requirement.

For further reading, consult the [WHATWG section on boolean attributes](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes):

> The presence of a boolean attribute on an element represents the true value, and the absence of the attribute represents the false value.

If you _must_ include the attribute's value, and **you don't need to**, follow this WHATWG guideline:

> If the attribute is present, its value must either be the empty string or [...] the attribute's canonical name, with no leading or trailing whitespace.

**In short, don't add a value.**

</div>

<div class="col">

<figure class="highlight">

    <input type="text" disabled>

    <input type="checkbox" value="1" checked>

    <select>
      <option value="1" selected>1</option>
    </select>

</figure>

</div>

</div>

<div class="section" id="html-reducing-markup">

<div class="col">

### Reducing markup

Whenever possible, avoid superfluous parent elements when writing HTML. Many times this requires iteration and refactoring, but produces less HTML. Take the following example:

</div>

<div class="col">

<figure class="highlight">

    <!-- Not so great -->
    <span class="avatar">
      <img src="...">
    </span>

    <!-- Better -->
    <img class="avatar" src="...">

</figure>

</div>

</div>

<div class="section" id="html-javascript">

<div class="col">

### JavaScript generated markup

Writing markup in a JavaScript file makes the content harder to find, harder to edit, and less performant. Avoid it whenever possible.

</div>

</div>

<div class="heading" id="css">

## CSS

</div>

<div class="section" id="css-syntax">

<div class="col">

### Syntax

- All CSS must be compatible with the latest release of Chrome, Firefox, and Safari.
  <!-- Note to wiki maintainers: the compatibility policy is also documented in the project's "Read Me First" page. -->
- Use soft tabs with two spaces—they're the only way to guarantee code renders the same in any environment.
- When grouping selectors, keep individual selectors to a single line.
- Include one space before the opening brace of declaration blocks for legibility.
- Place closing braces of declaration blocks on a new line.
- Include one space after `:` for each declaration.
- Each declaration should appear on its own line for more accurate error reporting.
- End all declarations with a semi-colon. The last declaration's is optional, but your code is more error prone without it.
- Comma-separated property values should include a space after each comma (e.g., `box-shadow`).
- Don't include spaces after commas _within_ `rgb()`, `rgba()`, `hsl()`, `hsla()`, or `rect()` values. This helps differentiate multiple color values (comma, no space) from multiple property values (comma with space).
- Do prefix property values or color parameters with a leading zero (e.g., `0.5` instead of `.5` and `-0.5px` instead of `-.5px`).
- Lowercase all hex values, e.g., `#fff`. Lowercase letters are much easier to discern when scanning a document as they tend to have more unique shapes.
- Use shorthand hex values where available, e.g., `#fff` instead of `#ffffff`.
- Quote attribute values in selectors, e.g., `input[type="text"]`. [They’re only optional in some cases](http://mathiasbynens.be/notes/unquoted-attribute-values#css), and it’s a good practice for consistency.
- Avoid specifying units for zero length values, e.g., `margin: 0;` instead of `margin: 0px;`. (Note that values that are not lengths still require a unit, e.g. `0deg`.)

Questions on the terms used here? See the [syntax section of the Cascading Style Sheets article](http://en.wikipedia.org/wiki/Cascading_Style_Sheets#Syntax) on Wikipedia.

</div>

<div class="col">

<figure class="highlight">

    /* Bad CSS */
    .selector, .selector-secondary, .selector[type=text] {
      padding:15px;
      margin:0px 0px 15px;
      background-color:rgba(0, 0, 0, .5);
      box-shadow:0px 1px 2px #CCC,inset 0 1px 0 #FFFFFF
    }

    /* Good CSS */
    .selector,
    .selector-secondary,
    .selector[type="text"] {
      padding: 15px;
      margin-bottom: 15px;
      background-color: rgba(0,0,0,0.5);
      box-shadow: 0 1px 2px #ccc, inset 0 1px 0 #fff;
    }

</figure>

</div>

</div>

<div class="section" id="css-declaration-order">

<div class="col">

### Declaration order

Related property declarations should be grouped together following the order:

1.  Positioning
2.  Box model
3.  Typographic
4.  Visual

Positioning comes first because it can remove an element from the normal flow of the document and override box model related styles. The box model comes next as it dictates a component's dimensions and placement.

Everything else takes place _inside_ the component or without impacting the previous two sections, and thus they come last.

For a complete list of properties and their order, please see [Recess](http://twitter.github.com/recess).

</div>

<div class="col">

<figure class="highlight">

    .declaration-order {
      /* Positioning */
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 100;

      /* Box-model */
      display: block;
      float: right;
      width: 100px;
      height: 100px;

      /* Typography */
      font: normal 13px "Helvetica Neue", sans-serif;
      line-height: 1.5;
      color: #333;
      text-align: center;

      /* Visual */
      background-color: #f5f5f5;
      border: 1px solid #e5e5e5;
      border-radius: 3px;

      /* Misc */
      opacity: 1;
    }

</figure>

</div>

</div>

<div class="section" id="css-import">

<div class="col">

### Don't use `@import`

Compared to `<link>`s, `@import` is slower, adds extra page requests, and can cause other unforeseen problems. Avoid them and instead opt for an alternate approach:

- Use multiple `<link>` elements
- Compile your CSS with a preprocessor like Sass or Less into a single file
- Concatenate your CSS files with features provided in Rails, Jekyll, and other environments

For more information, [read this article by Steve Souders](http://www.stevesouders.com/blog/2009/04/09/dont-use-import/).

</div>

<div class="col">

<figure class="highlight">

    <!-- Use link elements -->
    <link rel="stylesheet" href="core.css">

    <!-- Avoid @imports -->
    <style>
      @import url("more.css");
    </style>

</figure>

</div>

</div>

<div class="section" id="css-media-queries">

<div class="col">

### Media query placement

Place media queries as close to their relevant rule sets whenever possible. Don't bundle them all in a separate stylesheet or at the end of the document. Doing so only makes it easier for folks to miss them in the future. Here's a typical setup.

</div>

<div class="col">

<figure class="highlight">

    .element { ... }
    .element-avatar { ... }
    .element-selected { ... }

    @media (min-width: 480px) {
      .element { ...}
      .element-avatar { ... }
      .element-selected { ... }
    }

</figure>

</div>

</div>

<div class="section" id="css-prefixed-properties">

<div class="col">

### Prefixed properties

When using vendor prefixed properties, indent each property such that the declaration's value lines up vertically for easy multi-line editing.

In Textmate, use **Text → Edit Each Line in Selection** (⌃⌘A). In Sublime Text 2, use **Selection → Add Previous Line** (⌃⇧↑) and **Selection → Add Next Line** (⌃⇧↓).

</div>

<div class="col">

<figure class="highlight">

    /* Prefixed properties */
    .selector {
      -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.15);
              box-shadow: 0 1px 2px rgba(0,0,0,.15);
    }

</figure>

</div>

</div>

<div class="section" id="css-shorthand">

<div class="col">

### Shorthand notation

Strive to limit use of shorthand declarations to instances where you must explicitly set all the available values. Common overused shorthand properties include:

- `padding`
- `margin`
- `font`
- `background`
- `border`
- `border-radius`

Often times we don't need to set all the values a shorthand property represents. For example, HTML headings only set top and bottom margin, so when necessary, only override those two values. Excessive use of shorthand properties often leads to sloppier code with unnecessary overrides and unintended side effects.

The Mozilla Developer Network has a great article on [shorthand properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties) for those unfamiliar with notation and behavior.

</div>

<div class="col">

<figure class="highlight">

    /* Bad example */
    .element {
      margin: 0 0 10px;
      background: red;
      background: url("image.jpg");
      border-radius: 3px 3px 0 0;
    }

    /* Good example */
    .element {
      margin-bottom: 10px;
      background-color: red;
      background-image: url("image.jpg");
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
    }

</figure>

</div>

</div>

<div class="section" id="css-comments">

<div class="col">

### Comments

Code is written and maintained by people. Ensure your code is descriptive, well commented, and approachable by others. Great code comments convey context or purpose. Do not simply reiterate a component or class name.

Be sure to write in complete sentences for larger comments and succinct phrases for general notes.

</div>

<div class="col">

<figure class="highlight">

    /* Bad example */
    /* Modal header */
    .modal-header {
      ...
    }

    /* Good example */
    /* Wrapping element for .modal-title and .modal-close */
    .modal-header {
      ...
    }

</figure>

</div>

</div>

<div class="section" id="css-classes">

<div class="col">

### Class names

- Keep classes lowercase and use dashes (not underscores or camelCase). Dashes serve as natural breaks in related class (e.g., `.btn` and `.btn-danger`).
- Avoid excessive and arbitrary shorthand notation. `.btn` is useful for _button_, but `.s` doesn't mean anything.
- Keep classes as short and succinct as possible.
- Use meaningful names; use structural or purposeful names over presentational.
- Prefix classes based on the closest parent or base class.
- Use `.js-*` classes to denote behavior (as opposed to style), but keep these classes out of your CSS.

It's also useful to apply many of these same rules when creating Sass and Less variable names.

</div>

<div class="col">

<figure class="highlight">

    /* Bad example */
    .t { ... }
    .red { ... }
    .header { ... }

    /* Good example */
    .tweet { ... }
    .important { ... }
    .tweet-header { ... }

</figure>

</div>

</div>

<div class="heading" id="javascript">

## JavaScript

</div>

<div class="section" id="javascript-syntax">

<div class="col">

### General Code Style & Syntax

All JavaScript must be compatible with the latest release of Chrome, Firefox, and Safari.

<!-- Note to wiki maintainers: the compatibility policy is also documented in the project's "Read Me First" page. -->

Please refer to the [AirBnB Javascript Style Guide](https://github.com/airbnb/javascript) for all basic javascript syntax and code style rules.

</div>
</div>

<div class="section" id="javascript-naming">
<div class="col">

### Function Naming

1. Functions that **return booleans** should be prefixed with `is`, `has`, `are` or similar keywords distinguish the return value, (e.g: `isVisible`, `areEqual`, `hasEncryption`).

   ```js
   function isVisible(element) {
     return element.classList.contains('open');
   }

   function areEqual(a, b) {
     // function logic
     return a === b;
   }

   function hasEncryption() {
     // function logic
     return encryption === true;
   }
   ```

1. Functions that **return HTML snippets** should be prefixed with `render`, for example:

   ```js
   function renderButton(label) {
     return `<button type="button">${label}</button>`;
   }
   ```

1. Functions that are intended to be **event handlers** should be prefixed with `on`, e.g. `onKeyDown`. If the event handler is specifically for one element within a complex widget, include the element name as well: `onButtonClick`.

   ```js
   mainEl.addEventListener('click', onClick);
   buttonEl.addEventListener('click', onButtonClick);
   listboxEl.addEventListener('keydown', onListboxKeyDown);
   ```

1. Functions that **mutate state** should be prefixed with `update`, or a verb that describes the state change. The full function name should be in the format of "verb + name of state" For example, `openListbox` or `updateFilterString`.

   ```js
   function openListbox() {
     this.listbox.open = true;
   }

   function updateFilterString(value) {
     this.filterString = value;
   }

   function updateActiveOption(index) {
     this.activeOption = index;
   }
   ```

1. Be specific when naming functions so that whenever possible, the function name is descriptive on its own without needing additional comments to clarify. Prefixing function names with verbs is a good practice.

   ```diff
   - function buttonLabel(label) {
   -	...
   - }
   + function applyButtonLabel(label) {
   +	...
   + }
   ```

### Function Design

Ideally functions should be single-purpose, short, and avoid side effects. The goal is to write functions that are easy to read, test, and refactor.

1. **Pure functions and side effects**: whenever possible, computation and logic should be handled in [pure functions](https://scotch.io/tutorials/wielding-pure-functions-in-javascript-and-function-composition), or functions that do not depend on or mutate external state. Functions that do modify external state should follow an `update*` naming convention as described in the "Function Naming" section. For example, combobox logic to filter options as a user types could be split out as follows:

   ```diff
   - function onInput(event) {
   -	  // logic here to get an array of filtered options based on event.target.value and this.options
   -	  const filteredOptions = result;
   -
   -   // logic here to update internal state and the DOM, e.g.:
   -   this.options = filteredOptions;
   -   this.listboxEl.innerHTML = '';
   -   filteredOptions.forEach((option) => {
   -     // etc
   -     this.listboxEl.appendChild(newOptionEl);
   -   });
   - }
   + function onInput(event) {
   +	  const filteredOptions = this.filterOptions(event.target.value, this.options);
   +   this.updateOptions(filteredOptions);
   + }
   +
   + function filterOptions(filterString, optionArray) {
   +	  // logic here to do actual filtering
   +   // this is the "pure" function
   +   return result;
   + }
   +
   + function updateOptions(optionArray) {
   +	  this.options = filteredOptions;
   +   // optionally split this logic into a renderListbox() function
   +   // this makes sense to split out if there are any other actions that would result in updating the listbox HTML without also updating this.options
   +   this.listboxEl.innerHTML = '';
   +   filteredOptions.forEach((option) => {
   +     // etc
   +     this.listboxEl.appendChild(newOptionEl);
   +   });
   + }
   ```

1. **Single-purpose functions**: avoid double-barrelled functions, for example `setFocusAndDoStuff()`. Calling `setFocus()` and `doStuff()` makes the logic for each step easier to read and understand. Ideally this also makes them easier to name and potentially refactor.

   ```diff
   - function onOptionClick(event) {
   -	  this.closeListboxAndUpdateValue(event.target.innerText);
   - }
   -
   - function closeListboxAndUpdateValue(newValue) {
   -	  // logic here to update listbox state
   -   // ...
   -
   -   // logic here to update the listbox value
   -   buttonEl.innerText = newValue;
   - }
   + function onOptionClick(event) {
   +	  this.closeListbox();
   +   this.updateValue(event.target.innerText);
   + }
   +
   + function closeListbox(event) {
   +	  // logic here to update listbox state
   +   // ...
   + }
   +
   + function updateValue(event) {
   +	  // logic here to update the listbox value
   +   buttonEl.innerText = newValue;
   + }
   ```

1. Avoid nested conditionals and ternaries

   ```diff
   - function getResult() {
   -   let result;
   -   if (A) {
   -     result = resultA();
   -	  } else {
   -     if (B) {
   -       result = resultB();
   -     } else {
   -       if (C) {
   -         result = resultC();
   -       } else {
   -         result = resultD();
   -       }
   -     }
   -   }
   -   return result;
   - }
   -
   + function getResult() {
   +   if (A) return resultA();
   +   if (B) return resultB();
   +   if (C) return resultC();
   +   return resultD();
   + }
   ```

### Widget Structure

When writing the javascript for a new widget, there are certain guidelines for code organization and structure to maintain consistency with other APG widgets.

1. Widgets should be defined as classes, with one class per widget.
1. Internal variables and functions should be in the following order within the widget class, and sorted alphabetically:
   1. Constructor function
      1. Properties
      1. State variables
   1. All other functions
1. Widgets should not be written to expose any of their internal state variables or functions. Communication should be done through emmitting events and handling property updates.
1. Here is a basic skeleton for creating a new widget class:

   ```js
   /*
    *   This content is licensed according to the W3C Software License at
    *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
    */

   'use strict';

   class Cat {
     constructor(el, name) {
       // properties
       this.el = el;
       this.name = name;

       // states
       this.isPurring = false;
       this.isSleeping = false;
     }

     onPet(event) {
       // etc
     }

     renderCat() {
       // create DOM
       // attach event handlers
       // etc.
     }

     updatePurring(purring) {
       this.isPurring = true;
     }

     // etc.
   }
   ```

### Comments

1. Refer to the [AirBnB comment styles](https://github.com/airbnb/javascript#comments) for comment formatting.
1. Avoid adding comments that just duplicate information in a function name or variable name.
1. Comments should not explain "what" something is doing, but rather the "why".
1. JSDoc comments are not needed
</div>

### CodePen

We are constraint slightly in the code design of our examples because we would like all examples to be opened in a CodePen. You can read more about how we add the "Open in CodePen" button on the [CodePen wikipage](https://github.com/w3c/aria-practices/wiki/How-to-add-the-Open-In-Codepen-button-to-an-example-page).

<footer class="footer">

<3

Heavily inspired by [Idiomatic CSS](https://github.com/necolas/idiomatic-css) and the [GitHub Styleguide](http://github.com/styleguide). Made with all the love in the world by [@mdo](https://twitter.com/mdo).

Open sourced under MIT. Copyright 2016 [@mdo](https://twitter.com/mdo).

</footer>
