# Live Regions

Live regions are perceivable regions of a web page that are typically updated as a result of an external event when user focus might be elsewhere. These regions are not always updated as a result of a user interaction. By marking such elements as live regions, users of assistive technology can be informed of the updated content automatically.

Examples of live regions are a chat log and an error message. However, different kinds of live regions have different expected behavior; users might expect an error message to disrupt what they are doing, since the error is important, but want to wait with reading new chat messages until they are done typing their own message.

## Live Region States and Properties

ARIA has the following attributes mark up live regions.

### `aria-live`

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

### `aria-relevant`

Dynamic content changes in a live region is sometimes significant, and sometimes not, depending on the kind of live region. For example, a disappearing old message in a chat log is not significant, and users do not need to be informed of the removal. However, for a list of online contacts, a disappearing contact is significant (it indicates that the contact is no longer online).

The `aria-relevant` attribute can be used to inform assistive technologies about which kinds of changes are relevant to inform users about. It takes a list of keywords, with the following meanings:

* `additions`: Element node additions
* `text`: Text or text alternative additions
* `removals`: Text content, text alternative, or element node removals
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

### `aria-atomic`

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

### `aria-busy`

Sometimes, it takes some time for a script to update the content of a live region. For example, it could be waiting on a network response. In order to avoid rendering half-baked content to users of assistive technology, the `aria-busy` attribute can be set to `true` while the content is being updated, and then to `false` when it is done.

Consider again the search form from the earlier example. When the user starts typing a new search into the search field, the script would update the search results live region, and maybe update multiple times as new search results appear, but it would be a better experience for users of assistive technology to only be notified when the new search is complete.

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
  const results = await getSearchResults(event.target.value);
  statusElement.ariaBusy = 'false';
  statusElement.textContent = `${results.length} result(s) found.`;
  showResults(results);
}
</script>
```

## Special Case Live Regions

The roles listed below implicitly set the `aria-live` attribute to indicate that it is a live region. When using these roles, the `aria-live` attribute can be omitted, or it can be specified to change the value from the default.

### `alert`

The `alert` role indicates important, usually time-sensitive, information. Use this role when focus is not moved to the message, and the user is not expected to close the message. For an alert dialog that can be closed, the the `alertdialog` role instead.

The default value for `aria-live` is `assertive`. The default value for `aria-atomic` is `true`.

See the [Alert design pattern](#alert) and the related [Alert Example](https://w3c.github.io/aria-practices/examples/alert/alert.html).

### `log`

The `log` role indicates that new information is added in meaningful order and old information might disappear.

The default value for `aria-live` is `polite`.

For example, a chat log would be an appropriate use case for the `log` role.

```
<div role="log">
 <p>[10:26] &lt;Charl> ok let's test it and see if it works</p>
 <p>[10:59] &lt;hsivonen> morning</p>
</div>
```

### `status`

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

### `timer`

The `timer` role is a numerical counter which indicates an amount of elapsed time from a start point, or the time remaining until an end point.

The `timer` role is a subclass of the `status` role. The default value of `aria-live` value of `off`.

Update the text content of the element to the current time measurement when it changes.

For example, a countdown to New Year could use `role="timer"`.

```
<h1>New Year Countdown</h1>
<p role="timer">2 minutes, 51 seconds</p>
```

### `marquee`

The `marquee` role indicates non-essential information that changes frequently.

The default value of `aria-live` value of `off`.

For example, a stock ticker that is crawling across the screen could use `role="marquee"`.
