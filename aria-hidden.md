== 7. Accessibility tree

Browsers use a so-called accessibility tree to communicate the representation of web content with assistive technologies. See the [Core Accessibility API Mappings](https://w3c.github.io/core-aam/#dfn-accessibility-tree) specification for further information about accessibility trees.

The accessibility tree is based on information in the DOM tree and information in CSS. For example, text in the DOM tree can also be in the accessibility tree. CSS generated content is not part of the DOM tree, but can be part of the accessibility tree.

For example, given the HTML document

```
<!doctype html>
<html>
 <head>
  <title>Cookie policy</title>
 </head>
 <body>
  <p>Cookies are delicious delicacies. <button>OK</button></p>
 </body>
</html>
```

The DOM tree includes element nodes closely resembling the markup, with a root `html` element that has two element children `head` and `body`, and so on.

The accessibility tree does not include the `head` or `title` elements, because the `head` element is hidden by default. The paragraph is included in the accessibility tree, with a text node child "Cookies are delicious delicacies. " and a `button` node, whose accessible name is "OK".

CSS and ARIA can be used to control what is included in the accessibility tree, which is discussed in the following sections.

== 8. Excluding subtrees from the accessibility tree

An element that is hidden, either by default or by the author using CSS (in particular `display: none` and `visibility: hidden`), or using the HTML `hidden` attribute (which by default maps to CSS `display: none`), is not included in the accessibility tree. Its descendants are also not included. The element is hidden from all users, both visually and from assistive technologies.

For example, a [disclosure](#disclosure) shows and hides content, and that content is intended to be hidden for all users, and could use CSS `display: none` or the HTML `hidden` attribute.

Using `aria-hidden` with the value `true` excludes the element and its descendants from the accessibility tree, just like hidden elements, but such elements are *not* hidden visually. The descendants are excluded from the accessibility tree even if an element in the exluded subtree sets `aria-hidden` to `false`.

`aria-hidden` can be used to hide decorative or redundant content from screen readers, for example an inline SVG icon.

```
<a href="/">
 <svg aria-hidden="true">...</svg>
 Home
</a>
```

Warning. Only use `aria-hidden="true"` when hiding content from only assistive technologies improves the experience for users of assistive technologies.
