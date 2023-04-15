const CREATED = 201;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const BAD_REQUEST = 400;
const CONFLICT = 409;
const SERVER_ERROR = 500;
const UNATHORIZED = 401;
const URL_REG_EXP = /^(https?:\/\/.)[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;
const MONGO_DEV = 'mongodb://127.0.0.1:27017/bitfilmsdb';

module.exports = {
  CREATED,
  FORBIDDEN,
  NOT_FOUND,
  BAD_REQUEST,
  CONFLICT,
  SERVER_ERROR,
  UNATHORIZED,
  URL_REG_EXP,
  MONGO_DEV,
};
