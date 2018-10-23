module.exports = function generateName() {
  const date = new Date();

  const contentDescriptor = {
    //description: "Datum",
    props: {
      value: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      //value: "21"
      //className: 'hidden-input'
    },
    parentProps: {
      className: 'hidden-input'
    }
  };

  return contentDescriptor;
};
