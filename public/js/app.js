var hetze;
var mainApp;

window.addEventListener("load", function() {

  hetze = new MeinAbgeordneterHetzt();


  Promise.all([hetze.services, hetze.service, hetze.api.action()]).then(values => {
    const [ services, service, reportedCount ] = values;

    mainApp = new Vue({
      el: '.view-main',
      data: {
        services: services,
        activeService: 0,
        get service() {
          return this.services[this.activeService];
        },
        quote: {
          message: "...",
          author: "..."
        },
        contents: {},
        loading: true,
        quoteReady: false,
        reportedCount: reportedCount
      },
      methods: {
        loadForm(event) {
          //const closestLi = event.target.closest("li");
          loadForm();
        },
        newHatespeech(event) {
          event.preventDefault();
          init();
        },
        send(event) {
          const methodHandlers = {
            mail() {
              event.preventDefault();

              newMail({
                to: mainApp.service.mail,
                subject: mainApp.contents.subject,
                body: "Hetzer: " + mainApp.contents.name + "\nStadt: " + mainApp.contents.city + "\n\n" + mainApp.contents.message
              });
              //window.open("mailto:conr.maur@googlemail.com")
            },
            form() {
              hetze.api.action(null, "add");
            },
            frame() {
              event.preventDefault();

              const formElement = document.querySelector(".hatespeech-form");

              //formElement.method = "get";

              const defilterTypes = ["name", "message"];

              const queryStr = Object.keys(mainApp.contents).map(contentType => {
                console.log(contentType);
                return mainApp.contents[contentType].record.name + "=" + (defilterTypes.includes(contentType) ? defilter(mainApp.contents[contentType].value) : mainApp.contents[contentType].value);
              }).join("&");

              formElement.action += (formElement.action.search("\\?") > -1 ? "&" : "?") + queryStr;

              window.open(formElement.action);


              hetze.api.action(null, "add");
            }
          }

          if (mainApp.service.method in methodHandlers) methodHandlers[mainApp.service.method]();
        }
      },
      mounted() {
        function listenForUpdate() {
          hetze.api.action(null, "push").then(function(count) {
            console.log(count);
            mainApp.reportedCount = count;
            listenForUpdate();
          }).catch(function(err) {
            console.error(err);
            listenForUpdate();
          });
        }

        listenForUpdate();
      }
    });

    init();
  });

  function init() {
    mainApp.quoteReady = false;


    hetze.getRandomHatespeech().then(newQuote => {

      mainApp.quote = newQuote;
      mainApp.quoteReady = true;

      loadForm();
    });

  }

  function loadForm() {

    mainApp.contents = {};

    mainApp.loading = true;

    const formInner = document.querySelector(".hatespeech-form .form-inner");
    formInner.removeAllChilds();

    hetze.form(mainApp.service).then(form => {

      mainApp.loading = false;


      for (let item of form) {


        const itemContainer = document.createElement("div");
        itemContainer.classList.add("item");

        const itemLabel = document.createElement("span");
        itemLabel.classList.add("item-label");

        // Create element node
        const itemElement = document.createElement(item.tagName);

        itemContainer.appendChild(itemLabel);
        itemContainer.appendChild(itemElement);

        formInner.appendChild(itemContainer);

        // If the given type is not "undefind" (Whch stands for not recognizable)
        if (item.type != "undefined") {
          // Initialize the content descriptor
          var contentDescriptor;
          // If this type of input is already described in the response of the new quote
          /*
            NOTE
            The requested new quote returns already content descriptors for specific type of inputs
          */
          if (item.type in mainApp.quote.contentDescriptors) {
            contentDescriptor = new Promise(function(resolve, reject) {
              resolve(mainApp.quote.contentDescriptors[item.type]);
            });
          }
          // Current input type seems to not be elready described within the requested new quote
          else {
            // Request it seperately
            contentDescriptor = hetze.api.content(item, item.type, true);
          }

          contentDescriptor.then(contentDescriptor => {
            // Loop trough described properties
            for (var propName in contentDescriptor.props) {
              if (contentDescriptor.props.hasOwnProperty(propName)) {
                // Append each property and its value to the element
                itemElement[propName] = contentDescriptor.props[propName];
              }
            }

            for (var propName in contentDescriptor.parentProps) {
              if (contentDescriptor.parentProps.hasOwnProperty(propName)) {
                // Append each property and its value to the element
                itemElement.parentNode[propName] = contentDescriptor.parentProps[propName];
              }
            }

            if (contentDescriptor.description) {
              itemLabel.append(document.createTextNode(contentDescriptor.description));
            }

            //console.log(item.type in mainApp.contents, item.type);

            if (item.type in mainApp.contents) {
              itemElement.parentNode.classList.add("hidden-input");
            }

            mainApp.contents[item.type] = {
              record: item,
              value: itemElement.value
            };
          })

        }
        /*
          If the type of the element is "undefined"
          -> Hide the input element
          -> Set its value to the default one recognized by /form request
            (Actually this is the best we could do at this point)
        */
        else {
          itemElement.parentNode.classList.add("hidden-input");
          itemElement.value = item.defaultValue;
        }

        for (let option of item.options) {
          const optionElement = document.createElement("option");
          optionElement.value = option;
          itemElement.append(optionElement);
        }

        itemElement.name = item.name;
        itemElement.id = item.id;
        if (item.tagName === "input") {
          console.log("!");
          itemElement.type = "text";
        }

      }
    });
  }

});

