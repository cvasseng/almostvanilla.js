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
      
  var defContext = 'default',
      currentContext = defContext
  ;

  //Key format should be:
  /*
     S
     CTRL+S
     META+S
     ALT+CTRL+A
     F5   
     etc.
     
     Returns a function that unbinds the hotkey.
  */
  av.registerHotkey = function (key, context, fn) {
    var pa = key.toUpperCase().split('+'),
        obj = {}
    ;

    if (!fn) {
      fn = context;
      context = defContext;
    }

    obj.fn = fn;
    
    pa.forEach(function (item) {
      if (item === 'CTRL' || item === '{CTRL}') {
        obj.ctrlKey = true;
      } else if (item === 'SHIFT' || item === '{SHIFT}') {
        obj.shiftKey = true;
      } else if (item === 'META' || item === '{META}') {
        obj.metaKey = true;
      } else if (item === 'ALT' || item === '{ALT}') {
        obj.altKey = true;
      } else  {
        obj.key = item;
      }
    });
    
    return av.on(document.body, 'keyup', function (e) {
      if (context !== currentContext) return;
      if (obj.ctrlKey && !e.ctrlKey)  return;
      if (obj.shiftKey && !e.shiftKey) return;
      if (obj.metaKey && (!e.metaKey && e.keyIdentifier != 'Meta')) return;
      if (obj.altKey && !e.altKey)  return;
      if (obj.key != String.fromCharCode(e.keyCode)) return;
      
      if (av.isFn(fn)) {
        obj.fn();
        return av.nodefault(e);
      }
    });
  };

  av.setHotkeyContext = function (context) {
    currentContext = context;
  };

})();
