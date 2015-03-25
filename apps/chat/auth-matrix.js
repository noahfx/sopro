// the auth matrix is
// the intersection of a users' roles permissions
// subtracted from the global set of permissions

module.exports =  function(){
  var acl = require('acl');
  console.log('inside acl');
  acl = new acl(new acl.memoryBackend());
  console.log('acl breakpoint');
  //acl.allow('*', '*', '*');
  acl.allow('user', '/', 'get');
  acl.allow('user', '/api/users', 'get');
  acl.allow('user', '/api/channel', 'post');
  acl.allow('user', '/api/channels', 'get');
  acl.allow('user', '/api/channels.invite', ['get', 'post']);
  acl.allow('user', '/api/channel.info', 'get');
  acl.allow('admin', '/admin', 'get');
  acl.addRoleParents('admin', 'user');
  acl.addUserRoles('user-abc', 'user');
  acl.addUserRoles('user-xyz', 'admin');
  console.log('returning acl');
  return acl;
}