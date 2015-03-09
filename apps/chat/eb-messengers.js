if(CAM === undefined){
  throw new Error('eb-messengers.js requires a global CAM object')
}
CAM.send = {};



//**************Authentication*************************
// Deprecated. We now pass the token in each eventbus request.
/*
*/
CAM.send.authenticate = function (req, cb) {
  var token = '';

  req.headers().forEach(function(key, value) {
    if (key == "token-auth") {
      token = value;
    }
  });
  if (token) {
    eb.send("token.authentication",token, function (reply) {
      if (reply) {
        cb(null, true);  
      } else {
        cb('{"ok":false, "error":"Invalid Token!"}', null);
      }
    });
  } else {
    cb('{"ok":false, "error":"No token auth!"}', null);
  }
}
