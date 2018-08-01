module.exports = (app) => {
  const User = app.models.user

  return {

    create: (req, res) => {
      let user = new User(req.body.user)
      user.save((err, user) => {
        if(user) res.status(200).json(user)
        else res.status(400).json({ status: "USER_NOT_FOUND" })
      })
    },
    
    update: (req, res) => {
      User.findOneAndUpdate( {_id: req.user._id}, {$set: {name: req.body.user.name}}, {new:true} )
      .then( user => res.status(200).json(user) )
      .catch( err => res.status(400).json({ status: err }) )
    },
    
    helloworld: (req, res) => {
      res.status(200).json({ status: "HELLO WORLD" })
    },

    login: (req, res) => {
      if(req.body.username == null || req.body.password == null){
        res.status(400).json({ status: 'CREDENTIALS_REQUIRED' })
        return
      }

      User.findOne({username: req.body.username, password: req.body.password})
      .then(user => {
        const Auth = app.controllers.auth
        let payload = {
          user, expires: Auth.encode({ user: user, expires: new Date().getDate() + 1})
        }
        res.status(200).json({
          status: "SUCCESS",
          user,
          token: Auth.encode(payload)
        })
      })
      .catch( err => res.status(200).json({ status: "INVALID_CREDENTIALS" }) )
    }
  
  }
}
