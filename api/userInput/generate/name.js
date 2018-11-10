const request = require('request');

module.exports = async function generateMail() {
  const userResult = (await request.promise("https://randomuser.me/api/")).body;
  const user = JSON.parse(userResult).results[0];



  const contentDescriptor = {
    //description: "Mail",
    props: {
      value: user.name.first + " " + user.name.last
      //className: 'hidden-input'
    },
    parentProps: {
      className: 'hidden-input'
    }
  };

  return contentDescriptor;
};
