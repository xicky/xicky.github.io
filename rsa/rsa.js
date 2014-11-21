// Depends on jsbn.js ,jsbn2.js and prng4.js

// Use rng to get a length bytes long array.
function getRandomBytes(rng, length) {
  var byteArray = new Array(length);
  for (var i = 0; i < length; i++) {
    byteArray[i] = rng.next();
  }
  return byteArray;
}

// Create a random number generator and initialize it.
function initRNG() {
  var arc4 = new Arcfour();
  var ba = [], p = 0;
  if (window.crypto && window.crypto.getRandomValues) {
    // Use webcrypto if available
    // (Chrome 11+, Firefox 21+, Safari 6.1+)
    var ua = new Uint8Array(32);
    window.crypto.getRandomValues(ua);
    for (var i = 0; i < 32; i++) {
        ba[p++] = ua[i];
    }
  }
  while (p < 32) {
    // If webcrypto is not available, use Math.random().
    var r = Math.floor(Math.random() * 0x10000);
    ba[p++] = t >>> 8;
    ba[p++] = t & 0xFF;
  }
  arc4.init(ba);
  return arc4;
}

rng = initRNG();

function RSA() {
  this.p = null;
  this.q = null;
  this.n = null;
  this.e = null;
  this.d = null;
}

function parseBigInt(str, r) {
  return new BigInteger(str, r);
}
// Generate a bitLen bits prime number: gcd(num-1, ee) = 1.
function randomBigPrime(bitLen, ee) {
  var num;
  while (true) {
    var ba = getRandomBytes(rng, (bitLen >> 3) + 1);
    var t = bitLen & 7;
    if (t > 0) {
      ba[0] &= ((1<<t)-1);
    } else {
      ba[0] = 0;
    }
    num = new BigInteger(ba, 256);
    var num1 = num.subtract(BigInteger.ONE);
    if (num1.gcd(ee).compareTo(BigInteger.ONE) === 0 && num.isProbablePrime(10) )
      break;
  }
  return num;
}

// Generate a new random private key, using public expt E
// This is not used in the project
RSA.prototype.genKeyWithPublicKey = function(e) {
  var ee;
  var len = 128; // 128 bits RSA
  if (typeof(e) === 'number') {
    ee = new BigInteger(e);
  } else if (typeof(e) === 'string') {
    ee = new BigInteger(e, 16);
  } else {
    ee = e;
  }
  this.e = ee;
  this.p = randomBigPrime(len>>1, ee);
  this.q = randomBigPrime(len-(len>>1), ee);
  this.n = this.p.multiply(this.q);
  var p1 = this.p.subtract(BigInteger.ONE);
  var q1 = this.q.subtract(BigInteger.ONE);
  var phi = p1.multiply(q1);
  this.d = ee.modInverse(phi);
  this.dmp1 = this.d.mod(p1); // dmp1 = d mod (p-1)
  this.dmq1 = this.d.mod(q1); // dmq1 = d mod (q-1)
  this.qinv = this.q.modInverse(this.p); // qinv = q^-1 mod p
};

// Generate a random prime.
// If coprime is given, generate prime p such that gcd(p,coprime) = 1.
function randomPrime(bitLen, coprime) {
  var num;
  while (true) {
    var ba = getRandomBytes(rng, (bitLen >> 3) + 1);
    var t = bitLen & 7;
    if (t > 0) {
      ba[0] &= ((1<<t)-1);
    } else {
      ba[0] = 0;
    }
    num = new BigInteger(ba, 256);
    if (coprime !== undefined) {
      if (num.gcd(coprime).compareTo(BigInteger.ONE) === 0 && num.isProbablePrime(10))
        break;
    } else {
      if (num.isProbablePrime(10))
        break;
    }
  }
  return num;
}

RSA.prototype.genKey = function() {
  var len = 128;
  this.p = randomPrime(len >> 1);
  this.q = randomPrime(len - (len >> 1));
  this.n = this.p.multiply(this.q);
  var p1 = this.p.subtract(BigInteger.ONE);
  var q1 = this.q.subtract(BigInteger.ONE);
  var phi = p1.multiply(q1);
  this.d = randomPrime(300, phi);
  this.e = this.d.modInverse(phi);
  this.dmp1 = this.d.mod(p1);
  this.dmq1 = this.d.mod(q1);
  this.qinv = this.q.modInverse(this.p);
};

RSA.prototype.encrypt = function(m) {
    return m.modPow(this.e, this.n);
};

RSA.prototype.decrypt = function (c) {
  //return c.modPow(this.d, this.n);
  //Use Chinese remainder theorem to speed up decryption
  var m1 = c.modPow(this.dmp1, this.p); // m1 = c ^ dmp1 mod p
  var m2 = c.modPow(this.dmq1, this.q); // m2 = c ^ dmq1 mod q
  var h = this.qinv.multiply(m1.subtract(m2)).mod(this.p); // h = (qinv * (m1 - m2)) mod p
  return m2.add(h.multiply(this.q)); // m = m2 + h * q
};

// Accepts a hex string or a BigInteger.
RSA.prototype.doEncrypt = function(plaintext) {
  var p = plaintext;
  if (typeof(p) === 'string') {
    p = new BigInteger(p, 16);
  }
  var c = this.encrypt(p);
  return c.toString(16).toUpperCase();
};

// Accepts a hex string or a BigInteger.
RSA.prototype.doDecrypt = function(ciphertext) {
  var c = ciphertext;
  if (typeof(c) === 'string') {
    c = new BigInteger(c, 16);
  }
  var p = this.decrypt(c);
  return p.toString(16).toUpperCase();
};
