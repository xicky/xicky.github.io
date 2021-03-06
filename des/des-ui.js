ARR_BIN2HEX = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
ARR_HEX2BIN = [
    "0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111",
    "1000", "1001",   "X1",   "X2",   "X3",   "X4",   "X5",   "X6",
      "X7", "1010", "1011", "1100", "1101", "1110", "1111"
];

var des = new DES();

function bin2hex(s) {
    var s2 = "", len = s.length;
    for (var i = 0; i < len; i++) {
        if (s[i] !== "0" && s[i] !== "1")
            return "undefined";
    }
    for (var i = 0; i < len; i += 4) {
        s2 += ARR_BIN2HEX[parseInt(s.slice(i, i+4), 2)];
    }
    return s2;
}
function hex2bin(s) {
    var s2 = ""; len = s.length;
    for (var i = 0; i < len; i++) {
        s2 += ARR_HEX2BIN[s.charCodeAt(i)-48];
    }
    return s2;
}
function bin_str2arr(s) {
    var arr = [], len = s.length;
    for (var i = 0; i < len; i++) {
        arr.push((s[i] === "0") ? 0 : 1);
    }
    return arr;
}
function bin_arr2str(arr) {
    var s = "", len = arr.length;
    for (var i = 0; i < len; i++) {
        s += (arr[i] === 0) ? "0" : "1";
    }
    return s;
}

function resizeText(text) {
    text.style.height = 'auto';
    text.style.height = text.scrollHeight-20+'px';
}

// Textarea auto-resize from http://stackoverflow.com/a/5346855/3816386
var observe;
if (window.attachEvent) {
    observe = function (element, event, handler) {
        element.attachEvent('on'+event, handler);
    };
}
else {
    observe = function (element, event, handler) {
        element.addEventListener(event, handler, false);
    };
}

function initTextareaResize (text) {
    function resize () {
        text.style.height = 'auto';
        text.style.height = text.scrollHeight-20+'px';
    }
    function delayedResize () {
        window.setTimeout(resize, 0);
    }
    observe(text, 'change',  resize);
    observe(text, 'cut',     delayedResize);
    observe(text, 'paste',   delayedResize);
    observe(text, 'drop',    delayedResize);
    observe(text, 'keydown', delayedResize);

    resize();
}

function isNotValid(text) {
    if (text.length !== 64) {
        return "Not 64 bits("+text.length+" bits).";
    }
    for (var i = 0; i < text.length; i++) {
        if (text[i] !== "0" && text[i] !== "1")
            return "Not binary.";
    }
    return false;
}

function updateKey() {
    var key = document.getElementById("key");
    var arrKey = bin_str2arr(key.value);
    des.generateKeys(arrKey);
}

function encrypt() {
    var arrPlain = bin_str2arr(plain.value);
    var arrCipher = des.encrypt(arrPlain);
    var strCipher = bin_arr2str(arrCipher);
    cipher.value = strCipher;
    syncTextareas(cipher, cipherHex, cipherBinTip);
    resizeText(cipher);
    CIPHER_LEGAL = true;
}
function decrypt() {
    var arrCipher = bin_str2arr(cipher.value);
    var arrPlain = des.decrypt(arrCipher);
    var strPlain = bin_arr2str(arrPlain);
    plain.value = strPlain;
    syncTextareas(plain, plainHex, plainBinTip);
    resizeText(plain);
    PLAIN_LEGAL = true;
}

