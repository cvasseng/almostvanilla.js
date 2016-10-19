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
 
/** Event dispatcher
 *
 *  Used to handle dispatching and listening to events
 * 
 *  @example
 *  function MyObject() {
 *    var events = av.events();
 *    return {
 *      on: events.on,
 *      emitHello: function () {
 *        events.emit('Hello', 'Hello world!');
 *      }
 *    };     
 *  }
 *
 *  var instance = MyObject();
 *  instance.on('Hello', function (msg) {
 *    alert(msg); 
 *  });
 *
 *  instance.emitHello();
 * 
 *  @constructor
 */ 
av.events = function () {
  var listeners = {},
      count = 0
  ;

  //////////////////////////////////////////////////////////////////////////////
  
  /** Emit an event
   *
   *  This function accepts a variable number of arguments after the first
   *  concrete one, which will all be delegated to the listeners.
   *
   *  @memberof av.events
   *  @param which {string} - the event to dispatch
   */
  function emit (which) {
    var args = Array.prototype.slice.call(arguments);
    args.splice(0, 1);
    
    if (listeners[which]) {
      listeners[which].forEach(function (listener) {
        listener.fn.apply(listener.ctx, args);

        if (listener.once) {
          listener.remove();
        }
      });
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  
  /** Clear all event listeners
   *  @memberof av.events
   */
  function clear() {
    listeners = {};
  }

  //////////////////////////////////////////////////////////////////////////////

  /** Listen to an event
   *  Returns a function that can be called to unbind the event
   *  @memberof av.events
   *  @param evnt {string} - the event to listen for
   *  @param fn {function} - the function to call when emitted
   *  @param ctx {anything} - the calling context
   *  @param once {bool} - set to true to only listen for the next emitted
   *  @returns {function} - function that can be called to unbind the event
  */
  function on(evnt, fn, ctx, once) {
    var id = (typeof uuid !== 'undefined') ? uuid.v4() : (++count),
        s = []
    ;

    //Handle binding multiple things to the same event
    if (evnt && evnt.forEach) {
      evnt.forEach(function (v) {
        s.push(on(v, fn, ctx));
      });
      return function () {
        s.forEach(function (f) {
          f();
        });
      };
    }

    listeners[evnt] = listeners[evnt] || [];

    listeners[evnt].push({
      id: id,
      fn: fn,
      ctx: ctx,
      once: once,
      remove: remove
    });

    function remove () {
      listeners[evnt] = listeners[evnt].filter(function (b) {
        return b.id !== id;
      });
    };

    return remove;
  }

  //////////////////////////////////////////////////////////////////////////////
  //Bind to next event only 

  function next(evnt, ctx, fn) {
    return on(evnt, ctx, fn, true);
  }

  //////////////////////////////////////////////////////////////////////////////
  // Return public interface
  return {
    emit: emit,
    on: on,
    clear: clear
  };
};