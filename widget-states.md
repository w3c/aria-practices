Issue for this section: https://github.com/w3c/aria-practices/issues/254

Related issues:
https://github.com/w3c/aria/issues/1008
https://github.com/w3c/aria/issues/681#issuecomment-506703445


## Communicating Widget States

ARIA can represent several different widgets, and these widgets can have different states,
for example in response to user interaction with the widget.

HTML also has built-in widgets and similar states.
When using HTML widgets that have built-in ways to represent these states,
do not use ARIA states.
Only use the HTML attributes.

For example, the `textarea` element can be marked as read-only using the `readonly` attribute.

```
<label>
 Address
 <textarea readonly></textaera>
</label>
```

This section covers what ARIA's widget states are,
which roles support each state,
how the ARIA states map to HTML's built-in widget states,
and how to use them.

### `aria-selected`

The `aria-selected` attribute indicates whether the element is selected.
Some widgets or parts of widgets can be selected.
A widget might allow only a single selection,
or can allow multiple items to be selected.
Use `aria-multiselectable="true"` to indicate that multiple values can be selected.

The `aria-selected` attribute allows these values:

* `true`: the element is selectable and is selected.
* `false`: the element is selectable but is not selected.
* `undefined` (default): the element is not selectable.

Typically, selection can be changed by clicking with a pointing device,
touching for touchscreens,
or using arrow keys with a keyboard.
When multiple selections are possible,
this might be done by holding a modifier key on the keyboard while clicking with a pointing device,
longpressing for touchscreens,
or using a modifier key (e.g. Shift) while pressing arrows on a keyboard to select adjacent items,
or using a different modifier key (e.g. Command or Control) while pressing arrows to move focus without changing the selection, and then pressing Space to select or unselect.
However, these paradigms might vary depending on what kind of widget it is,
and the conventions might be different depending on the kind of device and host operating system.

The `aria-selected` attribute is supported for these roles:

* `gridcell` (including the subclass roles `columnheader` and `rowheader`)
* `option` (including the subclass role `treeitem`)
* `row`
* `tab`

#### `gridcell`

A `gridcell` in a `grid` or `treegrid` supports the `aria-selected` state.
The widget could support selecting one or multiple cells.

TODO example.

#### `option`

`aria-selected` is a required state for the `option` role in a `listbox` element.
When an item is selected, specify `aria-selected="true"`.
When an item is not selected, specify `aria-selected="false"`;
do not omit the attribute.

See the [Combo Box](#combobox) and the [Listbox](#Listbox) design patterns for examples.

The `option` role and the subclass role `treeitem` support both `aria-selected` and `aria-checked`.
In most cases, using only `aria-selected` is the right choice.
Do not add both `aria-selected` and `aria-checked` "just in case",
since that would increase verbosity for assistive technology users and could cause unnecessary confusion.

In rare cases, a widget could support both selection and checkedness to represent orthogonal states,
although that could be complex and might be confusing for users.
For example, a `tree` widget to represent a changeable sequence of steps,
could allow selection in order to rearrange a set of steps,
and also allow checking and unchecking them to indicate which steps are active.

#### `row`

The `row` role within a `grid`, `table` or `treegrid` element supports the `aria-selected` state.

See the [ARIA 1.1 Combobox with Grid Popup Example](examples/combobox/aria1.1pattern/grid-combo.html)
of the [Combo Box](#combobox) design pattern.

#### `tab`

The `tab` role in a `tablist` element supports the `aria-selected` state,
to indicate which tab is active in a tab panel.

See the [Tabs](#tabpanel) design pattern for examples.

#### HTML elements that support selection

The HTML `select` element allows selection of either a single item
or multiple items, depending on the attributes on the `select` element.

Default selection can be specified with the `selected` attribute on the `option` element.

The user can change the selection, but this is not represented with any attributes.
Instead, there are DOM APIs to read and mutate the selection state from script.

### `aria-checked`

The `aria-checked` attribute indicates whether the element is checked.

The `aria-checked` attribute allows these values:

* `true`: the element is supports being checked and is checked.
* `false`: the element is supports being checked but is not checked.
* `mixed`: the element is supports being checked and is in the mixed state for a tri-state checkbox.
* `undefined` (default): the element does not support being checked.

The `aria-checked` attribute is supported for these roles:

* `checkbox` (including the subclass role `menuitemcheckbox`)
* `option` (including the subclass role `treeitem`)
* `radio` (including the subclass role `menuitemradio`)
* `switch`

However, the `mixed` value is only supported for the `checkbox` and `menuitemcheckbox` roles.

#### `checkbox`

`aria-checked` is a required state for the `checkbox` and `menuitemcheckbox` roles.

Set `aria-checked="true"` when the checkbox is checked,
and `aria-checked="false"` when it is unchecked.

A checkbox can support a third `mixed` state.
For example, if there is a group of checkboxes and one checkbox allows checking or unchecking the entire group,
that checkbox can be in the `mixed` state if the group of checkboxes have some checked and some unchecked.

See the [Checkbox](#checkbox) design pattern for examples.

#### `option`

The `option` role and the subclass `treeitem` role support `aria-checked`, but require the `aria-selected` state.

See the previous section on `aria-selected` for examples of when it can be appropriate to use `aria-checked`.

#### `radio`

`aria-checked` is a required state for the `radio` and `menuitemradio` roles.

A radio button usually participates in a group of radio buttons,
where checking one radio button unchecks the other radio buttons in the group.

Use `aria-checked="true"` on the radio button that is checked,
and `aria-checked="false"` on the other radio buttons in the group.

See the [Radio Group](#radiobutton) design pattern for examples.

#### `switch`

A switch control is similar to a checkbox.
It does not support the `mixed` state,
and it is said to be "on" or "off" rather than "checked" or "unchecked".
However, the `aria-checked` attribute is still used to indicate its state.

Use `aria-checked="true"` to indicate that the switch is on.
Use `aria-checked="false"` to indicate that the switch is off.

HTML does not (yet) have a native switch control.

### `aria-pressed`

The `button` role can represent a toggle button by using the `aria-pressed` attribute.
When the `aria-pressed` attribute is present and has a non-empty value,
the button is a toggle button.
A toggle button is a two-state button, either pressed or unpressed.

The `true` value indicates that the button is pressed, and
the `false` value indicates that the button is unpressed.

HTML does not have a native way to represent toggle buttons,
but `aria-pressed` can be used with the HTML `button` element.

```html
<button aria-pressed="false">Mute</button>
```

See the [Button](#button) design pattern for examples.

### `aria-expanded`

TODO

### `aria-disabled`

TODO

### `aria-readonly`


HTML equivalents:

```
<input readonly>
<input disabled>
<input type=checkbox checked>
<input type=checkbox>.indeterminate = true; <-> aria-checked = undefined
```

Push button can be implemented as:
```
<button> + aria-pressed, -webkit-appearance: none; for easier styling
```
