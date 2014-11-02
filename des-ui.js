CBCMode = false;

ARR_BIN2HEX = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
ARR_HEX2BIN = [
    "0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111",
    "1000", "1001",   "X1",   "X2",   "X3",   "X4",   "X5",   "X6",
      "X7", "1010", "1011", "1100", "1101", "1110", "1111"
];

function bin2hex(s) {
    var s2 = "", len = s.length;
    for (var i = 0; i < len; i += 4) {
        s2 += ARR_BIN2HEX[parseInt(s.slice(i, i+4), 2)];
    }
    return s2;
};
function hex2bin(s) {
    var s2 = ""; len = s.length;
    for (var i = 0; i < len; i++) {
        s2 += ARR_HEX2BIN[s.charCodeAt(i)-48];
    }
    return s2;
};

function bin_str2arr(s) {
    var arr = [], len = s.length;
    for (var i = 0; i < len; i++) {
        arr.push((s[i] === "0") ? 0 : 1);
    }
    return arr;
};
function bin_arr2str(arr) {
    var s = "", len = arr.length;
    for (var i = 0; i < len; i++) {
        s += (arr[i] === 0) ? "0" : "1";
    }
    return s;
};

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
};

function isNotValid(text) {
    if (!CBCMode) {
        if (text.length !== 64) {
            return "Not 64 bits("+text.length+" bits).";
        }
        for (var i = 0; i < text.length; i++) {
            if (text[i] !== "0" && text[i] !== "1")
                return "Not binary.";
        }
        return false;
    }
};

function encrypt() {
    var plain = document.getElementById("plain");
    var cipher = document.getElementById("cipher");
    
};
function decrypt() {

};

function bindInput(textarea, second, isHex, isPlain) {
    textarea.oninput = function() {
        var error, value, hexValue;
        if (isHex) {
            hexValue = textarea.value;
            value = hex2bin(hexValue);
            second.value = value;
        } else {
            value = textarea.value;
            hexValue = bin2hex(value);
            second.value = hexValue;
        }
        if (error = isNotValid(value)) {
            INPUT_LEGAL = false;
            plain.className = "error";
            plainBinTip.innerText = error;
        } else {
            INPUT_LEGAL = true;
            plain.className = "";
            third.innerText = "";
        }
    };
    textarea.onchange = function() {
        if (INPUT_LEGAL) {
            if (isPlain) {
                // TODO: encrypt();
            } else {
                // TODO: decrypt();
            }
        }
    };
};

INPUT_LEGAL = false;

window.onload = function() {
    /* TODO:
     *  Generate random primary key and plaintext
     *  Generate KEYS
     *  DES.encrypt()
     *  Update textareas
     */
    var plain = document.getElementById("plain");
    var cipher = document.getElementById("cipher");
    var plain_hex = document.getElementById("plain-hex");
    var cipher_hex = document.getElementById("cipher-hex");
    initTextareaResize(plain);
    initTextareaResize(cipher);
    var plainBinTip = document.getElementById("plain-bin-tip");
    plain.oninput = function() {
        var error;
        if (error = isNotValid(plain.value)) {
            plain.className = "error";
            plainBinTip.innerText = error;
            plain_hex.value = bin2hex(plain.value);
        }
        else {
            plain.className = "";
            plainBinTip.innerText = "";
        }
    }
    plain.onchange = function() {
        var error;
        if (error = isNotValid(plain.value)) {
            plain.className = "error";
            document.getElementById("plain-bin-tip").innerText = error;
        }
        else {
            cipher.value = plain.value;
        }
    }
    plain.onclick = function() {
        plain.focus();
        plain.select();
    }
};
