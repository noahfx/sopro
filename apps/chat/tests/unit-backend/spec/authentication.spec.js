/*
// This isn't really a unit test because there's a ton happening between the http request and the response.
// So it's mostly duplicating the loginPage acceptance test.
// But it returns html so it's not exactly an API route, and this test suite differs by avoiding all frontend
// It's commented out but left here for inspiration until we have real authentication unit tests


var request = require('request');
describe('Authentication', function(){
  describe('POST /login/password', function(){
    var sendLogin = request.defaults({
      method: 'POST',
      url: 'https://localhost/login/password/',
      strictSSL: false,
    })

    var loginErr;
    var loginRes;

    describe('with valid credentials', function(){
      beforeAll(function(done){
        sendLogin({
          qs:{
            username:'louise', 
            password: 'password'
          }
        }, function(err, res, body){
          loginErr = err;
          loginRes = res;
          done();
        })
      })

      it('302 redirects to /login/success', function(){
        expect(loginRes.statusCode).toBe(302);
        expect(loginRes.headers.location).toBe('/login/success');
      })
    });

    describe('with invalid credentials', function(){
      var invalidU = 'xxxxx';
      var invalidP = 'yyyyy';

      function tryInvalidLogin(callback){
        sendLogin({
          qs:{
            username: invalidU,
            password: invalidP,
          }
        }, function(err, res, body){
          loginErr = err;
          loginRes = res;
          callback();
        })
      }

      beforeAll(tryInvalidLogin)

      it('302 redirects to /login', function(){
        expect(loginRes.statusCode).toBe(302);
        expect(loginRes.headers.location).toBe('/login');
      })
      describe('follow redirect', function(){

      })

      it('passes the failed username back in thecontains', function(){
        expect(loginRes.statusCode).toBe(302);
        expect(loginRes.headers.location).toBe('/login');
      })
    });
  })

})
*/