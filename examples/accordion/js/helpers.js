/*
Helper JavaScript functions Lib
Bryan Garaventa, 07/17/2016
*/
var query = function (s, o, fn) {
    if (!o) {
      o = document;
    }

    if (typeof fn == 'function') {
      return forEach(o.querySelectorAll(s), fn);
    }
    else {
      return o.querySelectorAll(s);
    }
  },
  forEach = function (obj, fn) {
    var a = obj;

    if (typeof fn != 'function') {
      return obj;
    }

    if (obj && obj.nodeType === 1) {
      a = [obj];
    }

    if (isArray(a) && a.length) {
      for (var i = 0; i < a.length; i++) {
        fn.apply(a[i], [i, a[i]]);
      }
    }
    else if (typeof a == 'object') {
      for (var n in a) {
        fn.apply(a, [n, a[n]]);
      }
    }

    return obj;
  },
  bind = function (obj, type, fn) {
    if (obj.attachEvent) {
      obj['e' + type + fn] = fn;

      obj[type + fn] = function () {
        obj['e' + type + fn](window.event);
      };

      obj.attachEvent('on' + type, obj[type + fn]);
    }
    else if (obj.addEventListener) {
      obj.addEventListener(type, fn, false);
    }

    return obj;
  },
  unbind = function (obj, type, fn) {
    if (obj.detachEvent) {
      obj.detachEvent('on' + type, obj[type + fn]);
      obj[type + fn] = null;
    }
    else if (obj.removeEventListener) {
      obj.removeEventListener(type, fn, false);
    }

    return obj;
  },
  getEl = function (e) {
    if (document.getElementById) {
      return document.getElementById(e);
    }
    else if (document.all) {
      return document.all[e];
    }
    else {
      return null;
    }
  },
  getElsByTag = function (tag, root) {
    var l = [],
      t = tag || '*',
      r = root || document;

    if (r.getElementsByTagName) {
      l = r.getElementsByTagName(t);
    }

    if (!l || !l.length) {
      if (t === '*' && r.all) {
        l = r.all;
      }
      else if (r.all && r.all.tags) {
        l = r.all.tags(t);
      }
    }

    return l;
  },
  createEl = function (t) {
    var o = document.createElement(t);

    if (arguments.length === 1) {
      return o;
    }

    if (arguments[1]) {
      setAttr(o, arguments[1]);
    }

    if (arguments[2]) {
      css(o, arguments[2]);
    }

    if (arguments[3]) {
      addClass(o, arguments[3]);
    }

    if (arguments[4]) {
      o.appendChild(createText(arguments[4]));
    }

    return o;
  },
  createText = function (s) {
    return document.createTextNode(s);
  },
  getAttr = function (e, n) {
    if (!e) {
      return null;
    }

    var a;

    if (e.getAttribute) {
      a = e.getAttribute(n);
    }

    if (!a && e.getAttributeNode) {
      a = e.getAttributeNode(n);
    }

    if (!a && e[n]) {
      a = e[n];
    }

    return a;
  },
  remAttr = function (e, n) {
    if (!e) {
      return false;
    }

    var a = (isArray(n) ? n : [n]);

    for (var i = 0; i < a.length; i++) {
      if (e.removeAttribute) {
        e.removeAttribute(a[i]);
      }
    }

    return e;
  },
  setAttr = function (obj, name, value) {
    if (!obj) {
      return null;
    }

    if (typeof name === 'string') {
      if (obj.setAttribute) {
        obj.setAttribute(name, value);
      }
    }
    else if (typeof name === 'object') {
      for (n in name) {
        if (obj.setAttribute) {
          obj.setAttribute(n, name[n]);
        }
      }
    }

    return obj;
  },
  css = function (obj, p, v) {
    if (!obj) {
      return null;
    }

    if (obj.nodeName && typeof p === 'string' && !v) {
      return (obj.style && obj.style[p] ? obj.style[p] : xGetComputedStyle(obj, p));
    }

    var o = (isArray(obj) ? obj : [obj]),
      check = 'top left bottom right width height';

    for (var i = 0; i < o.length; i++) {
      if (typeof p === 'string') {
        try {
          o[i].style[xCamelize(p)] = (check.indexOf(p) !== -1 && typeof v === 'number' ? v + 'px' : v);
        } catch (ex) {}
      }
      else if (typeof p === 'object') {
        for (var a = 1; a < arguments.length; a++) {
          for (var n in arguments[a]) {
            try {
              o[i].style[xCamelize(n)] = (check.indexOf(n) !== -1 && typeof arguments[a][n] === 'number' ? arguments[a][n] + 'px' : arguments[a][n]);
            } catch (ex) {}
          }
        }
      }
    }

    return obj;
  },
  trim = function (str) {
    return str.replace(/^\s+|\s+$/g, '');
  },
  isArray = function (v) {
    return v && typeof v === 'object' && typeof v.length === 'number' && typeof v.splice === 'function' && !v.propertyIsEnumerable('length');
  },
  inArray = function (search, stack) {
    if (stack.indexOf) {
      return stack.indexOf(search);
    }

    for (var i = 0; i < stack.length; i++) {
      if (stack[i] === search) {
        return i;
      }
    }

    return -1;
  },
  hasClass = function (obj, cn) {
    if (!obj || !obj.className) {
      return false;
    }

    var names = cn.split(' '),
      i = 0;

    for (var n = 0; n < names.length; n++) {
      if (obj.className.indexOf(names[n]) !== -1) {
        i += 1;
      }
    }

    if (i === names.length) {
      return true;
    }

    return false;
  },
  addClass = function (obj, cn) {
    if (!obj) {
      return null;
    }

    var o = (isArray(obj) ? obj : [obj]),
      names = cn.split(' ');

    for (var i = 0; i < o.length; i++) {
      for (var n = 0; n < names.length; n++) {
        if (!hasClass(o[i], names[n])) {
          o[i].className = trim(o[i].className + ' ' + names[n]);
        }
      }
    }

    return obj;
  },
  remClass = function (obj, cn) {
    if (!obj) {
      return null;
    }

    var o = (isArray(obj) ? obj : [obj]),
      names = cn.split(' ');

    for (var i = 0; i < o.length; i++) {
      if (o[i].nodeType === 1 && o[i].className) {
        for (var n = 0; n < names.length; n++) {
          var classes = o[i].className.split(' ');
          var a = inArray(names[n], classes);

          if (a !== -1) {
            classes.splice(a, 1);

            if (classes.length) {
              o[i].className = trim(classes.join(' '));
            }
            else {
              o[i].className = '';
            }
          }
        }
      }
    }

    return obj;
  },
  firstChild = function (e, t) {
    var e = (e ? e.firstChild : null);

    while (e) {
      if (e.nodeType === 1 && (!t || t.toLowerCase() === e.nodeName.toLowerCase())) {
        break;
      }

      e = e.nextSibling;
    }

    return e;
  },
  lastChild = function (e, t) {
    var e = (e ? e.lastChild : null);

    while (e) {
      if (e.nodeType === 1 && (!t || t.toLowerCase() === e.nodeName.toLowerCase())) {
        break;
      }

      e = e.previousSibling;
    }

    return e;
  },
  nextSib = function (e, t) {
    var e = (e ? e.nextSibling : null);

    while (e) {
      if (e.nodeType === 1 && (!t || t.toLowerCase() === e.nodeName.toLowerCase())) {
        break;
      }

      e = e.nextSibling;
    }

    return e;
  },
  prevSib = function (e, t) {
    var e = (e ? e.previousSibling : null);

    while (e) {
      if (e.nodeType === 1 && (!t || t.toLowerCase() === e.nodeName.toLowerCase())) {
        break;
      }

      e = e.previousSibling;
    }

    return e;
  },
  getClosest = function (start, targ) {
    while (start) {
      start = start.parentNode;

      if (typeof targ === 'string') {
        if (start.nodeName.toLowerCase() === targ.toLowerCase()) {
          return start;
        }
      }
      else if (targ.nodeType === 1) {
        if (start == targ) {
          return start;
        }
      }
    }

    return null;
  },
  insertBefore = function (f, s) {
    if (!f) {
      return s;
    }

    f.parentNode.insertBefore(s, f);
    return s;
  },
  insertAfter = function (f, s) {
    if (!f) {
      return s;
    }

    if (nextSib(f)) {
      f.parentNode.insertBefore(s, nextSib(f));
    }
    else {
      f.parentNode.appendChild(s);
    }

    return s;
  },
  xCamelize = function (cssPropStr) {
    var i, c, a, s;
    a = cssPropStr.split('-');
    s = a[0];

    for (i = 1; i < a.length; i++) {
      c = a[i].charAt(0);
      s += a[i].replace(c, c.toUpperCase());
    }

    return s;
  },
  xGetComputedStyle = function (e, p, i) {
    if (!e) {
      return null;
    }

    var s,
      v = 'undefined',
      dv = document.defaultView;

    if (dv && dv.getComputedStyle) {
      if (e == document) {
        e = document.body;
      }

      s = dv.getComputedStyle(e, '');

      if (s) {
        v = s.getPropertyValue(p);
      }
    }
    else if (e.currentStyle) {
      v = e.currentStyle[xCamelize(p)];
    }
    else {
      return null;
    }

    return (i ? parseInt(v) || 0 : v);
  },
  xOffset = function (c, p) {
    var o = {
        left: 0,
        top: 0
      },
      p = p || document.body;

    while (c && c != p) {
      o.left += c.offsetLeft;
      o.top += c.offsetTop;
      c = c.offsetParent;
    }

    return o;
  };
