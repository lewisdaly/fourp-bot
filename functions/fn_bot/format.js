

const formatRepliesForOptions = (options) => {
  return options.map(option => {
    return {
      content_type: 'text',
      title: option.text,
      payload: option.payload
    };
  });
}

module.exports = {
  formatRepliesForOptions: formatRepliesForOptions
};
