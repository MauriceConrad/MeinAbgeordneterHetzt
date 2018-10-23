var hetze;
var mainApp;

window.addEventListener("load", async function() {

  hetze = new MeinAbgeordneterHetzt();


  mainApp = new Vue({
    el: '.view-main',
    data: {
      service: await hetze.service,
      quote: {
        message: "...",
        author: "..."
      },
      contents: {},
      loading: true,
      quoteReady: false,
      reportedCount: await hetze.api.action()
    },
    methods: {
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
          }
        }
        if (mainApp.service.method in methodHandlers) methodHandlers[mainApp.service.method]();
      }
    },
    mounted() {
      setInterval(async () => {
        this.reportedCount = await hetze.api.action();
      }, 2000);
    }
  });

  async function init() {
    mainApp.loading = true;
    mainApp.quoteReady = false;

    const newQuote = await hetze.getRandomHatespeech();
    mainApp.quote = newQuote;
    mainApp.quoteReady = true;

    const formInner = document.querySelector(".hatespeech-form .form-inner");
    formInner.removeAllChilds();

    const form = await hetze.form;

    mainApp.loading = false;

    // Loop trough each input item and try to fill it up with content
    for (let item of form) {
      console.log(item);

      const itemContainer = document.createElement("div");
      itemContainer.classList.add("item");

      const itemLabel = document.createElement("span");
      itemLabel.classList.add("item-label");

      // Create element node
      const itemElement = document.createElement(item.tagName);

      itemContainer.append(itemLabel);
      itemContainer.append(itemElement);

      formInner.append(itemContainer);

      // If the given type is not "undefind" (Whch stands for not recognizable)
      if (item.type != "undefined") {
        // Async method within the loop to do not stop it
        (async () => {
          // Initialize the content descriptor
          var contentDescriptor;
          // If this type of input is already described in the response of the new quote
          /*
            NOTE
            The requested new quote returns already content descriptors for specific type of inputs
          */
          if (item.type in newQuote.contentDescriptors) {
            contentDescriptor = newQuote.contentDescriptors[item.type];
          }
          // Current input type seems to not be elready described within the requested new quote
          else {
            // Request it seperately
            contentDescriptor = await hetze.api.content(item, item.type, true);
          }

          // If this returns a valid content descriptor
          if (contentDescriptor) {
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

            mainApp.contents[item.type] = itemElement.value;

          }
        })();
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

    }
  }

  init();

  console.log(mainApp.contents);
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
