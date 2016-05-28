/* global shiftKey */
/* global shiftKey */
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


(function () {
  var 
      hotkeys = [],
      currentContext = false
  ;

  av.ready(function () {
    av.on(document.body, 'keydown', function (e) {
      var hit = false;

      hotkeys.forEach(function (option) {
        if (option.ctrlKey && !e.ctrlKey) return;
        if (option.shiftKey && !e.shiftKey) return;
        if (option.metaKey && (!e.metaKey && !e.ctrlKey)) return;
        if (option.altKey && !e.altKey) return;
        if (option.key !== String.fromCharCode(e.keyCode).toUpperCase()) return;
        if (option.context && option.context !== currentContext) return;
        if (av.isFn(option.fn) && option.fn) {
          option.fn();
          hit = true;
        }
      });
      if (hit) {
        return av.nodefault(e);
      }
    });
  });

  //Key format should be:
  /*
     S
     CTRL+S
     META+S
     ALT+CTRL+A
     F5   
     etc.
  */
  av.registerHotkey = function (key, context, fn) {
    var pa = key.toUpperCase().split('+'),
        obj = {}
    ;

    if (!fn) {
      fn = context;
      context = false;
    }

    obj.fn = fn;
    obj.context = context;

    pa.forEach(function (item) {
      if (item === 'CTRL') {
        obj.ctrlKey = true;
      } else if (item === 'SHIFT') {
        obj.shiftKey = true;
      } else if (item === 'META') {
        obj.metaKey = true;
      } else if (item === 'ALT') {
        obj.altKey = true;
      } else  {
        obj.key = item;
      }
    });

    hotkeys.push(obj);
  };

  av.setHotkeyContext = function (context) {
    currentContext = context;
  };
})();
