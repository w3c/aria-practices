# Range Related Properties

ARIA provides the following four properties for communicating on the attributes of a range widget:

| Property | Definition |
| --- | --- |
| `aria-valuemin` | Defines the minimum value in the range. |
| `aria-valuemax` | Defines the maximum value in the range. |
| `aria-valuenow` | Defines the value of the element. This value is a number between `aria-valuemin` and `aria-valuemax` (if they are present). |
| `aria-valuetext` | Defines a description of the value of the element. |

The range related properties are used to describe an element whose value can be one of a range of values to assistive technologies. These properties communicate the maximum and minimum values for the element and the element's current value.

The range properties can also be used to describe an element whose value can be one of a list of non-numeric values. In this scenario, all possible text values of the element will be programmatically mapped to numbers within the numeric range by the author.

These attributes are used with the following roles:

* `slider`
* `spinbutton`
* `progressbar`
* `meter`
* `scrollbar`
* `separator` (if the element is focusable)

## Using `aria-valuemin` and `aria-valuemax`

When an element's possible values are contained within a known range, the attributes `aria-valuemin` and `aria-valuemax` are used to inform assistive technologies of the minimum and maximum values of the range. When using these properties, set `aria-valuemin` to the lowest value of the range and `aria-valuemax` to the greatest value.

When the range is unknown, omit both `aria-valuemin` and `aria-valuemax`. An example of such a widget is an indeterminate progress bar.

```
<progress>Loading...</progress>
```

## Using `aria-valuenow`

The attribute `aria-valuenow` is used to inform assistive technologies of the current value of an element. When `aria-valuemin` and `aria-valuemax` are specified, set `aria-valuenow` to a numeric value that is within the range define by `aria-valuemin` and `aria-valuemax`.

## Using `aria-valuetext`

When the element's values are contained within a range but those values are not numeric (such as "small", "medium" and "large"), `aria-valuetext` is used to surface the text value to assistive technologies. Only use `aria-valuetext` when `aria-valuenow` does not have meaning for the user because using `aria-valuetext` will prevent assistive technologies from communicating `aria-valuenow`.

## `slider` Role

`aria-valuenow`, `aria-valuemin` and `aria-valuemax` are all required attributes for the `slider` role. `aria-valuetext` can be used when appropriate. Detailed description of the `slider` role can be found in the [slider design pattern](https://w3c.github.io/aria-practices/#slider) and [slider (multi-thumb) design pattern](https://w3c.github.io/aria-practices/#slidertwothumb).

The following example is a temperature controller. `aria-valuetext` is not be used as the number value in `aria-valuenow` is meaningful to the user.

```
<div class="rail">
  <div id="thumb" role="slider" aria-valuemin="50" aria-valuenow="68" aria-valuemax="100"
       aria-label="Temperature (F)" tabindex="0">
  </div>
</div>

```

The slider example above can be made using the HTML input type=range element.

```
<input type="range" min="50" value="68" max="100" aria-label="Temperature (F)">
```

The following example is a fan control. The `aria-valuenow` value is "1", which is not meaningful to the user. The assistive technology will surface the value of `aria-valuetext` ("low") instead.

```
<div class="rail">
  <div id="thumb" role="slider" aria-valuemin="0" aria-valuenow="1" aria-valuemax="3"
       aria-valuetext="low" aria-label="Fan speed" tabindex="0" >
  </div>
  <div class="value"> Off </div>
  <div class="value"> Low </div>
  <div class="value"> Medium </div>
  <div class="value"> High </div>
</div>

```

## `spinbutton` Role

`aria-valuenow`, `aria-valuemin` and `aria-valuemax` are all required attributes for the `spinbutton` role. `aria-valuetext` can be used when appropriate.

This example sets the price of paperclips in cents.

```
<div role="spinbutton" aria-valuemin="1" aria-valuenow="50" aria-valuemax="200" tabindex="0">
  <button id="lower-price">Lower</button>
  <button id="raise-price">Raise</button>
  Price per paperclip: $<span id="price">0.50</span>
</div>
```

The slider example above can be made using the native HTML input type="number" element.

```
<input type="number" min="0.01" value="0.5" max="2" aria-labelledby="paperclip-label">
<span id="paperclip-label">Price per paperclip</span>:
$<output id="price" aria-labelledby="paperclip-label">0.50</output>
```

```
<label>Price per paperclip: $<input type="number" min="0.01" value="0.5" max="2" step="0.01"></label>
```

## `progressbar` Role

`aria-valuenow`, `aria-valuemin` and `aria-valuemax` are not required attributes for the `progressbar` role, however, but the attributes might be necessary for communicating the state of a progress bar to assistive technologies.

This is an example of a progress bar represent by an SVG. The range properties are necessary to full explain the widget to assistive technologies.

```
<div for="loadstatus">Loading:
  <span role="progressbar" id="loadstatus" aria-valuemin="0" aria-valuenow="33" aria-valuemax="100" >
    <svg width="100" height="10">
      <rect x="0" y="0" height="10" width="100" stroke="black" fill="none"/>
      <rect x="0" y="0" height="10" width="33" fill="green" />
    </svg>
  </span>
</div>
```

The progress bar example can be made using the native HTML progress element.

```
<label for="loadstatus">Loading:</label>
<progress id="loadstatus" max="100" value="33"></progress>
```

## `scrollbar` Role

`aria-valuenow`, `aria-valuemin` and `aria-valuemax` are all required attributes for the `scrollbar` role. The value of `aria-valuenow` will generally be exposed as a percentage between `aria-valuemin` and `aria-valuemax` calculated by assistive technologies.

```
<div id="pi">
3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679
</div>
<div class="rail">
  <div
    class="thumb"
    role="scrollbar"
    aria-controls="pi"
    aria-orientation="horizontal"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow="25">
  </div>
</div>
```
