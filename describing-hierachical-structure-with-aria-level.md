# Describing Hierarchical Structure with `aria-level`

When elements have a hierarchical relationship, such as headers of sections or data in tree structures, `aria-level` is used to communicate the hierarchy between elements to assistive technologies. The value of `aria-level` is numeric, with `1` indicating the top level of the structure. The number increases for each level of nesting.

Do not use `aria-level` when the DOM structure already accurately represents the elements' heirachical relationships.

The `aria-level` attribute can be used on the following roles:
* `heading`
* `listitem`
* `row`
* `tablist` (not recommended)
* `grid` (not recommended)

## `heading` Role

Used together, the `aria-level` attribute and `heading` role will be treated the same by assistive technologies as the native HTML header elements: `h1`, `h2`, `h3`, `h4`, `h5` and `h6`. Do not use attribute `aria-level` and `heading` when a native HTML element can be used.

This example uses the `heading` role and `aria-level` attribute to communicate levels of headings for a graph created with an SVG. The headings "Deciduous Trees" and "Evergreen Trees" are both subheadings to "Total Trees".

```
<svg width="1000" height="1000">
<text x="10" y="10" role="header" aria-level="1">Total Trees:</text>
<text x="10" y="100" role="header" aria-level="2">Deciduous Trees:</text>
<text x="10" y="200" role="header" aria-level="2">Evergreen Trees:</text>
...
</svg>
```

### Remediation Uses Cases

Because the `aria-level` attribute and the `heading` role can be used to approximate a native HTML section heading element, legacy code which cannot be converted to using HTML header elements can add these 
roles and attributes to their website's header elements.

For example, "Definition of a Room" is a subsection of "Housing Specification":

```
<div role="heading" aria-level="1" class="header-big">Housing Specification</div>
<div role="section" aria-labelledby="room-definition">
  <div role="heading" aria-level="2" id="room-definition" class="header-small">Definition of a Room</div>
  ...
</div>
```

Equivalent (and preferred) HTML:

```
<h1>Housing Specification</h1>
<section aria-labelled="room-definition">
  <h2 id="room-definition">Definition of a Room</h2>
  ...
</section>
```

## `listitem` role

The `aria-level` attribute can be used on elements with `listitem` role to represent list subitems when the structure of the DOM tree does not imply the intended level of nesting. For example, to quote a item in a nested to-do list, use the 'aria-level' attribute on the list items. 

```
<blockquote>
<ul>
  <li aria-level="2">Wash Dishes</li>
</ul>
</blockquote>
<p>I can do this item but I can't do the other clean up items.</p>
```

## `treeitem` role

The attribute `aria-level` can be used on elements with role `treeitem` to explicitly set the level of items within the [Tree View Design Pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#TreeView). 

The computed `aria-level` of a `treeitem` within a tree is based on the number of 'group' role elements in the ancestor chain between the treeitem and the tree role, where the top level `treeitems` are `aria-level` 1.

TODO: Add an example of calculated aria-levels.

To override the `aria-level` calculated from the number of `group` role parents, set `aria-level` explictly.

```
<ul role='tree'>
  <li role='treeitem' aria-level='1'>
    What color should we make the bikeshed?
    <button>Show 98 hidden replies</button>
    <ul role='group'>
      <li role='treeitem' aria-level='100'>
        I disagree with all 98 people who have replied before me, it should be rainbow colored.
      </li>
    </ul>
  </li>
</ul>
```

## `row` Role

The `aria-level` attribute can be used on an element with `row` role to describe nesting of rows in a `treegrid`, as is explained in the [treegrid pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#treegrid). In this example, the DOM tree does not represent the heirachical relationship between rows. Each email is in a `tr` element, which are siblings in the DOM tree, therefore `aria-level` is necessary to communicate that the emails form a tree structure.

```
<table role='treegrid'>
  <tr>
    <th>From:</th>
    <th>Subject:</th>
  </tr>
  <tr aria-level='1'>
    <td>Laura</td>
    <td>We should definately cover the bikeshed in rainbows.</td>
  </tr>
  <tr aria-level='2'>
    <td>Fred</td>
    <td>Re: We should definately cover the bikeshed in rainbows.</td>
  </tr>
</table>
```

Do not use `aria-level` on rows that are in a `grid` or a `table` because only rows in a `treegrid` table are expected to have a heirachical relationship.

## `tablist` Role

The attribute `aria-level` can be used on elements with role `tablist` to represent nested tabs but it is not recommended.

## `grid` Role

The attribute `aria-level` can be used on elements with role `grid` to represent nested grids but it is not recommended.

