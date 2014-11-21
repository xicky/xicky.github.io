// depends on rsa.js and des.js

alice = document.alice;
bob = document.bob;
rsa = new RSA();
des = new DES();

// Code below is used by DES, which requires input to be binary array.
ARR_BIN2HEX = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
ARR_HEX2BIN = [
    [0,0,0,0], [0,0,0,1], [0,0,1,0], [0,0,1,1], [0,1,0,0], [0,1,0,1],
    [0,1,1,0], [0,1,1,1], [1,0,0,0], [1,0,0,1],        [],        [],
           [],        [],        [],        [],        [], [1,0,1,0],
    [1,0,1,1], [1,1,0,0], [1,1,0,1], [1,1,1,0], [1,1,1,1]
];
function hexStr2binArr(str) {
  var len = str.length;
  var binArr = [];
  for (var i = 0; i < len; i++) {
    var num = str.charCodeAt(i) - 48;
    binArr = binArr.concat(ARR_HEX2BIN[num]);
  }
  return binArr;
}
function binArr2hexStr(arr) {
  var len = arr.length;
  var hexStr = '';
  for (var i = 0; i < len; i += 4) {
    var num = arr[i]*8 + arr[i+1]*4 + arr[i+2]*2 + arr[i+3];
    hexStr += ARR_BIN2HEX[num];
  }
  return hexStr;
}

// Update the <input>s.
function clear(a) {
  for (var i = 0; i < a.length; i++) {
    a[i].style.background = '';
  };
}
function updateTexts(texts, src) {
  var len = texts.length;

  if (typeof(src[0]) === 'string') {
    for (var i = 0; i < len; i++)
      texts[i].value = src[i];
    } else {
    for (var i = 0; i < len; i++)
      texts[i].value = src[i].toString(16).toUpperCase();
    }

    for (var i = 0; i < len; i++) {
      if (texts[i].type === 'textarea') {
        texts[i].style.height = 'auto';
        texts[i].style.height = texts[i].scrollHeight + 'px';
      }
      texts[i].style.background = '#C4C7F4';
    }
    setTimeout(function() {clear(texts)}, 600);
}

// To generate random DES key and plaintext.
function genRandom(byteLen) {
  var ba = getRandomBytes(rng, byteLen);
  var str = '';
  for (var i = 0; i < byteLen; i++) {
    if (ba[i] < 0x10) {
      str += '0';
    }
    str += ba[i].toString(16).toUpperCase();
  }
  return str;
}

// Step1: Alice generates RSA keys.
function genRSAKey() {
  rsa.genKey();
  updateTexts(
    [alice.p, alice.q, alice.n, alice.e, alice.d],
    [rsa.p, rsa.q, rsa.n, rsa.e, rsa.d]);
}

// Step2: Alice transmits her RSA public key to Bob.
function alice2bob() {
  updateTexts([bob.n, bob.e], [alice.n.value, alice.e.value]);
}

// Step3: Bob sets DES key and the message(randomly at this project).
function randomDESKey() {
  var key = genRandom(8);
  var plain = genRandom(8);
  updateTexts([bob.key, bob.plain], [key, plain]);
}

// Step4: Bob uses the public RSA key he recieved to encrypt the DES key.
function encryptDESKey() {
  if (rsa.e === null)
    genRSAKey();
  var kc = rsa.doEncrypt(bob.key.value);
  updateTexts([bob.keyCipher], [kc]);
}

// Step5: Bob encrypt the message using DES.
function encryptPlain() {
  if (des.PrimaryKey === null)
    des.generateKeys(hexStr2binArr(bob.key.value));
  var ci = des.encrypt(hexStr2binArr(bob.plain.value));
  var str = binArr2hexStr(ci);
  updateTexts([bob.cipher], [str]);
}

// Step6: Bob transimits the ciphertext and encrypted DES key to Alice.
function bob2alice() {
  updateTexts(
    [alice.keyCipher, alice.cipher],
    [bob.keyCipher.value, bob.cipher.value]);
}

// Step7: Alice decrypts the DES key cipher using her private RSA key.
function decryptDESKey() {
  var key = rsa.doDecrypt(alice.keyCipher.value);
  updateTexts([alice.key], [key]);
}

// Step8: Alice decrypts the ciphertext using the DES key.
function decryptCipher() {
  if (des.PrimaryKey === null)
    des.generateKeys(hexStr2binArr(alice.key.value));
  var p = des.decrypt(hexStr2binArr(alice.cipher.value));
  var str = binArr2hexStr(p);
  updateTexts([alice.plain], [str]);
}
