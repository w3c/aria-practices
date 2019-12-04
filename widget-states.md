## Communicating Widget States

ARIA can represent several different widgets, and these widgets can have a variety of states,
such as an option being selected,
a checkbox being checked or unchecked,
or an accordion being expanded or collapsed.

The following table summarizes the states discussed in this section.

State           | Description | HTML equivalent
----------------|-------------|----------------
`aria-selected` | the element is chosen for further operation | `selected` IDL attribute on `option`
`aria-checked`  | the element is checked, unchecked, or mixed state | `checked` IDL attribute on `input`
`aria-pressed`  | for toggle buttons: pressed or unpressed | None
`aria-expanded` | an element owned or controlled by this element can be expanded or collapsed | None
`aria-disabled` | the element is not editable or operable | `disabled` content attribute on form controls
`aria-readonly` | the element is not editable, but is operable | `readonly` content attribute on `input` and `textarea`

HTML also has built-in widgets and similar states.
When using HTML widgets that have built-in ways to represent these states,
do not use ARIA states.
Only use the HTML attributes or APIs.

This section covers what ARIA's widget states are,
which roles support each state,
how the ARIA states map to HTML's built-in widget states,
and how to use them.

Note: The `aria-hidden` state is discussed in a separate section. TODO link

Note: The `aria-invalid` state is not yet covered in this document, but is planned to be part of a section about forms.

### `aria-selected`

The `aria-selected` attribute indicates whether the element is chosen for futher operation.
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

The `aria-selected` attribute is supported in these widgets:

Widget             | Roles in the widget where `aria-selected` applies
-------------------|-------------------
`grid`, `treegrid` | `row`, `gridcell`, `columnheader`, `rowheader`
`listbox`          | `option`
`tree`             | `treeitem`
`tablist`          | `tab`

#### Selecting rows and cells in `grid` and `treegrid`

A `gridcell` in a `grid` or `treegrid` supports the `aria-selected` state.
The widget could support selecting one or multiple cells.

TODO example.

The `row` role within a `grid`, `table` or `treegrid` element supports the `aria-selected` state.

