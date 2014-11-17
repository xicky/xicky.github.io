// depends on rsa.js

div = document.form;

rsa = new RSA();
rsa.gen2();
c = rsa.doEncrypt('200').toString();

function fun() { rsa.gen2(); return "d: "+rsa.d.toString()+"\n e: "+rsa.e.toString(); }