# almostvanilla.js

**Very, very small (6kb minified) "library" that makes it easier to deal with events, real-time resizing/moving of nodes, the DOM, and drag 'n drop.**

After months and months of copy-pasting this stuff everytime I started a new web-based project,
I have finally pulled this out and made it into its own thing. Yay. It has served me very well as the foundation for web-apps.


#Building
 
To build almostvanilla.js, you need [bakor](https://github.com/iqumulus/bakor/) installed. Bakor is a node module, 
and must be installed globally, i.e. `npm install -g bakor`.
Once installed, build by running `bakor` in the project root directory.

This will produce a set of files in the `./build/` directory which can be included in your application.
 
#API Reference & Usage

## API
  
  * `av.ap(target, ...)`: append one or more DOM nodes to the DOM node `target`
  * `av.cr(type, [cssClass], [value], [id])`: create and return a new DOM node
  * `av.style(node(s), styleObject)`: style a node. Node can be an array, in which case all nodes will be styled at once
  * `av.byid(id)`: get a DOM node by id
  * `av.on(target(s), event, callback, [context]`: attach an event listener to a DOM node. Target can be an array of nodes.
  * `av.nodefault(event)`: use to cancel event propogation on the supplied DOM event handle
  * `av.merge(a, b)`: merge object `b` into object `a`. This is essentially a deep copy.
  * `av.copy(obj)`: deep-copy an object and return the copy
  * `av.size(node)`: returns an object - `{w, h}` - containing the size of the supplied DOM node
  * `av.pos(node)`: returns an object -`{x, y}` - containing the position of the supplied DOM node
  * `av.isNull(what)`: returns true if `what` is null or undefined
  * `av.isStr(what)`: returns true if `what` is a string
  * `av.isNum(what)`: returns true if `what` is a number
  * `av.isFn(what)`: returns true if `what` is a function
  * `av.isArr(what)`: returns true if `what` is an array
  * `av.isBool(what)`: returns true if `what` is a boolean
  * `av.isBasic(what)`: returns true if `what` is a basic type (number, string, function) 
  * `av.events()`: returns an event dispatcther object
  * `av.ready(fn)`: add a function to be called when initializing the library
  * `av.init()`: initialize the library, should be called on document.body.onload normally
  * `av.Mover(handle, target, axis)`: make a DOM node movable. Handle is the move handle, target is the node to move, and axis is the axis for which moving is allowed ('X', 'Y', or 'XY'). The returned object has an event emitter (`on(...)`) which can be used to listen to `Done`, `Moving`, and `Start` events.
  * `av.Resizer(handle, target, axis)`: make a DOM node resizable. Handle is the resize handle, target is the node to resize, and axis is the axis for which resizing is allowed ('X', 'Y', or 'XY'). The returned object has an event emitter (`on(...)`) which can be used to listen to `Done`, `Resizing`, and `Start` events.
  * `av.ajax(properties)`: perform an ajax request. Returns an object:
    * `on`: attach a listener to the ajax request
    * `fire`: perform the request (when `properties.autoFire` is set to false, this allows for the preparation of a request without immediatly performing it. It also allows for easy re-firing)
    * `request`: the `XMLHttpRequest` instance 
    
    The properties argument is an object with the following attributes:
    
    * `url`: the request url
    * `type`: the type of request (`GET POST PUT DELETE`) - default is `GET`
    * `dataType`: the data type for the payload, and return (`json xml text octet`) - default is `json`
    * `success`: function to call upon a sucessful request
    * `error`: function to call upon an error 
    * `data`: the payload
    * `autoFire`: automatically perform the request immediatly - default is `true`
  
##Quick Samples  
  
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
    
    .movable {
      position: absoulte;
    }
    
    var node = av.cr('div', 'movable', 'Move me!');   
    av.Mover(node);
    av.ap(document.body, node);
    
Example: create a resizable DIV:
    
    var node = av.cr('div', '', 'Resize me!'); 
    av.Resizer(node);
    av.ap(document.body, node);

# License

MIT. See LICENSE.md for details.
