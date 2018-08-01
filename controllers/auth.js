module.exports = (app) => {
  const Jwt = require("jwt-simple")
  const User = app.models.user
  const config = require("../config/config.js")

  const decodeAccessToken = (accessToken) => {
    try {
      let token = Jwt.decode(accessToken, config.keys.jwt)
      if (token) {
        return Promise.resolve(token)
      } else {
        return Promise.reject(new Error("INVALID_TOKEN"))
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    encode: (payload) => Jwt.encode(payload, config.keys.jwt),
    decode: (token) => Jwt.decode(token, config.keys.jwt),
    userAuth: (req, res, next) => {
      let receivedToken = req.headers.access_token
      decodeAccessToken(receivedToken)
      .then(token => User.findById(token.user._id))
      .then(user => {
        req.user = user
        next()
      })
      .catch(error => {
        res.status(401).json({ status: "UNAUTHORIZED" })
      })
    }
  }
}
