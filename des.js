var DES = {};

DES.IP = new Array(
    57, 49, 41, 33, 25, 17,  9,  1, 59, 51, 43, 35, 27, 19, 11,  3,
    61, 53, 45, 37, 29, 21, 13,  5, 63, 55, 47, 39, 31, 23, 15,  7,
    56, 48, 40, 32, 24, 16,  8,  0, 58, 50, 42, 34, 26, 18, 10,  2,
    60, 52, 44, 36, 28, 20, 12,  4, 62, 54, 46, 38, 30, 22, 14,  6);

DES.FP = new Array(
    39,  7, 47, 15, 55, 23, 63, 31, 38,  6, 46, 14, 54, 22, 62, 30,
    37,  5, 45, 13, 53, 21, 61, 29, 36,  4, 44, 12, 52, 20, 60, 28,
    35,  3, 43, 11, 51, 19, 59, 27, 34,  2, 42, 10, 50, 18, 58, 26,
    33,  1, 41,  9, 49, 17, 57, 25, 32,  0, 40,  8, 48, 16, 56, 24);

DES.E = new Array(
    31,  0,  1,  2,  3,  4,  3,  4,  5,  6,  7,  8,  7,  8,  9, 10,
    11, 12, 11, 12, 13, 14, 15, 16, 15, 16, 17, 18, 19, 20, 19, 20,
    21, 22, 23, 24, 23, 24, 25, 26, 27, 28, 27, 28, 29, 30, 31,  0);

DES.P = new Array(
    15,  6, 19, 20, 28, 11, 27, 16,  0, 14, 22, 25,  4, 17, 30,  9,
     1,  7, 23, 13, 31, 26,  2,  8, 18, 12, 29,  5, 21, 10,  3, 24);

DES.S = [ new Array(
    14,  4, 13,  1,  2, 15, 11,  8,  3, 10,  6, 12,  5,  9,  0,  7,
     0, 15,  7,  4, 14,  2, 13,  1, 10,  6, 12, 11,  9,  5,  3,  8,
     4,  1, 14,  8, 13,  6,  2, 11, 15, 12,  9,  7,  3, 10,  5,  0,
    15, 12,  8,  2,  4,  9,  1,  7,  5, 11,  3, 14, 10,  0,  6, 13),
    new Array(
    15,  1,  8, 14,  6, 11,  3,  4,  9,  7,  2, 13, 12,  0,  5, 10,
     3, 13,  4,  7, 15,  2,  8, 14, 12,  0,  1, 10,  6,  9, 11,  5,
     0, 14,  7, 11, 10,  4, 13,  1,  5,  8, 12,  6,  9,  3,  2, 15,
    13,  8, 10,  1,  3, 15,  4,  2, 11,  6,  7, 12,  0,  5, 14, 9),
    new Array(
    10,  0,  9, 14,  6,  3, 15,  5,  1, 13, 12,  7, 11,  4,  2,  8,
    13,  7,  0,  9,  3,  4,  6, 10,  2,  8,  5, 14, 12, 11, 15,  1,
    13,  6,  4,  9,  8, 15,  3,  0, 11,  1,  2, 12,  5, 10, 14,  7,
     1, 10, 13,  0,  6,  9,  8,  7,  4, 15, 14,  3, 11,  5,  2, 12),
    new Array(
     7, 13, 14,  3,  0,  6,  9, 10,  1,  2,  8,  5, 11, 12,  4, 15,
    13,  8, 11,  5,  6, 15,  0,  3,  4,  7,  2, 12,  1, 10, 14,  9,
    10,  6,  9,  0, 12, 11,  7, 13, 15,  1,  3, 14,  5,  2,  8,  4,
     3, 15,  0,  6, 10,  1, 13,  8,  9,  4,  5, 11, 12,  7,  2, 14),
    new Array(
     2, 12,  4,  1,  7, 10, 11,  6,  8,  5,  3, 15, 13,  0, 14,  9,
    14, 11,  2, 12,  4,  7, 13,  1,  5,  0, 15, 10,  3,  9,  8,  6,
     4,  2,  1, 11, 10, 13,  7,  8, 15,  9, 12,  5,  6,  3,  0, 14,
    11,  8, 12,  7,  1, 14,  2, 13,  6, 15,  0,  9, 10,  4,  5, 3),
    new Array(
    12,  1, 10, 15,  9,  2,  6,  8,  0, 13,  3,  4, 14,  7,  5, 11,
    10, 15,  4,  2,  7, 12,  9,  5,  6,  1, 13, 14,  0, 11,  3,  8,
     9, 14, 15,  5,  2,  8, 12,  3,  7,  0,  4, 10,  1, 13, 11,  6,
     4,  3,  2, 12,  9,  5, 15, 10, 11, 14,  1,  7,  6,  0,  8, 13),
    new Array(
     4, 11,  2, 14, 15,  0,  8, 13,  3, 12,  9,  7,  5, 10,  6,  1,
    13,  0, 11,  7,  4,  9,  1, 10, 14,  3,  5, 12,  2, 15,  8,  6,
     1,  4, 11, 13, 12,  3,  7, 14, 10, 15,  6,  8,  0,  5,  9,  2,
     6, 11, 13,  8,  1,  4, 10,  7,  9,  5,  0, 15, 14,  2,  3, 12),
    new Array(
    13,  2,  8,  4,  6, 15, 11,  1, 10,  9,  3, 14,  5,  0, 12,  7,
     1, 15, 13,  8, 10,  3,  7,  4, 12,  5,  6, 11,  0, 14,  9,  2,
     7, 11,  4,  1,  9, 12, 14,  2,  0,  6, 10, 13, 15,  3,  5,  8,
     2,  1, 14,  7,  4, 10,  8, 13, 15, 12,  9,  0,  3,  5,  6, 11) ];

