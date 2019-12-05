# Live Regions

Live regions are perceivable regions of a web page that are typically updated as a result of an external event when user focus might be elsewhere. These regions are not always updated as a result of a user interaction. By marking such elements as live regions, users of assistive technology can be informed of the updated content automatically.

Examples of live regions are a chat log and an error message. However, different kinds of live regions have different expected behavior; users might expect an error message to disrupt what they are doing, since the error is important, but want to wait with reading new chat messages until they are done typing their own message.

## Live Region States and Properties

ARIA has the following attributes mark up live regions.

### Enable Live Regions with `aria-live`

The `aria-live` attribute indicates that an element is a live region. Some roles implicitly set `aria-live`; this is discussed in a later section.

* `assertive`: assistive technologies can interrupt the user to provide this information, but will not move the current focus, so the user's work flow is not interrupted.
* `polite`: assistive technologies will provide this information after the user is done with their current task.
* `off`: assistive technologies will not provide this information unless this region has focus.

With the exception of a few roles, the default value of `aria-live` is `off`.

For example, when the user types into a search field, the page could update the page with search results as the user is typing. To inform users of assistive technology that this has happened, a polite live region can be used. When the user is done typing, and the search is complete, the user is informed of how many results were found, without having to move focus away from the search field.

```
<form role="search" aria-labelledby="search">
 <h2 id="search">Search</h2>
 <label>Search query: <input type="search" name="q" oninput="updateSearch(event)"></label>
 <div id="search-result-status" role="region" aria-live="polite"></div>
</form>
<script>
async function updateSearch(event) {
  const statusElement = document.getElementById('search-result-status');
  const results = await getSearchResults(event.target.value);
  statusElement.textContent = `${results.length} result(s) found.`;
  showResults(results);
}
</script>
```

### Indicate What Content to Announce with `aria-atomic`

The `aria-atomic` attribute takes the values "true" and "false". The attribute can also be omitted.

When this attribute is set to `true`, assistive technologies will render the element as a whole, and not just parts that have been changed.

When this attribute is set to `false`, assistive technologies will only render the changes (as per `aria-relevant`) to the user.

When this attribute is omitted, the user agent will use the closest ancestor that has `aria-atomic` set to `true` or `false`, or if there is no such ancestor, `false`.

For example, consider a clock that can be set to notify the user of the current time at a regular interval. Without `aria-atomic`, the assistive technology might only notify the changed components, rather than the full time.

```
<div id="clock" role="region" aria-live="polite" aria-atomic="true">
 The time is
 <span>16</span>:<span>34</span>:<span>05</span>
</div>
```

### Indicate Which Content Changes are Relevant with `aria-relevant`

TODO update this to recommend only the default value.

Dynamic content changes in a live region is sometimes significant, and sometimes not, depending on the kind of live region. For example, a disappearing old message in a chat log is not significant, and users do not need to be informed of the removal. However, for a list of online contacts, a disappearing contact is significant (it indicates that the contact is no longer online).

The `aria-relevant` attribute can be used to inform assistive technologies about which kinds of changes are relevant to inform users about. It takes a list of keywords, with the following meanings:

* `additions`: Element nodes are added to the accessibility tree within the live region.
* `text`: Text content or a text alternative is added to any descendant in the accessibility tree of the live region.
* `removals`: Text content, a text alternative, or an element node within the live region is removed from the accessibility tree.
* `all`: Synonym to `additions removals text`

If `aria-relevant` is not specified, then the value of the closest ancestor element with an `aria-relevant` attribute is used. Specifying the `aria-relevant` attribute on an element overrides any value specified on an ancestor element. If there is no ancestor element with an `aria-relevant` attribute, the default value `additions text` is used.

For example, a list of online contacts could use `aria-live="all"`:

```
<div role="region" aria-live="polite" aria-relevant="all" aria-labelledby="contacts">
 <h1 id="contacts">Contacts</h1>
 <ul>
  <li><a href="/contacts/alice">Alice</a></li>
 </ul>
</div>
```
When a contact comes online, it is added to the list, and users of assistive technology are informed of the addition without disrupting their current task. Similarly when a user goes offline. If a contact changes their display name, the text change would also be announced.

Note that additions and removals in the accessibility tree can happen due to changes to the DOM tree or changes to the applied CSS. For example, changing the CSS `display` property to `none` causes the element to be removed from the accessibility tree. See the <a href="#accessibility-tree">Accessibility tree</a> section for more details.

### Triggering Live Regions

TODO

## Special Case Live Regions

The roles listed below implicitly set the `aria-live` attribute to indicate that it is a live region. When using these roles, the `aria-live` attribute can be omitted, or it can be specified to change the value from the default.

### Live Region Role `alert`

