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

/** Perform an Ajax request
 *
 * Same syntax as jQuery, with the exception that requests can be 
 * prepared and fired at a later time.
 *
 * @example 
 * av.ajax({
 *   url: 'http://google.com',
 *   success: function (data) {
 *       document.body.innerHTML = data; 
 *   }
 * });
 *
 * @emits OK - Emitted when the request suceeds
 *   > {anything} - the request result
 * @emits Error - Emitted when an error occures
 *   > {string} - the error message
 *
 * @param p {object} - The settings for the request
 *   > url {string} - the url
 *   > type {string} - the request type (get, post, update, delete)
 *   > dataType {string} - the expected return type (json, xml, text, octet)
 *   > data {anything} - the payload data
 *   > autoFire {boolean} - should we run the request right away?
 *   > headers {object} - headers to send, e.g. `{'Content-Type': 'application/json'}
 *   > sucess {function} - the function to call on success
 *     > {anything} - the request result
 *   > error {function} - the function to call on error
 *     > {string} - the error message
 *
 * @returns {object} - an interface to interact with the request
 *   > on {function} - listen to an event
 *   > fire {function} - perform the request
 *   > request {XMLHttpRequest} - the request object
 */
av.ajax = function (p) {
  var props = av.merge({
        url: false,
        type: 'GET',
        dataType: 'json',
        success: function () {},
        error: function () {},
        data: {},
        autoFire: true,
        headers: {}
      }, p),
      headers = {
        json: 'application/json',
        xml: 'application/xml',
        text: 'text/plain',
        octet: 'application/octet-stream'
      },
      r = new XMLHttpRequest(),
      events = av.events()
  ;
    
  if (!props.url) return false;
  
  r.open(props.type, props.url, true);

  if (!props.headers['Content-Type']) {
    r.setRequestHeader('Content-Type', headers[props.dataType] || headers.text);
  }

  Object.keys(props.headers).forEach(function (name) {
    r.setRequestHeader(name, props.headers[name]);
  });

  r.onreadystatechange = function () {
    events.emit('ReadyStateChange', r.readyState, r.status);
    
    if (r.readyState === 4 && r.status === 200) {         
      if (props.dataType === 'json') {        
        try {
          var json = JSON.parse(r.responseText);
          if (av.isFn(props.success)) {
            props.success(json);        
          }
          events.emit('OK', json);
        } catch(e) {
          if (av.isFn(props.error)) {
            props.error(e.toString(), r.responseText);
          }
          events.emit('Error', e.toString(), r.status);
        }      
      } else {
        if (av.isFn(props.success)) {
          props.success(r.responseText);
        }        
        events.emit('OK', r.responseText);
      }         
    } else if (r.readyState === 4) {
      events.emit('Error', r.status, r.statusText);
      if (av.isFn(props.error)) {
        props.error(r.status, r.statusText);
      }
    }
  };
  
  function fire() {
    try {
      r.send(JSON.stringify(props.data));            
    } catch (e) {
      r.send(props.data || true);      
    }    
  }
  
  if (props.autoFire) {
    fire();    
  }
  
  return {
    on: events.on,
    fire: fire,
    request: r
  }
};
