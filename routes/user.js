module.exports = (app) => {
  const user = app.controllers.user
  const auth = app.controllers.auth

  app.post("/api/user", user.create)
  app.put("/api/user", auth.userAuth, user.update) //only authorized users
  app.get("/api/user", user.helloworld)

  app.post("/api/user/login", user.login)
}
