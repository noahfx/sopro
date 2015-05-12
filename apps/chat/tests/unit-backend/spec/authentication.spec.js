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
  })

})
