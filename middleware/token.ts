import { handleResponse } from '../utils/customResponse';

const jwt = require('jsonwebtoken');

export const authToken = async (req, res, next) => {
  const auth = req.header('Authorization');

  if (!auth) {
    return handleResponse(res, 400, 'Unauthorized, Please login');
  }

  const token = auth.split(' ')[1];

  if (!token) {
    return handleResponse(res, 400, 'Invalid token, Please login');
  }

  let user = {};

  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return handleResponse(res, 400, 'Invalid token, Please login', undefined, {
      error,
    });
  }

  req.user = user;
  next();
};
