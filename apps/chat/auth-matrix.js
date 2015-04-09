module.exports =  function(){
  var acl = require('acl');
  acl = new acl(new acl.memoryBackend());
  acl.allow('user', '/', 'get');
  acl.allow('user', '/api/users', ['get', 'post']);
  acl.allow('user', '/api/channel', 'post');
  acl.allow('user', '/api/channels', 'get');
  acl.allow('user', '/api/channels.invite', ['get', 'post']);
  acl.allow('user', '/api/channel.info', 'get');
  acl.allow('admin', '/admin', 'get');
  acl.addRoleParents('admin', 'user');
  acl.addUserRoles('abc', 'user');
  acl.addUserRoles('foobar', 'user');
  acl.addUserRoles('xyz', 'admin');
  return acl;
}