function newMail(options) {
  const anchor = document.createElement("a");
  const href = 'mailto:' + options.to + "?subject=" + options.subject + "&body=" + encodeURIComponent(options.body);
  anchor.href = href;
  anchor.style = 'position: absolute; left: -100%; top: -100%;';
  document.body.append(anchor);

  anchor.click();
}


HTMLElement.prototype.removeAllChilds = function removeAllChilds() {
  while (this.children.length > 0) {
    this.removeChild(this.children[0]);
  }
};



function defilter(str) {

  return str.split(/[^a-z]/i).map(function(word) {
    return spamStr(word);
  }).join(" ");

  const blacklist = ["afd", "poggenburg", "gauland", "höcke", "petry", "bystron", "mdl", "mdb", "storch", "lucke", "Königer", "Hochtaunus"];
  for (let word of blacklist) {
    const regexp = new RegExp(word, "i");
    var startPos = 0;
    //console.log(word);
    while (str.match(regexp)) {
      const result = str.match(regexp);

      str = str.replaceAt(spamStr(result[0]), result.index, result.index + result[0].length);
      console.log(str);
    }
  }
  console.log(str);
  return str;
}
function spamStr(str) {
  //const spamChars = [".", "%", "&", "-", " ", "\\", "/", ...["a", "b", "c"]];
  var spamChars = new Array().concat(
    "abcdefghijklmnopqrstuvwxyz".split(""),
    "1234567890".split(""),
    "*#äöü_=)(/&%$§\"!".split("")
  );

  spamChars = ["*", "#", "_", "-", "&", ".", ",", ":", "_", "!"];
  spamChars = "abcdefghijklmnopqrstuvwxyz".split("");
  spamChars = [" ", "."];

  const randomPositions = new Array(str.length).fill(true).map((value, index) => index).filter(charIndex => charIndex == 0 ? true : Math.round(Math.random()));

  for (let char of str) {
    const index = str.indexOf(char);
    const spamming = index == 1 ? true : Math.round(Math.random());

    if (spamming && !spamChars.includes(char)) {
      const spamChar = spamChars[Math.randomNumber(0, spamChars.length, true)];
      str = str.replaceAt(spamChar, index, index);
    }
  }

  return str;
}

String.prototype.indexOfRegExp = function(regexp, start = 0) {
  return start + this.substring(start).search(regexp);
};
String.prototype.replaceAt = function(str, start, end) {
  return this.substring(0, start) + str + this.substring(end);
};
Math.randomNumber = function randomNumber(start, end, natural = false) {
  const random = Math.random() * (end - start) + start;

  return natural ? Math.trunc(random) : random;
}
