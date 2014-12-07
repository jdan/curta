var Immutable = require("immutable");
var util = require("util");

/**
 * turn(n)
 * liftCrank
 * lowerCrank
 *
 * read/readResult(n?)
 * readCounter(n?)
 * readSetting(n?)
 * readCarriage
 *
 * setCarriage(n (1-6))
 * setRegister(n (1-8), value (0-9))
 */

function Curta() {
    this.state = Immutable.Map({
        settingRegisters: 0,
        countingRegisters: 0,
        resultRegisters: 0,

        carriageSetting: 1,
        crankDown: true
    });
}

Curta.NUM_SETTING_REGISTERS = 8;
Curta.NUM_COUNTING_REGISTERS = 6;
Curta.NUM_RESULT_REGISTERS = 11;

Curta.prototype.setCarriage = function(n) {
    if (n < 1 || n > 6) {
        throw new Error("Carriage setting must be between (1) through (6)");
    }

    this.state = this.state.set("carriageSetting", n);
};

/**
 * Converts a number to an immutable digit array of a given size.
 */
Curta.prototype._toDigitArray = function(n, size) {
    var digits = new Array(size);
    for (var i = 0; i < size; i++) {
        digits[i] = Math.floor(n / Math.pow(10, i)) % 10;
    }

    return Immutable.List.of.apply(Immutable.List, digits);
};

/**
 * Converts an immutable digit array to a number.
 */
Curta.prototype._toDecimal = function(digitArray) {
    var size = digitArray.size;
    var result = 0;

    for (var i = 0; i < size; i++) {
        result += digitArray.get(i) * Math.pow(10, i);
    }

    return result;
};

Curta.prototype.setRegister = function(register, value) {
    if (register < 1 || register > Curta.NUM_SETTING_REGISTERS) {
        throw new Error(
            "Setting register must be a value between (1) through (" +
            Curta.NUM_SETTING_REGISTERS + ")");
    }

    if (value < 0 || value > 9) {
        throw new Error(
            "Setting register value must be between (0) through (9)");
    }

    var registers = this._toDigitArray(this.state.get("settingRegisters"),
                                       Curta.NUM_SETTING_REGISTERS);

    registers = registers.set(register - 1, value);

    this.state = this.state.set("settingRegisters", this._toDecimal(registers));
};

Curta.prototype.readCarriage = function() {
    return this.state.get("carriageSetting");
};

/**
 * General function to read out an entire series of registers or a particular
 * register.
 */
Curta.prototype._readRegistersFn = function(key, capacity) {
    return function(register) {
        if (register === undefined) {
            return this.state.get(key);
        } else {
            if (register < 1 || register > capacity) {
                throw new Error(
                    "Setting register must be a value between (1) through (" +
                    capacity + ")");
            }

            var digits = this._toDigitArray(this.state.get(key), capacity);
            return digits.get(register - 1);
        }
    };
};

Curta.prototype.readSetting = Curta.prototype._readRegistersFn(
    "settingRegisters", Curta.NUM_SETTING_REGISTERS);

Curta.prototype.readCounting = Curta.prototype._readRegistersFn(
    "countingRegisters", Curta.NUM_COUNTING_REGISTERS);

Curta.prototype.readResult = Curta.prototype._readRegistersFn(
    "resultRegisters", Curta.NUM_RESULT_REGISTERS);

module.exports = Curta;
