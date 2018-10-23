const request = require('request');
const htmlParser = require('htmlparser');
const url = require('url');
const fs = require('fs-extra');

const DOM = require('../dom');

const {  } = require('../helper');


const servicesFile = __dirname + "/../data/services.json";

const services = fs.readJson(servicesFile);

request.promise = function() {
  const args = Array.from(arguments);
  return new Promise(function(resolve, reject) {
    request.apply(request, args.concat(function(err, response, body) {
      if (err) return reject(err);
      resolve({ response, body })
    }));
  });
}

module.exports = async function(req, res, next) {
  const service = JSON.parse(req.body.toString());

  if (url.parse(service).protocol == "mailto:") {
    return res.json([
      {
        "tagName": "input",
        "name": "cntctfrm_options_name",
        "type": "name",
        "defaultValue": "",
        "options": []
      },
      {
        "tagName": "input",
        "name": "cntctfrm_options_city",
        "type": "city",
        "defaultValue": "",
        "options": []
      },
      {
        "tagName": "input",
        "id": "cntctfrm_contact_subject",
        "class": "text cntctfrm_contact_subject",
        "name": "cntctfrm_contact_subject",
        "type": "subject",
        "defaultValue": "",
        "options": []
      },
      {
        "tagName": "textarea",
        "id": "cntctfrm_contact_message",
        "class": "text cntctfrm_contact_message",
        "name": "cntctfrm_contact_message",
        "type": "message",
        "options": []
      }
    ]);
  }

  const serviceRecord = (await services)[(await services).indexOfKey("url", service)];

  var form;

  const methodHandlers = {
    async frame() {
      return serviceRecord.content;
    },
    async form() {

      const serviceHTMLSite = await request.promise(service, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.1 Safari/605.1.15"
        }
      });

      const handler = new htmlParser.DefaultHandler(function(error, dom) {
        if (error) console.error(err);
      });
      const parser = new htmlParser.Parser(handler);
      parser.parseComplete(serviceHTMLSite.body);

      const dom = new DOM(handler.dom);

      return getForm(dom);
    }
  };
  if (serviceRecord.method in methodHandlers) {
    form = await methodHandlers[serviceRecord.method]();
  }

  res.json(form);

  next();
};

const getInputType = require('./userInput/getType');

function getInputElements(parent) {
  return new Array().concat(
    parent.getElementsByTagName("input"),
    parent.getElementsByTagName("textarea"),
    parent.getElementsByTagName("select")
  );
}

function getForm(dom) {
  // types that are required to identify a form as a contact form
  const requiredTypes = ["message"];
  //console.log(dom.root.getElementsByTagName("form"));

  //console.log(dom.root.getElementsByTagName("form")[0].innerHTML);

  const form = dom.root.getElementsByTagName("form").find(form => {

    const inputs = getInputElements(form);

    //console.log("\n");

    var requiredScore = 0;


    for (let input of inputs) {
      const type = getInputType(input);

      //console.log(input, input.attributes);

      if (requiredTypes.includes(type.name)) {
        requiredScore++;
      }
    }

    if (requiredScore > 0) {
      //console.log(form);
      return true;
    }

    //return true;
    //return form.attributes.method === "post" || form.innerText.search(/[a-z]/) > -1;
  });

  const userInputElements = getInputElements(form);


  const inputs = userInputElements.map(function(inputElement) {
    const type = getInputType(inputElement);

    //console.log(inputElement);

    return {
      tagName: inputElement.tagName,
      id: inputElement.attributes.id,
      class: inputElement.attributes.class,
      name: inputElement.attributes.name,
      type: type.name,
      defaultValue: inputElement.attributes.value,
      options: inputElement.getElementsByTagName("option").map(option => option.attributes.value)
    };
  });

  return inputs;

}
