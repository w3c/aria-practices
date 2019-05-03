# Live Regions

Live regions are perceivable regions of a web page that are typically updated as a result of an external event when user focus might be elsewhere. These regions are not always updated as a result of a user interaction. By marking such elements as live regions, users of assistive technology can be informed of the updated content automatically.

Examples of live regions are a chat log and an error message. However, different kinds of live regions have different expected behavior; users might expect an error message to disrupt what they are doing, since the error is important, but want to wait with reading new chat messages until they are done typing their own message.

## Live Region States and Properties

ARIA has the following attributes mark up live regions.

### `aria-live`

The `aria-live` attribute indicates that an element is a live region. Some roles implicitly set `aria-live`; this is discussed in a later section.

* `assertive`: assistive technologies can interrupt the user to provide this information.
* `polite`: assistive technologies will provide this information after the user is done with their current task.
* `off`: assistive technologies will not provide this information unless this region has focus.

With the exception of a few roles, the default value of `aria-live` is `off`.

TODO example

### `aria-relevant`

Dynamic content changes in a live region is sometimes significant, and sometimes not, depending on the kind of live region. For example, a disappearing old message in a chat log is not significant, and users do not need to be informed of the removal. However, for a list of online contacts, a disappearing contact is significant (it indicates that the contact is no longer online).

The `aria-relevant` attribute can be used to inform assistive technologies about which kinds of changes are relevant to inform users about. It takes a list of keywords, with the following meanings:

* `additions`: Element node additions
* `text`: Text or text alternative additions
* `removals`: Text content, text alternative, or element node removals
* `all`: Synonym to `additions removals text`

If `aria-relevant` is not specified, then the value of the closest ancestor element with an `aria-relevant` attribute is used. Specifying the `aria-relevant` attribute on an element overrides any value specified on an ancestor element. If there is no ancestor element with an `aria-relevant` attribute, the default value `additions text` is used.

TODO example

### `aria-atomic`

The `aria-atomic` attribute takes the values "true" and "false". The attribute can also be omitted.

When this attribute is set to `true`, assistive technologies will render the element as a whole, and not just parts that have been changed.

When this attribute is set to `false`, assistive technologies will only render the changes (as per `aria-relevant`) to the user.

When this attribute is omitted, the user agent will use the closest ancestor that has `aria-atomic` set to `true` or `false`, or if there is no such ancestor, `false`.

### `aria-busy`

Sometimes, it takes some time for a script to update the content of a live region. For example, it could be waiting on a network response. In order to avoid rendering half-baked content to users of assistive technology, the `aria-busy` attribute can be set to `true` while the content is being updated, and then to `false` when it is done.

TODO example

## Special Case Live Regions

The roles listed below implicitly set the `aria-live` attribute to indicate that it is a live region. When using these roles, the `aria-live` attribute can be omitted, or it can be specified to change the value from the default.

### `alert`

The `alert` role indicates important, usually time-sensitive, information. Use this role when focus is not moved to the message, and the user is not expected to close the message. For an alert dialog that can be closed, the the `alertdialog` role instead.

The default value for `aria-live` is `assertive`. The default value for `aria-atomic` is `true`.

TODO example

### `log`

The `log` role indicates that new information is added in meaningful order and old information might disappear.

The default value for `aria-live` is `polite`.

TODO example

### `status`

The `status` role indicates that content is advisory information for the user but is not important enough to justify an `alert`, often but not necessarily presented as a status bar.

Do not move focus to the element when the content is changed.

The default value for `aria-live` is `polite`. The default value for `aria-atomic` is `true`.

TODO example

### `timer`

The `timer` role is a numerical counter which indicates an amount of elapsed time from a start point, or the time remaining until an end point.

The `timer` role is a subclass of the `status` role. The default value of `aria-live` value of `off`.

Update the text content of the element to the current time measurement when it changes.

TODO example

### `marquee`

The `marquee` role indicates non-essential information that changes frequently.

The default value of `aria-live` value of `off`.

TODO example (stock ticker)

