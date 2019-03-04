Labeling and Describing

## Labels

A label is used as the accessible name for an element.

For elements with certain roles, the label is taken from the element’s contents by default. This can be overridden with a label from the author by using the aria-labelledby or aria-label attributes. If the label from the element’s contents is appropriate, then it should not be overridden with those attributes.

In the following example, a link (with default role "link") gets its label from the element’s contents.

```
<a href="/">Home</a>
```


The following roles get the label from the contents by default:

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

If the element’s contents is not appropriate as a label, but there is an element that can be used as the label, then authors should use the aria-labelledby attribute.

In the following example, an element with the "switch" role is labelled by a previous sibling element.

```
<span id="night-mode-label">Night mode</span>
<span role="switch" aria-checked="false" tabindex="0" aria-labelledby="night-mode-label"></span>
```


In some cases the combination of the element’s contents and another element would be appropriate as a label. In such situations, the aria-labelledby should be used and reference both the element itself and the other element.

In the following example, a "read more" link is labelled by the element itself and the article’s heading, resulting in “Read more… 7 ways you can help save the bees”.

```
<h2 id="bees-heading">7 ways you can help save the bees</h2>
<p>Bees are disappearing rapidly.
Here are seven things you can do to help.</p>
<p><a id="bees-read-more aria-labelledby="bees-read-more bees-heading"">Read more...</a></p>
```


If there is no visible label that is appropriate, authors should use the aria-label attribute to set the label for the element.

In the following example, a close button contains an "X" and is given the label “Close” using the aria-label attribute.

```
<button type="button" aria-label="Close">X</button>
```


Other roles do not get the label from the contents of the element. In these cases, an author-provided label does not override the element’s contents, but augments it. Examples of such roles are (note that this is not a complete list):

* alertdialog

* application

* article

* banner

* complementary

* navigation

* radiogroup

* search

* status

For example, the navigation landmark could be labeled with the purpose of the landmark. In the following snippet, a breadcrumbs navigation is labeled using the aria-label attribute.

```
<div role="navigation" aria-label="Breadcrumbs">
 You are here:
  <a href="/">Home</a> &gt;
  <a href="/books/">Books</a> &gt;
  <a>Children's books</a>
</div>
```


### Accessible name calculation

User agents follow the accessible name calculation algorithm to get the label for an element.

The following attributes are considered when calculating the accessible name, in this order:

1. aria-labelledby

2. aria-label (with some exceptions)

3. Host-language specific attributes or elements (e.g. the title attribute in HTML)

4. In some cases, for widgets that have a value, that value.

5. If the element’s role allows name from content, the element’s contents.

## Descriptions

aria-describedby

aria-details

aria-roledescription

### Accessible description calculation

aria-describedby, aria-details, aria-placeholder?, placeholder, title
