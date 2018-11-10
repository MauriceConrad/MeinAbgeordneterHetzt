const apiEndpoints = [
  "form",
  "services",
  "quote",
  "content",
  "action"
];


class MeinAbgeordneterHetzt {
  constructor() {

  }
  // General proxy trough API
  get api() {
    const apiProxy = {};
    for (var i = 0; i < apiEndpoints.length; i++) {
      const endpoint = apiEndpoints[i]

      apiProxy[endpoint] = function apiEndpointHandler(body, method = "") {
        // Return the promise of the 'http' (helper) method that requests the specific endpint and passes the given body as JSON
        return http("api/" + endpoint + "/" + method, {
          timeout: Infinity,
          method: body ? "POST" : "GET",
          responseType: "json",
          body: JSON.stringify(body)
        });
      }
    }
    return apiProxy;
  }
  get services() {
    return new Promise((resolve, reject) => {
      this.api.services().then(services => {
        resolve(services.filter(service => !service.disabled));
      });
    });
  }
  // Get the service used in the application
  // Mostly the first one returned by the API
  get service() {
    const hash = location.hash;
    return new Promise((resolve, reject) => {
      // Get general avaible and supported services
      this.api.services().then(services => {
        // Try to return first one (if not avaible, undefined)
        const specificService = services.find(service => service.id === hash.substring(1));

        resolve(specificService || services[0]);
      });
    });
  }
  getRandomHatespeech() {
    return this.api.quote();
  }
  // Getter thst returns the form data
  form(service) {
    /*return new Promise(async (resolve, reject) => {
      const service = await this.service;

      const form = await this.api.form(service);

      resolve(true);
    });*/
    return this.api.form(service.url);
  }


}
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