See the [ARIA 1.1 Combobox with Grid Popup Example](examples/combobox/aria1.1pattern/grid-combo.html)
of the [Combobox](#combobox) design pattern.

#### Selecting options in listboxes and treeitems in trees

`aria-selected` is a required state for the `option` role in a `listbox` element.
When an item is selected, specify `aria-selected="true"`.
When an item is not selected, specify `aria-selected="false"`;
do not omit the attribute.

See the [Combobox](#combobox) and the [Listbox](#Listbox) design patterns for examples.

The `option` role and the subclass role `treeitem` support both `aria-selected` and `aria-checked`.
In most cases, using only `aria-selected` is the right choice.
Do not add both `aria-selected` and `aria-checked` "just in case",
since that would increase verbosity for assistive technology users and could cause unnecessary confusion.

In rare cases, a widget could support both selection and checkedness to represent orthogonal states,
although that could be complex and might be confusing for users.
For example, a `tree` widget to represent a changeable sequence of steps,
could allow selection in order to rearrange a set of steps,
and also allow checking and unchecking them to indicate which steps are active.

A further difference between selected and checked is that `aria-selected` is either selected or not selected,
whereas `aria-checked` supports a three states (`true`, `false`, and `mixed`).

#### Selecting tabs in a tablist

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

* `checkbox`, `menuitemcheckbox`
* `radio`, `menuitemradio`
* `switch`
* `option` (in a `listbox`)
* `treeitem` (in a `tree`)

However, the `mixed` value is only supported for the `checkbox` and `menuitemcheckbox` roles.

In HTML, the `<input type="checkbox">` element where the `indeterminate` IDL attribute is set to `true`
is by default mapped to `aria-checked="mixed"`.
There is no way to represent `indeterminate` declaratively with markup in HTML.

#### Checking checkboxes

`aria-checked` is a required state for the `checkbox` and `menuitemcheckbox` roles.

Set `aria-checked="true"` when the checkbox is checked,
and `aria-checked="false"` when it is unchecked.

A checkbox can support a third `mixed` state.
For example, if there is a group of checkboxes and one checkbox allows checking or unchecking the entire group,
that checkbox can be in the `mixed` state if the group of checkboxes have some checked and some unchecked.

See the [Checkbox](#checkbox) design pattern for examples.

#### Checking radio buttons

`aria-checked` is a required state for the `radio` and `menuitemradio` roles.

A radio button usually participates in a group of radio buttons,
where checking one radio button unchecks the other radio buttons in the group.

Use `aria-checked="true"` on the radio button that is checked,
and `aria-checked="false"` on the other radio buttons in the group.

See the [Radio Group](#radiobutton) design pattern for examples.

#### Toggling a switch

A switch control is similar to a checkbox.
It does not support the `mixed` state,
and it is said to be "on" or "off" rather than "checked" or "unchecked".
However, the `aria-checked` attribute is still used to indicate its state.

Use `aria-checked="true"` to indicate that the switch is on.
Use `aria-checked="false"` to indicate that the switch is off.

HTML does not (yet) have a native switch control.

#### Checking options in listboxes and treeitems in trees

The `option` role and the subclass `treeitem` role support `aria-checked`, but require the `aria-selected` state.

See the previous section on `aria-selected` for examples of when it can be appropriate to use `aria-checked`.

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

The `aria-expanded` attribute informs assistive technology users that an interactive element can be expanded,
meaning it owns or controls another element that can be collapsed or expanded.

For example, a button can toggle the visibility of some content, as in an accordion.

```html
<h2><button aria-controls="spoiler" aria-expanded="false">Spoil the end</button></h2>
<div id="spoiler">
 <p>Ultimately, all stars burn out and the black holes evaporate from Hawking radiation,
 and the universe reaches maximum entropy.</p>
</div>
```

Clicking the button shows or hides the "spoiler" element with JavaScript,
and also changes the value of `aria-expanded` to `true` when showing,
and `false` when hiding.
Users of assistive technology would know from focusing the button whether it is collapsed or expanded.

The `aria-expanded` state is used in these design patterns:

Design pattern             | Description
---------------------------|-------------
[Accordion](#accordion)    | A section With show/hide functionality
[Combobox](#combobox)      | An input widget with an associated popup
[Disclosure](#disclosure)  | A button that controls visibility of a section of content
[Listbox](#listbox)        | A list of options
[Menubar](#menu)           | A list of choices or actions
[Menu Button](#menubutton) | A button that opens a menu
[Toolbar](#toolbar)        | A set of controls
[Treegrid](#treegrid)      | A hierarchical data grid consisting of tabular information that is editable or interactive
[Tree View](#TreeView)     | A hierarchical list, possibly where items can be collapsed

### `aria-disabled`

The `aria-disabled` state indicates that the element is not editable or operable.

Usually, disabled elements are not focusable,
including descendants of the element.
However, in some composite widgets, it can be desirable to keep some elements focusable.
See the [Focusability of disabled controls](#kbd_disabled_controls) section.

Use CSS to change the appearance of disabled controls,
so that it is clear for visual users that the element is disabled.

The `aria-disabled` state is supported on the following roles:

* `application`
* `button`
* `composite` (including subclass roles `grid`, `combobox`, `listbox`, `menu`, `menubar`, `radiogroup`, `select`, `tablist`, `tree`, `treegrid`)
* `gridcell` (including subclass roles `columnheader` and `rowheader`)
* `group` (including subclass roles `row`, `toolbar`)
* `input` (including subclass roles `checkbox`, `menuitemcheckbox`, `menuitemradio`, `option`, `radio`, `searchbox`, `slider`, `spinbutton`, `switch`, `textbox`, `treeitem`)
* `link`
* `menuitem`
* `scrollbar`
* `separator`
* `tab`

In HTML, most built-in widgets can be disabled by using the `disabled` attribute.
There is no need to also use `aria-disabled` in such cases.

See the following design patterns for examples:

* [Accordion (Sections With Show/Hide Functionality)](#accordion)
* [Menu or Menu bar](#menu)
* [Toolbar](#toolbar)

### `aria-readonly`

The `aria-readonly` state indicates whether an element allows its value to be changed.

* `true`: the element does not allow its value to be changed, but is otherwise operable.
* `false`: the element allows the value to be changed.

The `aria-readonly` attribute is supported for these roles:

* `checkbox`, `menuitemcheckbox`, `switch`
* `combobox`
* `grid`, `treegrid`
* `gridcell`, `columnheader`, `rowheader`
* `listbox`
* `radiogroup`
* `slider`
* `spinbutton`
* `textbox`, `searchbox`
* `menuitemradio`

When an element is readonly, it should still be focusable and allow text selection,
only not allow editing or otherwise changing the value or state of the element.

When `aria-readonly` is applied to a `grid` or `treegrid`, the value is propagated to all `gridcells` in the widget.
Each `gridcell` can override this propagation by setting `aria-readonly` on the `gridcell`. See the [Grid Design Pattern](#grid) for examples.

HTML has the `readonly` attribute for the `input` and `textarea` elements.
When using those elements, use the `readonly` attribute instead of `aria-readonly`.
For example:

```
<label>
 Address
 <textarea readonly></textaera>
</label>
```
