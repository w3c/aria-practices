# Example 1b: Author supplied values for <code>aria-level</code>, <code>aria-setsize</code> and <code>aria-posinset</code>
* In this example the ARIA treeview relationships (e.g. <code>tree</code>, <code>group</code> and <code>treeitem</code>) are defined in the parent child relationships defined int he DOM structure.
* This example the author specifies the values of <code>aria-level</code>, <code>aria-setsize</code> and <code>aria-posinset</code> for communication to accessibility APIs. Therefore this example does not rely on the browser to compute the values.
* Pressing "space" or "enter" will trigger the click event added to each <code>treeitem</code>, which updates the "File or Folder Selected" textbox. 
* Example based on the <a href="https://www.w3.org/TR/wai-aria-practices-1.1/#TreeView">WAI-ARIA 1.1: Tree View authoring practices</a>

## Keyboard Interaction and Focus Management
Key | Function
------------ | -------------
Up arrow Key | Moves focus to previous visible sibling <code>treeitem</code> using a depth first algorithm on the visible <code>treeitems</code>. If on first <code>treeitem</code>, focus stays on first <code>treeitem</code>.
Down arrow Key | Moves focus to next visible sibling <code>treeitem</code> using a depth first algorithm on the visible <code>treeitems</code>. If on last <code>treeitem</code>, focus stays on the last <code>treeitem</code>.
Left Arrow Key | <ul><li>For a <code>treeitem</code> that is an end node (e.g. no child <code>treeitem</code>s) or is in the collapsed state (e.g. has <code>[aria-expanded=false]</code>), focus moves to the parent <code>treeitem</code>. If a top level <code>treeitem</code> (e.g. parent is <code>tree</code>), focus stays on current <code>treeitem</code>.</li><li>For a <code>treeitem</code> that is in the expanded state (e.g. has <code>[aria-expanded=true]</code>) it toogles to the collapsed state. Focus remains on the current <code>treeitem</code>.</li></ul>
Right Arrow Key | <ul><li>For a <code>treeitem</code> that is an end node (e.g. no child <code>treeitem</code>s) focus stays on current <code>treeitem</code>.</li><li>For a <code>treeitem</code> that is in the collapsed state (e.g. has <code>[aria-expanded=false]</code>) it toogles to the expanded state and focus moves to the first child <code>treeitem</code>. If no child, focus stays on current <code>treeitem</code>.</li><li>For a <code>treeitem</code> is in the expanded state, focus moves to the first child <code>treeitem</code>. If no child, focus stays on current <code>treeitem</code>.</li></ul>
Return Key | Performs the default action (e.g. onclick event) on the current <code>treeitem</code>.
Space Key | Performs the default action (e.g. onclick event) on the current <code>treeitem</code>.
Home Key | Moves focus to first treeitem in the tree.
End Key | Moves focus to last visible <code>treeitem</code> (e.g. depth first) in the <code>tree</code>.
a-z, A-Z | <ul><li>Moves focus to next visible <code>treeitem</code> that starts with letter character.</li><li>Search wraps to first <code>treeitem</code> if not found after current <code>treeitem</code>.</li></ul>
* | Opens all the expandable <code>treeitem</code>s in the current leaf (e.g. siblings and current <code>treeitem</code>s), keyboard focus does not change.

## ARIA Roles
Role | Usage | Accessible Name Source
------------ | ------------- | -------------
tree | The tree view container has a <code>role=tree</code>. | <code>aria-labelledby</code> to visible label. 
treeitem | Each node in a tree has the <code>role=treeitem</code> and should be a DOM child of tree. | <ul><li>Child text content of <code>treeitem</code>.</li> <li><code>aria-label</code> for <code>treeitem</code>s that expand and collapse.</li></ul>
group | A collection of <code>treeitem</code>s to be expanded and collapsed are enclosed in a element with <code>role=group</code>. The <code>ul</code> element has the default role of <code>group</code>. | not needed

