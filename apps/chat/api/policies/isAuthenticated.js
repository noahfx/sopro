/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  if (req.headers['auth-token']) {
  	if (req.headers['auth-token'] == "12345") {
  		next();
  		return;	
  	}
  	return res.forbidden('You are not permitted to perform this action.');	
  }
  return res.forbidden('Missed Token Auth.');
};