The `alert` role indicates important, usually time-sensitive, information. Use this role when focus is not moved to the message, and the user is not expected to close the message. For an alert dialog that can be closed, the the `alertdialog` role instead.

The default value for `aria-live` is `assertive`. The default value for `aria-atomic` is `true`.

See the [Alert design pattern](#alert) and the related [Alert Example](https://w3c.github.io/aria-practices/examples/alert/alert.html).

### Live Region Role `log`

The `log` role indicates that new information is added in meaningful order and old information might disappear.

The default value for `aria-live` is `polite`.

For example, a chat log would be an appropriate use case for the `log` role.

```
<h1 id="irc-log">IRC Log</h1>
<div role="log" aria-labelledby="irc-log">
 <p>[10:26] &lt;Charl> ok let's test it and see if it works</p>
 <p>[10:59] &lt;hsivonen> morning</p>
</div>
```

### Live Region Role `status`

The `status` role indicates that content is advisory information for the user but is not important enough to justify an `alert`, often but not necessarily presented as a status bar.

The default value for `aria-live` is `polite`. The default value for `aria-atomic` is `true`.

Do not move focus to the element with script when the content is changed.

For example, the search result summary example above could use `role="status"` instead of `role="region"`:

```
<form role="search" aria-labelledby="search">
 <h2 id="search">Search</h2>
 <label>Search query: <input type="search" name="q" oninput="updateSearch(event)"></label>
 <div id="search-result-status" role="status"></div>
</form>
```

The HTML `output` element has the `status` role by default. The `output` element is defined to represent the result of a calculation performed by the application, or the result of a user action. The result of a user search is thus appropriate use of the `output` element:

```
<form role="search" aria-labelledby="search">
 <h2 id="search">Search</h2>
 <label>Search query: <input type="search" name="q" oninput="updateSearch(event)"></label>
 <output id="search-result-status"></output>
</form>
```

### Live Region Role `timer`

TODO update to discourage use.

The `timer` role is a numerical counter which indicates an amount of elapsed time from a start point, or the time remaining until an end point.

The `timer` role is a subclass of the `status` role. The default value of `aria-live` value of `off`.

Update the text content of the element to the current time measurement when it changes.

For example, a countdown to New Year could use `role="timer"`.

```
<h1 id="newyear">New Year Countdown</h1>
<p role="timer" aria-labelledby="newyear">2 minutes, 51 seconds</p>
```

### Live Region Role `marquee`

TODO update to discourage use.

The `marquee` role indicates non-essential information that changes frequently.

The default value of `aria-live` value of `off`.

For example, a stock ticker that is crawling across the screen could use `role="marquee"`.

```
<div role="marquee" aria-label="Stocks">
 <p>Goosoft $8.24 +0.36</p>
 <p>Microle $35.60 &minus;0.78</p>
 <p>Banana $12.30 +0.09</p>
</div>
```

# Defer Exposing Content Updates using `aria-busy`

Sometimes, it takes some time for a script to update the content of a live region or a widget. For example, it could be waiting on a network response. In order to avoid rendering half-baked content to users of assistive technology, the `aria-busy` attribute can be set to `true` while the content is being updated, and then to `false` when it is done.

The ARIA specification allows, but does not require, assistive technologies to wait until `aria-busy` is changed to `false` before exposing content changes to the user. So assistive technologies are allowed to ignore the `aria-busy` attribute.

For assistive technologies that honor the `aria-busy` attribute, one possible implementation strategy is to not announce any content for elements when `aria-busy` is set to `true`. Therefore, it is important that the attribute is changed back to `false` when the content ought to be available to the user. For example, when the update is complete, but also when there is an error, or if the update is aborted. Otherwise, content could be left inaccessible to assistive technology users.

Consider the search form from the earlier example in the [Live Resions](#live-regions) section. When the user starts typing a new search into the search field, the script would update the search results live region, and maybe update multiple times as new search results appear, but it would be a better experience for users of assistive technology to only be notified when the new search is complete.

```
<form role="search" aria-labelledby="search">
 <h2 id="search">Search</h2>
 <label>Search query: <input type="search" name="q" oninput="updateSearch(event)"></label>
 <div id="search-result-status" role="region" aria-live="polite"></div>
</form>
<script>
async function updateSearch(event) {
  const statusElement = document.getElementById('search-result-status');
  statusElement.ariaBusy = 'true';
  statusElement.textContent = 'Searching...';
  try {
    const results = await getSearchResults(event.target.value);
    statusElement.textContent = `${results.length} result(s) found.`;
  } catch (ex) {
    statusElement.textContent = "There was an error when searching. Please try again.";
  }
  statusElement.ariaBusy = 'false';
  showResults(results);
}
</script>
```

TODO link to Feed design pattern
