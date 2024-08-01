const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/ApiResponse");

const accessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
const refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET;
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

async function generateAccessToken(userInfo) {
  try {
    const payload = { userInfo };
    const options = { expiresIn: accessTokenExpiry };

    return jwt.sign(payload, accessTokenSecretKey, options);
  } catch (error) {
    console.error('Error generate Access Token:',error?.message);
  }
};

async function generateRefreshToken(userInfo) {
  try {
    const payload = { userInfo };
    const options = { expiresIn: refreshTokenExpiry };

    return jwt.sign(payload, refreshTokenSecretKey, options);
  } catch (error) {
    console.error('Error generate Refresh Token:',error?.message);
  }
};

function authorize(accessRole) {

  return (req, res, next) => {
    try {
      const bearerToken = req.header("Authorization");

      if (!bearerToken) {
        return ApiError(res, 401, "Unauthorized - Missing token");
      }

      const token = bearerToken.split(" ")[1];

      jwt.verify(token, accessTokenSecretKey, (err, data) => {
        if (err) {
          return ApiError(res, 403, "Forbidden - Invalid token");
        }
        
        // Check if user has the required role
        if (accessRole.length && !accessRole.includes(data?.userInfo?.type)) {
          return ApiError(res, 403, "Permission denied");
        }

        // // Attach the entire decoded data to the req object
        // req.user = data;

        next();
      });
    } catch (error) {
      console.error('Error authorize token:', error?.message);
      return ApiError(res, 500, "Internal Server Error");
    }
  };
};

async function verifyRefreshToken(token) {
  try {
    return new Promise((resolve, reject) => {
      jwt.verify(token, refreshTokenSecretKey, (err, data) => {
        if (err) {
          resolve({ error: true });
        } else {
          resolve(data);
        }
      });
    });
  } catch (error) {
    console.error('Error verify refresh token:', error?.message);
  }
};

module.exports = { generateAccessToken, generateRefreshToken, authorize, verifyRefreshToken };
