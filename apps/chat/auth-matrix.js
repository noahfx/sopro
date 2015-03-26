// the auth matrix is
// the intersection of a users' roles permissions
// subtracted from the global set of permissions
var acl = require('acl');

module.exports =  function(){
  acl = new acl(new acl.memoryBackend());
  //acl.allow('*', '*', '*');
  acl.allow('user', '/', 'get');
  acl.allow('admin', '/admin', 'get');
  acl.addRoleParents('admin', 'user');
  acl.addUserRoles('abc', 'user');
  acl.addUserRoles('xyz', 'admin');
  return acl;
}