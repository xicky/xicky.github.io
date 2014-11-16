// depends on rsa.js

div = document.what;

rsa = new RSA();
rsa.generateKey("3");
console.log(rsa.encrypt(new BigInteger("10")));

console.log(div.a.value);
