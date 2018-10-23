module.exports = function generateCheckbox() {
  const contentDescriptor = {
    props: {
      type: "checkbox",
      checked: true,

    },
    parentProps: {
      className: 'hidden-input'
    }
  };

  return contentDescriptor;
};
