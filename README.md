# almostvanilla.js

**Very, very small (<10kb minified) "library" that makes it easier to deal with events, real-time resizing/moving of nodes, the DOM, and drag 'n drop.**

Almostvanilla.js is written for modern browsers, and as such does not support old versions of chrome/safari/firefox (as in >3 years old),
nor IE 6/7/8. It is written in a functional manner with no prototype-based classes/objects. Everything is contained within a single global namespace - `av` - and there is no
augmentation of built-in objects. It does not offer any high-level UI functionality (e.g. widgets).

#Building

Run `npm install && node build`.

This will produce a set of files in the `./build/` directory which can be included in your application.
 
Note that you need to build av for the samples in `samples/` to work. 

**You can also download pre-built stable versions [here](https://github.com/cvasseng/almostvanilla.js/releases)** 
 
# API Reference
  
**Base Functions**  
  * `av.merge(a, b)`: merge object `b` into object `a`. Object `b` is in other words deep copied into object `a`.
  * `av.copy(obj)`: deep-copy an object and return the copy
  * `av.ready(fn)`: add a function to be called when initializing the library
  * `av.init()`: initialize the library. This is normally called automatically when the document is ready
  * `av.events()`: returns an event dispatcther object with the functions `on`, `emit`, and `clear`
  * `av.timestamp()`: returns a timestamp in `date hh:mm` format
  * `av.log(loglevel)`: log something. `logLevel` is a number from 1 to 5. The mapping is: `1=error, 2=warning, 3=notice, 4=silly, 5=silly`.
  * `av.setLogLevel(logLevel)`: sets the current log level. Set to 0 to disable logging. 

**Parsers**
  * `av.matchAndReplaceWithin(str, leftDelimiter, rightDelimiter, splitter, fn)`: matches text within two defined delimiters - the right side, and the left side. Ideal for extracting (and optionally replacing) e.g. `[[some token]]`, or `[[some token|some subtoken]]`.
    
**DOM API**
  * `av.ap(target, ...)`: append one or more DOM nodes to the DOM node `target`
  * `av.cr(type, [cssClass], [value], [id])`: create and return a new DOM node
  * `av.style(node(s), styleObject)`: style a node. Node can be an array, in which case all nodes will be styled at once
  * `av.byid(id)`: get a DOM node by id
  * `av.on(target(s), event, callback, [context]`: attach an event listener to a DOM node. Target can be an array of nodes.
  * `av.nodefault(event)`: use to cancel event propogation on the supplied DOM event handle
  * `av.size(node)`: returns an object - `{w, h}` - containing the size of the supplied DOM node
  * `av.pos(node)`: returns an object -`{x, y}` - containing the position of the supplied DOM node
  * `av.sel([target], selector)`: query selector function. Target is the node to query. If left blank, `document.body` will be queried.
  * `av.Mover(handle, target, axis)`: make a DOM node movable. Handle is the move handle, target is the node to move, and axis is the axis for which moving is allowed ('X', 'Y', or 'XY'). The returned object has an event emitter (`on(...)`) which can be used to listen to `Done`, `Moving`, and `Start` events. **Important:** `body` and `html` must be set to `width: 100%; height: 100%` for the mouse events to work properly!
  * `av.Resizer(handle, target, axis)`: make a DOM node resizable. Handle is the resize handle, target is the node to resize, and axis is the axis for which resizing is allowed ('X', 'Y', or 'XY'). The returned object has an event emitter (`on(...)`) which can be used to listen to `Done`, `Resizing`, and `Start` events.
  
**Type Checks**  
  * `av.isNull(what)`: returns true if `what` is null or undefined
  * `av.isStr(what)`: returns true if `what` is a string
  * `av.isNum(what)`: returns true if `what` is a number
  * `av.isFn(what)`: returns true if `what` is a function
  * `av.isArr(what)`: returns true if `what` is an array
  * `av.isBool(what)`: returns true if `what` is a boolean
  * `av.isBasic(what)`: returns true if `what` is a basic type (number, string, function, bool) 
  
**Hotkey System**  
  * `av.registerHotkey(key, [context], function)`: register a hotkey. Key is a string of keys, e.g. "META+S". Context is the context in which the hotkey is active. Function is the function to call when the key combination is entered.
  * `av.sethotkeyContext(context)`: set the current hotkey context
  
**Ajax** 
  
Ajax requests can be performed with `av.ajax(properties)`. The function returns an object with the following attributes:
  * `on`: attach a listener to the ajax request
  * `fire`: perform the request (when `properties.autoFire` is set to false, this allows for the preparation of a request without immediatly performing it. It also allows for easy re-firing)
  * `request`: the `XMLHttpRequest` instance 
  
The properties argument is an object:
    
    {
      url: 'request url',
      type: 'get|post|update|put',
      dataType: 'json|xml|text|octet',
      data: payload data,
      success: function to call on success,
      error: function to call on error,
      autoFire: bool - set to true (default) to perform the request immediatly
    }
    
**File Uploads**

The file upload system uses `FileReader` to upload, and parse local files in your applications.

It' used as such: `av.readLocalFile(properties)`, where properties is an object:
    
    {
      type: json|text|b64|binary,
      multiple: true|false,
      progress: function (percent) - function to call when the upload progress updates,
      success: function to call when the file has been uploded to the browser,
      error: function to call on errors
    }  
  
**Drag 'n Drop**

Drag and drop is handled with two different objects: 
  * `av.Draggable(target, type, payload)`: target is a DOM node, type is a string with type identifiers for the drag operation separated by whitespace, and payload is the data attached to the drag operation.
  * `av.DropTarget(target, types)`: target is a DOM node, types is a string with type identifiers separated by whitespace that the drop area accepts
  
`av.Draggable` makes a node draggable, while `av.DropTarget` turns a node into a drop target.

Both functions return an object with a `on` function, which can be used to listen for the following events:

Draggable events:
  * `DragStart` - emitted when starting a drag operation
  * `DragEnd` - emitted when completing a drag operation
  
Drop Target events:
  * `DragEnter` - emitted when a draggable object enters the drop target
  * `DragLeave` - emitted when a draggable object leaves the drop target
  * `DragOver` - emitted when holding a draggable object over the drop target
  * `Drop(payload, type, event)` - emitted when a draggable object is dropped on the target
  
**Electron**

If you're running your stuff in electron, you can use the `av.electron.ipc` object to send/receive ipc messages to/from your node process.

  * `av.electron.ipc.emit(message, arg1, arg2, ...)`: send an async message to the node process
  * `av.electron.ipc.on(message, fn)`: handle an incoming async message from the node process

#Quick Samples  
  
Example: creating a DIV and appending it to `document.body`:
    
    av.ap(document.body, av.cr('div', 'myclass', 'Hello world!'));    

Example: styling a DOM node:
    
    av.style(myDOMNode, {
      color: '#FFF',
      fontSize: '10px'
    });
    
Example: attaching an event listener to `document.body`:
    
    var cancelEvent = av.on(document.body, 'click', function (e) {
      ...
    });
    
    //cancelEvent is now a function that can be called to detach the listener
    
Example: creating an event listener:
    
    //Create an object with an event listener in it
    function MyObject() {
      var events = av.events();
    
      function sayHello() {
        events.emit('Hello');
      }
    
      return {
        sayHello: sayHello,
        on: events.on
      }
    }
    
    //Instance the object
    var foobar = MyObject();
    
    //Attach an event listener
    foobar.on('Hello', function () {
      console.log('foobar emitted Hello!');
    });
    
    //Call the hello function, which will emit the event and trigger the above handler
    foobar.sayHello();
    
Example: create a Movable DIV:
    
    CSS:
    
    html, body {
      width: 100%;
      height: 100%;  
    }
    
    .movable {
      position: absolute;
    }
    
    JavaScript:
    
    var node = av.cr('div', 'movable', 'Move me!');   
    av.Mover(node);
    av.ap(document.body, node);
    
Example: create a resizable DIV:
    
    var node = av.cr('div', '', 'Resize me!'); 
    av.Resizer(node);
    av.ap(document.body, node);
    
Example: get a file from the user, upload it to the browser, and output the data:

    av.readLocalFile({
      type: 'text',
      success: function (data) {
        av.ap(document.body,
          av.cr('div', '', 'Uploaded file ' + data.filename + ' (' + data.size + ' bytes)'),
          av.cr('pre', '', data.data)
        );  
      }  
    });

# License

MIT. See LICENSE.md for details.