## ARIA Properties and States
Property/State | Usage
------------ | -------------
aria-expanded | <ul><li>Each element with <code>role=treeitem</code> that can be expanded or collapsed should have an <code>aria-expanded</code> attribute.</li><li>Each element with <code>role=treeitem</code> which is expanded should have <code>aria-expanded="true"</code>.</li><li>Each element with <code>role=treeitem</code> which is collapsed should have <code> aria-expanded="false"</code>.</li></ul>
aria-labelledby | Provides accessible name for the <code>tree</code> role.
aria-label | Provides accessible name for the <code>treeitem</code>s that are expandable and collapsable.
aria-level | <ul><li>Provides level information on how <em>deep</em> a <code>treeitem</code> is the nested structure of the treeview.</li><li>User agents are <strong>not</strong> required to compute the value of the <code>aria-level</code> property for a <code>treeitem</code> based on the nesting structure in the treeview, so authors must supply the <code>aria-level</code> value.</li><li><code>aria-level</code> is important since keyboard navigation of the tree results in changing levels and assistive technologies need this information to inform users of the change in level.</li></ul>
aria-setsize | <ul><li>Provides information on the <em>number</em> of <code>treeitems</code> in the leaf of the tree.</li><li>User agents are <strong>not</strong> required to automatically compute the value of the <code>aria-setsize</code> property for a <code>treeitem</code> based on the number of sibling <code>treeitem</code>s in the leaf of the treeview, so authors should supply the <code>aria-setsize</code> value based on the number of sibling <code>treeitem</code>s.</li><li>Assistive technologies use <code>aria-setsize</code> information to inform the user of how may items are in the leaf of a treeview.</li>
aria-posinset | <ul><li>Provides information on the <em>position</em> of a <code>treeitem</code> in the leaf of the tree.</li><li>User agents are <strong>not</strong> required to automatically compute the value of the <code>aria-posinest</code> property for a <code>treeitem</code> based on the it position in the leaf of the treeview, so authors should supply the <code>aria-posinset</code> value based on the position of <code>treeitem</code>.</li><li>Assistive technologies use <code>aria-posinset</code> information to inform the user of position of the <code>treeitem</code> in a leaf.</li></ul>

## <code>tabindex</code> values
Elements | Values	| Purpose
------------ | ------------- | -------------
[role=treeitem] | 0 or -1 | The <code>treeitem</code> with the current focus should have <code>tabindex=0</code>, all other <code>treeitem</code>s should have a tabindex value of -1.

## Events
Event |	Element |	Description
------------ | ------------- | -------------
keydown | [role=treeitem] | <ul><li>A <code>keydown</code> event listener is added to each element with <code>role=treeitem</code> to support moving focus between the <code>treeitem</code> with the keyboard.</li><li>The <code>keydown</code> event listener is useful for identifying the key codes associated with the <kbd>Left</kbd>, <kbd>Right</kbd>, <kbd>Up</kbd>, <kbd>Down</kbd>, <kbd>Home</kbd>, <kbd>End</kbd>, <kbd>Enter</kbd> and <kbd>space</kbd> keys.</li></ul>
keypress | [role=treeitem] | <ul><li>A <code>keypress</code> event listener is added to each element with <code>role=treeitem</code> to support moving focus between the <code>treeitem</code> with the keyboard.</li><li>The <code>keypress</code> event listener is useful for identifying the characters associated with the <kbd>a-z</kbd>, <kbd>A-Z</kbd> and <kbd>*</kbd> when typed by the user, since the <code>keypress</code> event computes a character based on the combination of the keys typed by the user.</li></ul>
click | [role=treeitem]  [aria-expanded] | <ul><li>Click event listener is added to each element with <code>role=treeitem</code> and <code>aria-expanded</code> to support opening and closing a branch of the tree with the mouse.</li><li>Click triggers "action" event associated with the element with <code>role=treeitem</code>.</li></ul>
focus | [role=treeitem] | Focus event listener is added to each element with <code>role=treeitem</code> to support visual styling of the <code>treeitem</code> when it recieves focus.
blur | [role=treeitem] | Blur event listener is added to each element with <code>role=treeitem</code> to support visual styling of the <code>treeitem</code> when it does not have focus.