function bindInput(textarea, second, tip, isHex, which) {
    textarea.oninput = function() {
        var error, value, hexValue;
        if (isHex) {
            hexValue = textarea.value.toUpperCase();
            textarea.value = hexValue;
            value = hex2bin(hexValue);
            second.value = value;
            if (which !== INPUT_KEY)
                resizeText(second);
        } else {
            value = textarea.value;
            hexValue = bin2hex(value);
            second.value = hexValue;
        }
        if (error = isNotValid(value)) {
            switch(which) {
                case INPUT_PLAIN:
                    PLAIN_LEGAL = false;
                    break;
                case INPUT_CIPHER:
                    CIPHER_LEGAL = false;
                    break;
                case INPUT_KEY:
                    KEY_LEGAL = false;
            }
            textarea.className = "error";
            second.className = "error";
            // tip.innerText = error;
        } else {
            switch(which) {
                case INPUT_PLAIN:
                    PLAIN_LEGAL = true;
                    break;
                case INPUT_CIPHER:
                    CIPHER_LEGAL = true;
                    break;
                case INPUT_KEY:
                    KEY_LEGAL = true;
            }
            textarea.className = "";
            second.className = "";
            tip.innerText = "";
        }
    };
    textarea.onblur = function() {
        if (which & INPUT_PLAIN) {
            if (KEY_LEGAL && PLAIN_LEGAL)
                encrypt();
        } else if (which & INPUT_KEY) {
            if (KEY_LEGAL) {
                updateKey();
                if (PLAIN_LEGAL)
                    encrypt();
                else if (CIPHER_LEGAL)
                    decrypt();
            }
        } else {
            if (KEY_LEGAL && CIPHER_LEGAL)
                decrypt();
        }
    };
}

function syncTextareas(text, hex, tip, ascii) {
    hex.value = bin2hex(text.value);
    text.className = "";
    hex.className = "";
    if (tip)
        tip.innerText = "";
}

function handleFileSelect(evt) {
    var files = evt.target.files;
    if (files[0]) {
        console.log("what");
        var reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = fileLoaded;
    }
}
function fileLoaded(evt) {
    var str = evt.target.result;
    str = str.slice(0, 64);
    plain.value = str;
    resizeText(plain);
    if (isNotValid(str)) {
        plain.className = plainHex.className = "error";
    } else {
        plain.className = plainHex.className = "";
        syncTextareas(plain, plainHex);
        encrypt();
    }
}

KEY_LEGAL = true;
PLAIN_LEGAL = false;
CIPHER_LEGAL = false;
INPUT_PLAIN = 1;
INPUT_CIPHER = 2;
INPUT_KEY = 4;

window.onload = function() {
    updateKey();
    plain = document.getElementById("plain");
    cipher = document.getElementById("cipher");
    plainHex = document.getElementById("plain-hex");
    cipherHex = document.getElementById("cipher-hex");
    plainBinTip = document.getElementById("plain-bin-tip");
    cipherBinTip = document.getElementById("cipher-bin-tip");
    key = document.getElementById("key");
    keyHex = document.getElementById("key-hex");
    keyBinTip = document.getElementById("key-bin-tip");
    btnSelectFile = document.getElementById("select-file");

    plain.value = "1010110000110100000110101011011110001010111000110100000101110001";
    syncTextareas(plain, plainHex);
    encrypt();

    btnSelectFile.addEventListener('change', handleFileSelect, false);
    initTextareaResize(plain);
    initTextareaResize(cipher);

    bindInput(plain, plainHex, plainBinTip, false, INPUT_PLAIN);
    bindInput(plainHex, plain, plainBinTip, true, INPUT_PLAIN);
    bindInput(cipher, cipherHex, cipherBinTip, false, INPUT_CIPHER);
    bindInput(cipherHex, cipher, cipherBinTip, true, INPUT_CIPHER);
    bindInput(key, keyHex, keyBinTip, false, INPUT_KEY);
    bindInput(keyHex, key, keyBinTip, true, INPUT_KEY);

    rounds = document.getElementById("rounds");
    rounds.onblur = function() {
        var r = parseInt(rounds.value);
        if (isNaN(r) || r <= 0 || r > 16) {
            rounds.className = "error";
        } else {
            rounds.className = "";
            des.updateRounds(r);
            updateKey();
            if (PLAIN_LEGAL)
                encrypt();
            else if (CIPHER_LEGAL)
                decrypt();
        }
    };
};
