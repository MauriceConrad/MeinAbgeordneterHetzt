module.exports = function generatePhone() {

  const phoneNumber = [0, 1, 7, 6].concat(new Array(8).fill(0).map(number => Math.randomNumber(0, 10, true)));

  const contentDescriptor = {
    //description: "Telefonnummer",
    props: {
      value: phoneNumber.join(""),
      //className: 'hidden-input'
    },
    parentProps: {
      className: 'hidden-input'
    }
  };

  return contentDescriptor;
};
