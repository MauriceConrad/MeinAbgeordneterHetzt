module.exports = function generateCaptcha(item) {
  //console.log(item);

  const contentDescriptor = {
    props: {
      value: item.options[2],
      //className: 'hidden-input'
    },
    parentProps: {
      className: 'hidden-input'
    }
  };

  return contentDescriptor;
};
