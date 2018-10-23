function http(url, options) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method || "GET", url, true);
    xhr.responseType = options.responseType;
    xhr.timeout = options.timeout || Infinity;
    options.headers = options.headers || {};
    for (let headerName in options.headers) {
      if (options.headers.hasOwnProperty(headerName)) {
        xhr.setRequestHeader(headerName, options.headers[headerName]);
      }
    }
    xhr.addEventListener("load", function() {
      resolve(this.response);
    });
    xhr.addEventListener("error", function(event) {
      reject(event);
      //resolve(this.response);
    });
    xhr.send(options.body)

  });
}
