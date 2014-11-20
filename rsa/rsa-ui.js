// depends on rsa.js

alice = document.alice;
bob = document.bob;

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
    }
}

function genRandom(byteLen, target) {
  var ba = getRandomBytes(rng, byteLen);
  var str = '';
  for (var i = 0; i < byteLen; i++) {
    if (ba[i] < 0x10) {
      str += '0';
    }
    str += ba[i].toString(16).toUpperCase();
  }
  target.value = str;
}

rsa = new RSA();

function genRSAKey() {
  rsa.genKey();
  updateTexts(
    [alice.p, alice.q, alice.n, alice.e, alice.d],
    [rsa.p, rsa.q, rsa.n, rsa.e, rsa.d]);
}

function alice2bob() {
  updateTexts([bob.n, bob.e], [alice.n.value, alice.e.value]);
}

function randomDESKey() {
  genRandom(8, bob.key);
  genRandom(8, bob.plain);
}

function encryptDESKey() {
  if (rsa.e === null)
    genRSAKey();
  // TODO: Check des key validity?
  var kc = rsa.doEncrypt(bob.key.value);
  updateTexts([bob.keyCipher], [kc]);
}

function encryptPlain() {
  // TODO: Add des.encrypt()
}

function bob2alice() {
  updateTexts(
    [alice.keyCipher, alice.cipher],
    [bob.keyCipher.value, bob.cipher.value]);
}

function decryptDESKey() {
  // TODO: Check cipher validity, or just make it uneditable?
  var key = rsa.doDecrypt(alice.keyCipher.value);
  updateTexts([alice.key], [key]);
}

function decryptCipher() {
  // TODO: Add des.decrypt();
}
