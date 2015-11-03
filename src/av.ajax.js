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

av.ajax = function (p) {
  var props = av.merge({
        url: false,
        type: 'GET',
        dataType: 'json',
        success: function () {},
        error: function () {},
        data: {},
        autoFire: true
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
  r.setRequestHeader('Content-Type', headers[props.dataType] || headers.text);

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
