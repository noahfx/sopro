// Couchdb Readme

SSL key generation:

This did NOT work for me in windows git bash. I used windows cmd line.
```
cd apps\chat\couchdb
openssl genrsa -out 192.168.10.206.key 2048
openssl req -new -key 192.168.10.206.key -out 192.168.10.206.csr
openssl x509 -req -sha256 -days 365 -in 192.168.10.206.csr -signkey 192.168.10.206.key -out 192.168.10.206.crt
```

Java Keystore setup
```
keytool -import -trustcacerts -alias 192.168.10.206 -file 192.168.10.206.crt -keystore keystore.jks
```
