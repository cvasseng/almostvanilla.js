/******************************************************************************

almostvanilla.js
https://github.com/cvasseng/almostvanilla.js/

Copyright (c) 2015 Chris Vasseng

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


******************************************************************************/

var av = {
  
  //Append nodes to a target
  ap: function (target) {
    var args = Array.prototype.slice.call(arguments);
    args.splice(0, 1);

    if (target && target.appendChild) {
      args.forEach(function (node) {
        target.appendChild(node);
      });
    }

    return target;
  },
  
  //Create a DOM node
  cr: function (type, cssClass, value, id) {
    var n = document.createElement(type);
    if (cssClass) {
      n.className = cssClass;
    }
    if ((value)) {
      n.innerHTML = value || '';
    }
    if ((id)) {
      n.id = id || '';
    }
    return n;
  },
  
  //Selector
  sel: function (target, st) {
    if (!st) {
      st = target;
      target = document.body;
    }
    
    if (target && target.querySelector) {
      return target.querySelector(st);
    }
  },
  
  //Get a node by id
  byid: function (node) {
    if (!av.isBasic(node) && node.appendChild) {
      return node;
    }
    return document.getElementById(node);
  },
  
  //Style one or more DOM nodes
  style: function (node, st) {
    if (node.forEach) {
      node.forEach(function (n) {
        av.style(n, st);
      });
      return node;
    }

    Object.keys(st).forEach(function (e) {
      node.style[e] = st[e];
    });
    
    return node;
  },
  
  //Attach a listener to one or more DOM nodes
  on: function (target, event, func, ctx) {
    var s = [];
    
    if (target === document.body && event === 'resize') {
      //Need some special magic here.
      // s.push(av.on(target, event, function () {
        
      // }));
    }
    
    if (target && target.forEach) {
      target.forEach(function (t) {
        s.push(av.on(t, event, func));
      });
    }
    
    if (s.length > 0) {
      return function () {
        s.forEach(function (f) {
          f();
        });
      };
    }

    function callback() {
      if (func) {
        return func.apply(ctx, arguments);
      }
      return;
    }

    if (target.addEventListener) {
      target.addEventListener(event, callback, false);
    } else {
      target.attachEvent('on' + event, callback, false);
    }   

    return function () {
      if (window.removeEventListener) {
        target.removeEventListener(event, callback, false);
      } else {
        target.detachEvent('on' + event, callback);
      }
    };
  },

  //Show node A when node B is hovered
  showOnHover: function(hover, show) {
    av.on(hover, 'mouseover', function () {
      av.style(show, {
        opacity: 1
      });
    });

    av.on(hover, 'mouseout', function () {
      av.style(show, {
        opacity: 0
      });
    });
  },
  
  //Used in event handles to cancel default behaviour
  nodefault: function (e) {
    e.cancelBubble = true;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;   
  },
  
  //Merge two objects
  merge: function (a, b) {
    if (!a || !b) return a || b;    
    Object.keys(b).forEach(function (bk) {
     if (av.isNull(b[bk]) || av.isBasic(b[bk])) {
        a[bk] = b[bk];
     } else if (av.isArr(b[bk])) {
       
       a[bk] = [];
       
       b[bk].forEach(function (i) {
         if (av.isNull(i) || av.isBasic(i)) {
           a[bk].push(i);
         } else {
           a[bk].push(av.merge({}, i));
         }
       });
       
     } else {
        a[bk] = av.merge({}, b[bk]);
      }
    });    
    return a;
  },
  
  //Copy an object
  copy: function (obj) {
    return av.merge({}, obj);
  },
  
  //Return the size of a node
  size: function (node) {
    return {
      w: node.offsetWidth,
      h: node.offsetHeight
    }
  },
  
  //Return the position of a node
  pos: function (node) {
    return {
      x: node.offsetLeft,
      y: node.offsetTop
    }
  },
  
  //Return true if what is null or undefined
  isNull: function (what) {
    return (typeof what === 'undefined' || what == null);
  },
  
  //Returns true if what is a string
  isStr: function (what) {
    return (typeof what === 'string' || what instanceof String);
  },
  
  //Returns true if what is a number
  isNum: function(what) {
    return !isNaN(parseFloat(what)) && isFinite(what);
  },
  
  //Returns true if what is a function
  isFn: function (what) {
    return (what && (typeof what === 'function') || (what instanceof Function));
  },
  
  //Returns true if what is an array
  isArr: function (what) {
    return (!av.isNull(what) && what.constructor.toString().indexOf("Array") > -1);
  },

  //Returns true if what is a bool
  isBool: function (what) {
    return (what === true || what === false);
  },
  
  //Returns true if what is a basic type 
  isBasic: function (what) {
    return !av.isArr(what) && (av.isStr(what) || av.isNum(what) || av.isBool(what) || av.isFn(what));
  },

  /* Parses a markup-like expression in a string
   *
   * e.g. matchAndReplaceWithin('[[test]]', '[[', ']]', false, fn)
   * will call fn with [test] as its argument.
   * [[test]] in the string will then be replaced by 
   * the return value from fn.
   *
   * @str is the string to parse
   * @lDel is the left side delimiter 
   * @rDel is the right side delimiter
   * @splitter is the delimiter between lDel and rDel
   * @fn is the function to call on match
   *
   * @returns the processed string
   */
  matchAndReplaceWithin: function(str, lDel, rDel, splitter, fn) {
    var l = lDel ? lDel.split('') : ['[', '['], 
        r = rDel ? rDel.split('') : [']', ']'],
        sp = splitter || '|',
        prop = '',
        inside = false,
        hit = false,
        res = '',
        cname = 'link'
    ;

    function check(a, from) {      
      for (var j = from; j < from + a.length; j++) {
        if (str[j] != a[j - from]) {
          return false;
        }
      }
      return true;
    }

    for (var i = 0; i < str.length; i++) {
      if (inside) {
        if (check(r, i)) {
          //We reached the end.
          prop = prop.split(sp);

          if (av.isFn(fn)) {
            res += fn(prop);
          } 
          
          i += l.length - 1;
          inside = false;
        } else {
          prop += str[i];
        }
      } else if (check(l, i)) {
        prop = '';
        i += l.length - 1;
        inside = true;
      } else {
        res += str[i];
      }
    }
    return res;
  },

  //Return a timestamp string
  timestamp: function () {
    var d = new Date();
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }
};

