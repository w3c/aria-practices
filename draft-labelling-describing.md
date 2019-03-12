Labeling and Describing

## Introduction

A label, also known as accessible name, is a name or a label used to identify the element for users of assistive technology. For example, a button’s label can be "OK".

An accessible description complements the label with a description. An accessible description is always optional, and if present it does not need to be as brief as a label.

## Labels

There are two different ways to get the label for an element, depending on the element’s role.

* Implicit label by default

* Explicit label only

### Implicit label by default

For elements with certain roles, the label is taken from the element’s contents by default. In the following example, a link (with default role `link`) gets its label from the element’s contents ("Home").

```
<a href="/">Home</a>
```


The label also can be set explicitly by using the `aria-labelledby` or `aria-label` attributes. If the implicit label (from the element’s contents) is already good, then don’t use the `aria-labelledby` or `aria-label` attributes.

The following roles get the label from the contents by default:

* `button`

* `cell`

* `checkbox`

* `columnheader`

* `gridcell`

* `heading`

* `link`

* `menuitem`

* `menuitemcheckbox`

* `menuitemradio`

* `option`

* `radio`

* `row`

* `rowgroup`

* `rowheader`

* `switch`

* `tab`

* `tooltip`

* `treeitem`

If the element’s contents are not appropriate as a label, but there is an element that can be used as the label, then use the `aria-labelledby` attribute.

In the following example, an element with the "switch" role is labeled by a previous sibling element.

```
<span id="night-mode-label">Night mode</span>
<span role="switch" aria-checked="false" tabindex="0" aria-labelledby="night-mode-label"></span>
```


Because a `span` element is used for the switch control, the HTML `label` element cannot be used to label it, since it only works with HTML elements that are form controls. However, the `switch` role can be used on an `input` element with `type="checkbox”`, and then HTML `label` can be used.

```
<label for="night-mode">Night mode</label>
<input type="checkbox" role="switch" id="night-mode">
```


In some cases, the combination of the element’s contents and another element would be appropriate as a label. In such situations, use the `aria-labelledby` and reference both the element itself and the other element.

In the following example, a "read more" link is labeled by the element itself and the article’s heading, resulting in “Read more… 7 ways you can help save the bees”.

```
<h2 id="bees-heading">7 ways you can help save the bees</h2>
<p>Bees are disappearing rapidly.
Here are seven things you can do to help.</p>
<p><a id="bees-read-more aria-labelledby="bees-read-more bees-heading">Read more...</a></p>
```


If there is no content that is appropriate to use as the label, then use the `aria-label` attribute to set the label for the element directly.

In the following example, a close button contains an "X" and is given the label “Close” using the `aria-label` attribute.

```
<button type="button" aria-label="Close">X</button>
```


### Explicit label only

Some roles do not get the label from the contents of the element; a label can only be set explicitly using the `aria-labelledby` or `aria-label` attributes. An explicit label does not override the contents of such elements.

Examples of such roles are (note that this is not a complete list):

* `alertdialog`

* `application`

* `article`

* `banner`

* `complementary`

* `navigation`

* `radiogroup`

* `search`

* `status`

For example, the `navigation` landmark could be labeled with the purpose of the landmark. In the following snippet, a "breadcrumbs" navigation region is labeled explicitly using the `aria-labelledby` attribute. The HTML `nav` element has the `navigation` role by default.

```
<nav aria-labelledby="breadcrumbs-label">
 <span id="breadcrumbs-label">You are here:</span>
  <a href="/">Home</a> &gt;
  <a href="/books/">Books</a> &gt;
  <a>Children's books</a>
</nav>
```


### Accessible name calculation

