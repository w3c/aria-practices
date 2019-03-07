Labeling and Describing

## Introduction

An accessible name is a name or a label used to identify the element for users of assistive technology. For example, a button’s accessible name can be "OK".

An accessible description complements the accessible name with a description. An accessible description is always optional, and if present it does not need to be as brief as an accessible name.

## Accessible name

### Name from content by default

For elements with certain roles, the accessible name is taken from the element’s contents by default. In the following example, a link (with default role "link") gets its accessible name from the element’s contents (“Home”).

```
<a href="/">Home</a>
```


The accessible name can be set explicitly by using the aria-labelledby or aria-label attributes. If the accessible name from the element’s contents is already good, then don’t use the aria-labelledby or aria-label attributes.

The following roles get the accessible name from the contents by default:

* button

* cell

* checkbox

* columnheader

* gridcell

* heading

* link

* menuitem

* menuitemcheckbox

* menuitemradio

* option

* radio

* row

* rowgroup

* rowheader

* switch

* tab

* tooltip

* treeitem

If the element’s contents is not appropriate as a label, but there is an element that can be used as the label, then use the aria-labelledby attribute.

In the following example, an element with the "switch" role is labeled by a previous sibling element.

```
<span id="night-mode-label">Night mode</span>
<span role="switch" aria-checked="false" tabindex="0" aria-labelledby="night-mode-label"></span>
```


Because a span element is used for the switch control, the HTML label element cannot be used to label it, since it only works with HTML elements that are form controls. However, the switch role can be used on an input element with type="checkbox”, and then HTML label can be used.

```
<label for="night-mode">Night mode</label>
<input type="checkbox" role="switch" id="night-mode">
```


In some cases, the combination of the element’s contents and another element would be appropriate as an accessible name. In such situations, use the aria-labelledby and reference both the element itself and the other element.

In the following example, a "read more" link is labeled by the element itself and the article’s heading, resulting in “Read more… 7 ways you can help save the bees”.

```
<h2 id="bees-heading">7 ways you can help save the bees</h2>
<p>Bees are disappearing rapidly.
Here are seven things you can do to help.</p>
<p><a id="bees-read-more aria-labelledby="bees-read-more bees-heading">Read more...</a></p>
```


If there is no content that is appropriate to use as the accessible name, use the aria-label attribute to set the label for the element directly.

In the following example, a close button contains an "X" and is given the accessible name “Close” using the aria-label attribute.

```
<button type="button" aria-label="Close">X</button>
```


### Name from author only

Some roles do not get the accessible name from the contents of the element. An accessible name set with the aria-labelledby or aria-label attributes does not override the contents of such elements.

Examples of such roles are (note that this is not a complete list):

* alertdialog

* application

* article

* banner

* complementary

* navigation

* radiogroup

* search

* status

For example, the navigation landmark could be labeled with the purpose of the landmark. In the following snippet, a breadcrumbs navigation region is labeled using the aria-label attribute.

```
<div role="navigation" aria-label="Breadcrumbs">
 You are here:
  <a href="/">Home</a> &gt;
  <a href="/books/">Books</a> &gt;
  <a>Children's books</a>
</div>
```


Alternatively, this can use the HTML nav element, which has the "navigation" role by default:

```
<nav aria-label="Breadcrumbs">
 You are here:
  <a href="/">Home</a> &gt;
  <a href="/books/">Books</a> &gt;
  <a>Children's books</a>
</nav>
```


### Accessible name calculation

User agents follow the accessible name calculation algorithm to get the label for an element. This is defined in [https://w3c.github.io/accname/](https://w3c.github.io/accname/) and [https://w3c.github.io/html-aam/](https://w3c.github.io/html-aam/) for HTML.

The aria-labelledby attribute is used first, then the aria-label attribute, then host-language-specific attributes or elements (e.g., the alt attribute on HTML img) or, for roles that can take the name from content, the element’s contents.

For example, an img element with just a src attribute has no accessible name (don’t do this):

```
<img src="photo.jpg">
```


If there is a title attribute, then that is used as the accessible name:

```
<img src="photo.jpg" title="The Queen, holding a pigeon.">
```


If there is also an alt attribute, then that is used as the accessible name, and the title attribute is instead used as the accessible description:

```
<img src="photo.jpg" alt="The Queen, holding a pigeon."
     title="Photo: Established Depiction">
```


If there is also an aria-label attribute, then that overrides the alt attribute:

```
<img src="photo.jpg" aria-label="The Queen, holding a pigeon."
     title="Photo: Established Depiction"
     alt="Sorry, this image failed to load.">
```


If there is also an aria-labelledby attribute, that wins over the other attributes (don’t do this):

```
<img src="photo.jpg" aria-label="This is ignored."
     title="Photo: Established Depiction"
     alt="Sorry, this image failed to load."
     aria-labelledby="the-queen">
<span id="the-queen">The Queen, holding a pigeon.</span>
```


## Descriptions

aria-describedby

aria-details

aria-roledescription

### Accessible description calculation

aria-describedby, aria-details, aria-placeholder?, placeholder, title
