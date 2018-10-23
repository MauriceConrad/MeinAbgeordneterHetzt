const request = require('request');

module.exports = async function generateMail() {
  const userResult = (await request.promise("https://randomuser.me/api/")).body;
  const user = JSON.parse(userResult).results[0];

  const randomChars = ["a", "b", "c", "d", "e", "f", "g", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

  const contentDescriptor = {
    //description: "Mail",
    props: {
      value: user.email.insertAt(randomChars[Math.randomNumber(0, randomChars.length, true)], Math.trunc(Math.trunc(user.email.search("@") / 2))).replace("example.com", "web.com").replace(/[^\u0000-\u007F\.@]/g, 'a')
      //className: 'hidden-input'
    },
    parentProps: {
      className: 'hidden-input'
    }
  };

  return contentDescriptor;
};
