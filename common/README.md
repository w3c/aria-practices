# ARIA Common Files

[This is the repository for aria-common](https://github.com/w3c/aria-common). It contains files shared by several other ARIA repositories, and copied into those repositories. Note *content must be updated in w3c/aria-common*; changes made in copies are overwritten next time content from this repository is synced.

Resources in the common files:

## Terms

The specifications share a common set of term definitions, located in [terms.html](terms.html). Add and update terms there, keeping in mind your edits will affect all specifications. To use the terms, at the place you want the terms to be included, provide the following line:

```html
<div data-include="../common/terms.html" data-oninclude="restrictReferences"></div>
```

This includes the terms file and filters it to only output ones that are referenced in that particular specification.

## Bibliography

The Respec processor loads a bibliography called [Specref](https://github.com/tobie/specref). This resource automatically includes most publications that have been published to the W3C Technical Reports page. While it is possible to request additions to this via pull requests, in practice to use references that are not in that database, it is easier to use a [`localBiblio`](https://github.com/w3c/respec/wiki/localBiblio). This allows the Respec configuration to load additional bibliographic entries, structured in the same way as in Specref.

Many of the supplementary bibliographic entries needed for the ARIA publications are common to several specifications. Therefore the bibliographic entries are all stored in [biblio.js](biblio.js). This is loaded with the other scripts at the top of the file with the following line:

```html
<script src="../common/biblio.js" class="remove"></script>
```

In the respecConfig, instead of providing the set of bibliographic entries directly, simply reference the object created by that script:

```html
localBiblio: biblio,
```

## Images, CSS, and Scripts

The `common` directory also contains shared images, CSS, and scripts. Some of the scripts extend the Respec formatting processor, and others are meant to be used with the final output version. When a resource is, or is likely to be, shared, put it in the common directory. Resources specific to a particular specification, including overriding CSS, can be placed in the directory for that specification. Use the same sub-directory structure of `img`, `css`, and `script` to help keep files organized.
