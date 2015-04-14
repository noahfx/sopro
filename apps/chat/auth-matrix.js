module.exports =  function(){
  var acl = require('acl');
  acl = new acl(new acl.memoryBackend());
  acl.allow('identity', '/', 'get');
  acl.allow('identity', '/api/users', ['get', 'post', 'put']);
  acl.allow('identity', '/api/users/', ['get', 'post', 'put']);
  acl.allow('identity', '/api/channel', 'post');
  acl.allow('identity', '/api/channels', 'get');
  acl.allow('identity', '/api/channels.invite', ['get', 'post']);
  acl.allow('identity', '/api/channel.info', 'get');
  acl.allow('admin', '/admin', 'get');
  acl.addRoleParents('admin', 'identity');
  acl.addUserRoles('abc', 'identity');
  acl.addUserRoles('foobar', 'identity');
  acl.addUserRoles('xyz', 'admin');
  return acl;
}