## Keyboard Focus Styling
Elements | Focus Style | Focus Technique
------------ | ------------- | -------------
[role=treeitem] | <ul><li>border</li><li>background-color</li></ul> | <code>focus</code> and <code>blur</code> events are used to add and remove a "focus" class to the <code>treeitem</code> element.
[role=treeitem]  [aria-expanded] | <ul><li>border</li><li>background-color</li></ul> | <code>focus</code> and <code>blur</code> events are used to add and remove a "focus" class to the first child element (e.g <code>span</code> element) of the <code>treeitem</code> element.

## Synchronization of Visual and ARIA States
Elements | Description
------------ | ------------- 
[role=treeitem]  [aria-expanded] | <ul><li>The <code>:before</code> psuedo selector for <code>[aria-expanded=false]</code> and <code>[aria-expanded=true]</code> are used to change a <code>content</code> property.</li><li>The image source defined in the <code>content</code> property is used for visually indicating the expanded and collapsed states of an expandable <code>treeitem</code>.</li><li>The <code>content</code> property is preferred since it supports rendering of the image in high contrast settings of browsers and operating systems.  Other CSS techniques like <code>background-image</code> are not supported in high contrast modes.</li></ul> 

## Source Code: Example
<ul><li>HTML: <a href="treeview-1b.html" type="text/css">treeview-1b.html</a></li><li>CSS: <a href="treeview-1.css" type="tex/css">treeview-1.css</a></li><li>Javascript: <a href="treeview.js" type="text/javascript">treeview.js</a></li><li>Javascript: <a href="treeview-1-onclick.js" type="text/javascript">treeview-1-onclick.js</a></li></ul>

