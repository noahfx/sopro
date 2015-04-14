var CAM_MOCKS = require('../common/mock-data.js');

module.exports = {
  haveValidAuthToken: {
    regex: /^I have a valid authentication token$/,
    fn: function(next){
      /*
      // TODO: Actually send the mock token to a backend instead of assuming it is valid
      var msg = {
        topic: 'token.authentication',
        fromRole: CAM_MOCKS.roleId1,
        payload: {
          token: CAM_MOCKS.validToken,
        }
      }
      eb.send('token_authentication', msg, next);
      */

      var err = null;
      try{
        validToken = CAM_MOCKS.validToken;
      } catch(e){
        err = e;
      } finally {
        if(err){
          next.fail(err);
        } else {
          this.validAuthToken = validToken;
          next();
        }
      }
    },
  },
}