//Stateful functions
(function () {
  var readyFn = [],
      inited = false,
      poller = 0,
      logLevel = 4,
      logLevels = [
        'error',
        'warning',
        'notice',
        'silly',
        'insane'
      ] 
  ;    

  av.setLogLevel = function (nlevel) {
    if (nlevel >= 0 && nlevel <= logLevel.length) {
      logLevel = nlevel - 1;
    }
  }

  av.log = function (level) {   
    if (level <= logLevel && level > 0) {
      var args = Array.prototype.slice.call(arguments);
      args.splice(0, 1);
      console.log([av.timestamp(), '[almostvanilla]', logLevels[level - 1], '-'].concat(args).join(' '));      
    }
  }
  
  av.ready = function (fn) {
    if (inited) {
      if (av.isFn(fn)) {
        return fn();        
      }
    } else {
      readyFn.push(fn);
    }
  };
  
  function init() {
    if (window && window.document && window.document.body && !inited) {
      console.log("[almostvanilla] Initializing..");
      inited = true;
      readyFn = readyFn.filter(function (fn) {
        if (av.isFn(fn)) {
          fn(); 
        }
        return false;          
      });

      return true;
    }
    return false;
  }
  
  //Start polling for initialization - not ideal, but proved most stable after multiple tests.
  poller = setInterval(function () {
    if (window && window.document && window.document.body && !inited) {
      if (init()) {
        clearInterval(poller);        
      }
    }
  }, 200);
})();
