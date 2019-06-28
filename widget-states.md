Issue for this section: https://github.com/w3c/aria-practices/issues/254

Related issues:
https://github.com/w3c/aria/issues/1008
https://github.com/w3c/aria/issues/681#issuecomment-506703445


## Widget States

aria-selected
aria-checked
aria-pressed
aria-expanded
aria-disabled
aria-readonly


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
