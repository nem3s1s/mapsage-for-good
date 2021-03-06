const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Customer = require("../models/customersModel")
const Masseur = require("../models/masseursModel")

//login request management
exports.handleLoginRequest = function(req, res) {
  Promise.all([
    Customer.findOne({ email: req.body.email }),
    Masseur.findOne({ email: req.body.email })
  ]).then(([customer, masseur]) => {
    var user;
    var user_type;
    if (customer != null) {
      user = customer
      user_type = "Customer"
    } else if (masseur != null) {
      user = masseur
      user_type = "Masseur"
    }

    if (user != null) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const payload = { _id: user._id }
        // JWT generation
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 30 * 86400}) //expiresIn expressed in seconds
        const cookieConfig = {
          httpOnly: true,
          maxAge: 30 * 86400 * 1000, // 30 days cookie
          signed: true
        }
        res.cookie('jwt', token, cookieConfig)
        res.json({ profile_type: user_type, _id: user._id })
      } else {
        res.json({ error: 'Wrong password' })
      }
    } else {
      res.status(404).json({ error: 'User does not exist' })
    }
  }).catch(err => {
    res.status(500).json({ error: "error while looking for user" })
  })
}

//logout request management
exports.handleLogoutRequest = function(req, res) {
  if (req.signedCookies.jwt != null) {
    const token = req.signedCookies.jwt;
    try {
      jwt.verify(token, process.env.SECRET_KEY);
      res.clearCookie("jwt");
      res.json({ description: "Logout succeded" })
    } catch (error) {
      res.sendStatus(401).json({error: "unauthorized user"}); // The JWT is not valid - verify method failed
    }
  } else {
    res.sendStatus(401).json({error: "unauthorized user"}); // No JWT specified
  }
}