```
<div id="code-ex-1">
  <h3 id="tree1">
    File Viewer
  </h3>
  <ul role="tree" aria-labelledby="tree1">
    <li role="treeitem"
      aria-level="1"
      aria-setsize="3"
      aria-posinset="1"
      aria-expanded="false"
      aria-label="Projects">
      <span>
         Projects
      </span>
      <ul role="group">
        <li role="treeitem"
          aria-level="2"
          aria-setsize="5"
          aria-posinset="1"
          class="doc">
           project-1.docx
        </li>
        <li role="treeitem"
          aria-level="2"
          aria-setsize="5"
          aria-posinset="2"
          class="doc">
           project-2.docx
        </li>
        <li role="treeitem"
          aria-level="2"
          aria-setsize="5"
          aria-posinset="3"
          aria-expanded="false"
          aria-label="project-3">
          <span>
             project-3
          </span>
          <ul role="group">
            <li role="treeitem"
              aria-level="3"
              aria-setsize="3"
              aria-posinset="1"
              class="doc">
               project-3A.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="3"
              aria-posinset="2"
              class="doc">
               project-3B.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="3"
              aria-posinset="3"
              class="doc">
               project-3C.docx
            </li>
          </ul>
        </li>
        <li role="treeitem"
          aria-level="2"
          aria-setsize="5"
          aria-posinset="4"
          class="doc">
           project-4.docx
        </li>
        <li role="treeitem"
          aria-level="2"
          aria-setsize="5"
          aria-posinset="5"
          aria-expanded="false"
          aria-label="project-5">
          <span>
             project-5
          </span>
          <ul role="group">
            <li role="treeitem"
              aria-level="3"
              aria-setsize="6"
              aria-posinset="1"
              class="doc">
               project-5A.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="6"
              aria-posinset="2"
              class="doc">
               project-5B.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="6"
              aria-posinset="3"
              class="doc">
               project-5C.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="6"
              aria-posinset="4"
              class="doc">
               project-5D.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="6"
              aria-posinset="5"
              class="doc">
               project-5E.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="6"
              aria-posinset="6"
              class="doc">
               project-5F.docx
            </li>
          </ul>
        </li>
      </ul>
    </li>
    <li role="treeitem"
      aria-level="1"
      aria-setsize="3"
      aria-posinset="2"
      aria-expanded="false"
      aria-label="Reports">
      <span>
         Reports
      </span>
      <ul role="group">
        <li role="treeitem"
          aria-level="2"
          aria-setsize="3"
          aria-posinset="1"
          aria-expanded="false"
          aria-label="report-1">
          <span>
             report-1
          </span>
          <ul role="group">
            <li role="treeitem"
              aria-level="3"
              aria-setsize="3"
              aria-posinset="1"
              class="doc">
               report-1A.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="3"
              aria-posinset="2"
              class="doc">
               report-1B.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="3"
              aria-posinset="3"
              class="doc">
               report-1C.docx
            </li>
          </ul>
        </li>
        <li role="treeitem"
          aria-level="2"
          aria-setsize="3"
          aria-posinset="2"
          aria-expanded="false"
          aria-label="report-2">
          <span>
             report-2
          </span>
          <ul role="group">
            <li role="treeitem"
              aria-level="3"
              aria-setsize="4"
              aria-posinset="1"
              class="doc">
               report-2A.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="4"
              aria-posinset="2"
              class="doc">
               report-2B.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="4"
              aria-posinset="3"
              class="doc">
               report-2C.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="4"
              aria-posinset="4"
              class="doc">
               report-2D.docx
            </li>
          </ul>
        </li>
        <li role="treeitem"
          aria-level="2"
          aria-setsize="3"
          aria-posinset="3"
          aria-expanded="false"
          aria-label="report-3">
          <span>
             report-3
          </span>
          <ul role="group">
            <li role="treeitem"
              aria-level="3"
              aria-setsize="4"
              aria-posinset="1"
              class="doc">
               report-3A.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="4"
              aria-posinset="2"
              class="doc">
               report-3B.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="4"
              aria-posinset="3"
              class="doc">
               report-3C.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="4"
              aria-posinset="4"
              class="doc">
               report-3D.docx
            </li>
          </ul>
        </li>
      </ul>
    </li>
    <li role="treeitem"
      aria-level="1"
      aria-setsize="3"
      aria-posinset="3"
      aria-expanded="false"
      aria-label="Letters">
      <span>
         Letters
      </span>
      <ul role="group">
        <li role="treeitem"
          aria-level="2"
          aria-setsize="3"
          aria-posinset="1"
          aria-expanded="false"
          aria-label="letter-1">
          <span>
             letter-1
          </span>
          <ul>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="3"
              aria-posinset="1"
              class="doc">
               letter-1A.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="3"
              aria-posinset="2"
              class="doc">
               letter-1B.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="3"
              aria-posinset="3"
              class="doc">
               letter-1C.docx
            </li>
          </ul>
        </li>
        <li role="treeitem"
          aria-level="2"
          aria-setsize="3"
          aria-posinset="2"
          aria-expanded="false"
          aria-label="letter-2">
          <span>
             letter-2
          </span>
          <ul role="group">
            <li role="treeitem"
              aria-level="3"
              aria-setsize="4"
              aria-posinset="1"
              class="doc">
               letter-2A.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="4"
              aria-posinset="2"
              class="doc">
               letter-2B.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="4"
              aria-posinset="3"
              class="doc">
               letter-2C.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="4"
              aria-posinset="4"
              class="doc">
               letter-2D.docx
            </li>
          </ul>
        </li>
        <li role="treeitem"
          aria-level="2"
          aria-setsize="3"
          aria-posinset="3"
          aria-expanded="false"
          aria-label="letter-3">
          <span>
             letter-3
          </span>
          <ul role="group">
            <li role="treeitem"
              aria-level="3"
              aria-setsize="4"
              aria-posinset="1"
              class="doc">
               letter-3A.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="4"
              aria-posinset="2"
              class="doc">
               letter-3B.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="4"
              aria-posinset="3"
              class="doc">
               letter-3C.docx
            </li>
            <li role="treeitem"
              aria-level="3"
              aria-setsize="4"
              aria-posinset="4"
              class="doc">
               letter-3D.docx
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
  <p>
    <label>
      File or Folder Selected: 
      <input id="last_action"
           type="output"
           size="15">
    </label>
  </p>
</div>
```