User agents follow the accessible name calculation algorithm to get the label for an element. This is defined in [https://w3c.github.io/accname/](https://w3c.github.io/accname/) and [https://w3c.github.io/html-aam/](https://w3c.github.io/html-aam/) for HTML.

User agents attempt to formulate labels for elements by walking through a list of potential naming methods and use the first that generates a name. The algorithm is roughly like this:

1. First, the `aria-labelledby` attribute is used if present.

2. If the label is still empty, the `aria-label` attribute is used if present.

3. If the label is still empty, then host-language-specific attributes or elements (e.g., the `alt` attribute on HTML `img`) are used if present.

4. If the label is still empty, then for roles that can take implicit label by default, the element’s contents.

5. Finally, if the label is still empty, then host-langauge-specific tooltip attributes or elements (e.g., the `title` attribute in HTML) are used if present.

Steps 1-2 are explicit label, and steps 3-5 are implicit label. The final step is a fallback mechanism. Generally when labelling an element, use one of the non-fallback mechanisms.

For example, for the HTML `input` element, the `placeholder` attribute is used as a fallback labeling mechanism if nothing else results in a label. For an `input` element, it is better to use a `label` element, since it does not disappear visually when the user focuses the form control.

#### Examples of non-recursive accessible name calculation

For example, an img element with just a src attribute has no label (don’t do this):

```
<img src="photo.jpg">
```


If there is a `title` attribute, then that is used as the label (fallback mechanism; generally avoid doing this):

```
<img src="photo.jpg" title="The Queen, holding a pigeon.">
```


If there is also an `alt` attribute (using `alt` for images is recommended), then that is used as the label, and the `title` attribute is instead used as the accessible description:

```
<img src="photo.jpg" alt="The Queen, holding a pigeon." title="Photo: Rex Features">
```


If there is also an `aria-label` attribute, then that overrides the `alt` attribute:

```
<img src="photo.jpg" aria-label="The Queen, holding a pigeon." title="Photo: Rex Features" alt="Sorry, this image failed to load.">
```


If there is also an `aria-labelledby` attribute, that wins over the other attributes (the `aria-label` attribute ought to be removed if it is not used):

```
<img src="photo.jpg" aria-label="This is ignored." title="Photo: Established Depiction" alt="Sorry, this image failed to load." aria-labelledby="the-queen">
<span id="the-queen">The Queen, holding a pigeon.</span>
```


#### Examples of recursive accessible name calculation

The accessible name calculation algorithm will be invoked recursively when necessary. An `aria-labelledby` reference causes the algorithm to be invoked recursively, and when computing an accessible name from content the algorithm is invoked recursively for each child node.

In this example, the label for the button is computed by recursing into each child node, resulting in "Move to trash".

```
<button>Move to <img src="bin.svg" alt="trash"></button>
```


When following an `aria-labelledby` reference, the algorithm avoids following the same reference twice in order to not end up in infinite loops.

In this example, the label for the button is computed by first following the `aria-labelledby` reference to the parent element, and then computing the label for that element from the child nodes, first visiting the `button` element again but ignoring the `aria-labelledby` reference and instead using the `aria-label` attribute, and then visiting the next child (the text node). The resulting label is "Remove meeting: Daily status report".

```
<div id="meeting-1">
 <button aria-labelledby="meeting-1"
         aria-label="Remove meeting:">X</button>
 Daily status report
</div>
```

## Descriptions

An element can be given an accessible description using the `aria-describedby` attribute or the `aria-details` attribute.

The `aria-describedby` attribute works similarly to the `aria-labelledby` attribute. For example, a button could be described by a later paragraph.

```
<button aria-describedby="trash-desc">Move to trash</button>
...
<p id="trash-desc">Items in the trash
will be permanently removed after 30 days.</p>
```


This description will be presented to the user as plain text. For example, if the description contains an HTML `img` element, a text equivalent of the image is computed.

```
<button>Move to <img src="bin.svg" alt="trash"></button>
...
<p id="trash-desc">Items in <img src="bin.svg" alt="the trash">
will be permanently removed after 30 days.</p>
```


In some cases, a plain text description is insufficient. The `aria-details` attribute can be used in such situations. In this example, a text field for a passenger’s name (when booking a flight) has a description that is a list of three items, and contains a link to an external document with further details.

```
<ul id="full-name-desc">
 <li>The passenger's name must match the name in their passport.</li>
 <li>The name must consist of only characters in the A-Z range.</li>
 <li><a href="faq.html#name">What if the name in the passport contains other characters?</a></li> 
</ul>
<fieldset>
 <legend>Passenger 1 (adult)</legend>
 <p><label>Full name
  <input name="full-name" aria-details="full-name-desc">
 </label></p>
 ...
</fieldset>
```


If both `aria-details` and `aria-describedby` are specified on an element, only the `aria-details` attribute is used. This can be useful in order to provide a fallback for user agents that don’t support `aria-details`.

### Accessible description calculation

Like the accessible name calculation, the accessible description calculation produces a plain text string for an element. This algorithm is not used for the `aria-details` attribute.

TODO ...
