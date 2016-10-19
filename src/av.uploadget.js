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
  var uploader = av.cr('input'),
      cb = function () {}
  ;
  
  uploader.type = 'file';
  
  av.style(uploader, {
    display: 'none'
  });
  
  av.ready(function () {
    av.ap(document.body, uploader);    
  });
  

  /** Read a file on the host selected by the user.
   *  @param props {object} - the settings
   *    > type {type} - the type to parse as `json`, `text`, `b64`, or `binary`
   *    > multiple {bool} - allow multiple selection
   *    > progress {function} - function to call when there's progress on the upload
   *      > percent {number} - the current progress in percent
   *    > success {function} - the function to call when the file has been parsed
   *      > {object} - file information
   *        > filename {string} - the filename
   *        > size {number} - the size of the file in bytes
   *        > data {string} - the file contents
   *    > error {function} - the function to call if an error occures
   *      > {string} - the error message
   */  
  av.readLocalFile = function (props) {
    var p = av.merge({
          type: 'text',
          multiple: false            
        }, props)
    ;
    
    if (av.isFn(cb)) {
      cb();
    }  
      
    cb = av.on(uploader, 'change', function () {      
      function crReader(file) {
        var reader = new FileReader();
                
        reader.onloadstart = function (evt) {
          if (av.isFn(p.progress)) {
            p.progress(Math.round( (evt.loaded / evt.total) * 100));
          }
        };
        
        reader.onload = function (event) {
          var data = reader.result;
          
          if (p.type === 'json') {
            try {
              data = JSON.parse(data);
            } catch (e) {
              if (av.isFn(p.error)) {
                p.error(e);
              }
            }
          }
          
          if (av.isFn(p.success)) {
            p.success({
              filename: file.name,
              size: file.size,
              data: data 
            });
          }    
        };
        
        return reader;
      }
      
      for (var i = 0; i < uploader.files.length; i++) {
        if (!p.type || p.type === 'text' || p.type === 'json') {
          crReader(uploader.files[i]).readAsText(uploader.files[i]);                            
        } else if (p.type === 'binary') {
          crReader(uploader.files[i]).readAsBinaryString(uploader.files[i]);
        } else if (p.type === 'b64') {
          crReader(uploader.files[i]).readAsDataURL(uploader.files[i]);
        }
      }      
    });
    
    uploader.multiple = p.multiple;
    
    uploader.click();
  };
})();

