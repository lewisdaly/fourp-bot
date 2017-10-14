const getError = (statusCode, message) => {
  let error = new Error(message);
  error.status = statusCode;

  return error;
}

const isNullOrUndefined = (thing) => {
  if (typeof thing === 'undefined') {
    return true;
  }

  if (this === null ) {
    return true;
  }

  return false;
}


module.exports = {
	getError: getError,
	isNullOrUndefined: isNullOrUndefined
};