DES.IPC = new Array(
    56, 48, 40, 32, 24, 16,  8,  0, 57, 49, 41, 33, 25, 17,  9,  1,
    58, 50, 42, 34, 26, 18, 10,  2, 59, 51, 43, 35, 62, 54, 46, 38,
    30, 22, 14,  6, 61, 53, 45, 37, 29, 21, 13,  5, 60, 52, 44, 36,
    28, 20, 12,  4, 27, 19, 11,  3);

DES.LS = new Array(1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1);

DES.PC = new Array(
    13, 16, 10, 23,  0,  4,  2, 27, 14,  5, 20,  9, 22, 18, 11,  3,
    25,  7, 15,  6, 26, 19, 12,  1, 40, 51, 30, 36, 46, 54, 29, 39,
    50, 44, 32, 47, 43, 48, 38, 55, 33, 52, 45, 41, 49, 35, 28, 31);

DES.PrimaryKey = null;
DES.Keys = [];

DES.generateKeys = function(key) {
    if (key === this.PrimaryKey)
        return;
    this.PrimaryKey = key;
    var C = [], D = [], K = [];
    for (var i = 0; i < 56; i++) {
        if (i < 28)
            D[i] = key[this.IPC[i]];
        else
            C[i-28] = key[this.IPC[i]];
    }
    for (var i = 0; i < 6; i++) {
        var shift = this.LS[i];
        for (var j = 0; j < shift; j++) {
            C.push(C.shift());
            D.push(D.shift());
        }

        for (var j = 0; j < 48; j++) {
            var pos = this.PC[j];
            if (pos < 28) {
                K[j] = D[pos];
            } else {
                K[j] = C[pos - 28];
            }
        }
        this.Keys.push([]);
        for (var j = 0; j < 48; j++) {
            this.Keys[i].push(K[j]);
        };
    }
}

DES.F = function(L, R, K) {
    var iR = [];
    var p = [], nR = [];
    for (var i = 0; i < 48; i++) {
        iR[i] = R[this.E[i]] ^ K[i];
    }
    for (var i = 0; i < 8; i++) {
        var sp = i * 6;
        var row = iR[sp] * 2 + iR[sp+5];
        var col = iR[sp+1] * 8 + iR[sp+2] * 4 + iR[sp+3] * 2 + iR[sp+4];
        var num = this.S[i][row * 16 + col];
        var lev = 8;
        for (var j = 0; j < 4; j++) {
            p[i * 4 + j] = (num / lev >= 1) ? 1 : 0;
            num = num % lev;
            lev = lev / 2;
        }
    }
    for (var i = L.length - 1; i >= 0; i--) {
            nR[i] = L[i] ^ p[i];
    };
    return nR;
}

DES.encrypt = function(text, de) {
    var it = [], cipher = [];

    for (var i = 0; i < 64; i++) {
        it[i] = text[this.IP[i]];
    };

    var L = it.slice(32);
    var R = it.slice(0, 32);
    for (var i = 0; i < 6; i++) {
        if (!de) {
            var nL = R.slice();
            var nR = this.F(L, R, this.Keys[de?5-i:i], de);
            L = nL;
            R = nR;
        } else {
            var nR = L.slice();
            var nL = this.F(R, L, this.Keys[5-i], de);
            R = nR;
            L = nL;
        }
    }
    
    var concat = L.concat(R);
    for (var i = 0; i < 64; i++) {
        cipher[i] = concat[this.FP[i]];
    }
    return cipher;
}

DES.decrypt = function(cipher) {
    return this.encrypt(cipher, true);
}

oriText = [0,1,1,0,1,0,0,1,1,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,1,1,1,0,0,1,1,0,1,0,1,1,0,0,0,1,0,1,0,1,0,1,0,0,0,0,1,0,0,1,1,0,1,1,1,0,1,1];
key = oriText;
document.onload=function(){DES.generateKeys(key);console.log(ci = DES.encrypt(oriText));}();
