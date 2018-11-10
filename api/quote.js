const fs = require('fs-extra');
const {  } = require('../helper');

const quotesSourceFile = __dirname + "/../data/quotes.json";
const introSourceFile = __dirname + "/../data/intros.json";

module.exports = async function(req, res, next) {
  const quotes = await fs.readJson(quotesSourceFile);
  const intros = await fs.readJson(introSourceFile);

  const randomIndex = Math.randomNumber(0, quotes.length, true);

  const quote = quotes[randomIndex];

  const intro = new Array().concat(
    intros[0][Math.randomNumber(0, intros[0].length, true)],
    quote.author,
    intros[1][Math.randomNumber(0, intros[1].length, true)],
  ).join(" ");

  const randomQuoteRes = Object.assign(quote, {
    //intro: intro,
    contentDescriptors: {
      message: {
        description: "Nachricht",
        props: {
          value: intro + ":\n" + quote.message + " " + randomChars(7)
        }
      },
      name: {
        description: "Lehrer",
        props: {
          value: quote.author + " " + randomChars(5)
        }
      },
      firstname: {
        description: "Vorname",
        props: {
          value: quote.author.split(" ")[0]
        }
      }
    }
  });

  res.json(randomQuoteRes);

  next();
};

function randomChars(count) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  return new Array(count).fill("a").map(char => alphabet[Math.randomNumber(0, alphabet.length, true)]).join("")
}
