# Describing Hierarchical Structure with `aria-level`

When elements have a hierarchical relationship within a structure, such as the headers for sections or data arranged in nested files, `aria-level` is used to communicate the hierarchy between elements to assistive technologies. The value of `aria-level` is numeric, with `1` indicating the top level of the structure. The number increases for each level of subsection of nesting.

Do not use `aria-level` when the DOM structure already accurately represents the element's relationship, as it does for most nest listed structures.

The attribute `aria-level` can be used on the following roles:
* `heading`
* `listitem`
* `row`
* `tablist`
* `grid`

## `heading` Role

Used together, the attribute `aria-level` and role `heading` will be treated the same by assistive technologies as the native HTML header elements: `h1`, `h2`, `h3`, `h4` and `h5`. Do not use attribute `aria-level` and `heading` when a native HTML element can be used.

This example uses the `heading` role and `aria-level` attribute to communicate levels of headings for a graph created with an SVG. The headings "Deciduous Trees" and "Evergreen Trees" are both subheadings to "Total Trees per Year".

```
<svg width="1000" height="1000">
<text x="10" y="10" role="header" aria-level="1">Total Trees per Year:</text>
<text x="10" y="100" role="header" aria-level="2">Deciduous Trees:</text>
<text x="10" y="200" role="header" aria-level="2">Evergreen Trees:</text>
...
</svg>
```

### Remediation Uses Cases

Because the attribute `aria-level` and the role `heading` can be used to approximate a native HTML section heading element, legacy code which cannot be converted to using HTML header elements should add these roles and attributes to their website's header elements.

For example, "Definition of a Room" is a subsection of "Housing Specification":

```
<div role="heading" aria-level="1" class="header-big">Housing Specification</div>
<div role="heading" aria-level="2" class="header-small">Definition of a Room</div>
```

Equivalent (and preferred) HTML:

```
<h1>Housing Specification</h1>
<h2>Definition of a Room</h2>
```

## `listitem` role

The attribute `aria-level` can be used on elements with role `listitem` to represent list subitems.

TODO: Example of appropriate use. Lazy loading part of a nest structure?

## `treeitem` role

The attribute `aria-level` can be used on elements with role `treeitem` to explicitly set the level of items within the [Tree View Design Pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#TreeView).

TODO: Example of appropriate use.

### Remediation Uses Cases

TODO: Are there remediation uses case for this role and attribute?

## `row` Role

The attribute `aria-level` can be used on an element with role `row` to describe nesting of rows, as is explained in the [treegrid pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#treegrid). 

## `tablist` Role

The attribute `aria-level` can be used on elements with role `tablist` to represent nested tabs.

TODO: Issue [#915 on ARIA](https://github.com/w3c/aria/issues/915)

## `grid` Role

The attribute `aria-level` can be used on elements with role `grid` to represent nested grids.

TODO: Issue [#915 on ARIA](https://github.com/w3c/aria/issues/915)

