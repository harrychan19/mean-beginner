var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  var users = [{
          "name": "lai",
          "age": 26,
          "sex": "boy"
     }];
  res.send(users);
});

module.exports = router;
