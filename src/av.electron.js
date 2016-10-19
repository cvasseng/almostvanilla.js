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
  if (typeof require === 'undefined') {
    return;
  }

  var ipc,
      events = av.events()
  ;

  try {
     ipc = require('ipc-renderer');
  } catch (e) {
    ipc = require('electron').ipcRenderer;
  }

  av.electron = av.ectron || {};

  av.electron.ipc = {
    /** Listen to an electron IPC message
     *  @type function
     *  @namespace av.electron.ipc
     */
    on: events.on,
    next: events.next,
    /** Emit an electron IPC message
     *  @namespace av.electron.ipc
     */
    emit: function () {
      var args = [
        'asynchronous-message'            
      ].concat(Array.prototype.slice.call(arguments));
      ipc.send.apply(undefined, args);    
    }
  };

  ipc.on('asynchronous-message', function (event, msg, payload) {
    var args = Array.prototype.slice.call(arguments);
    args.splice(0, 1);        
    events.emit.apply(this, args);
  });

})();