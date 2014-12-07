var Immutable = require("immutable");
var util = require("util");


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


Curta.prototype.setState = function(state) {
    this.state = this.state.merge(state);
};


/**
 * Lifts the crank.
 */
Curta.prototype.liftCrank = function() {
    this.setState({ crankDown: false });
};


/**
 * Lowers the crank.
 */
Curta.prototype.lowerCrank = function() {
    this.setState({ crankDown: true });
};


/**
 * Reads the carriage setting.
 */
Curta.prototype.readCarriage = function() {
    return this.state.get("carriageSetting");
};


/**
 * Sets the carriage setting.
 */
Curta.prototype.setCarriage = function(n) {
    if (n < 1 || n > 6) {
        throw new Error("Carriage setting must be between (1) through (6)");
    }

    this.setState({ carriageSetting: n });
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


/**
 * Reads the setting registers.
 */
Curta.prototype.readSetting = Curta.prototype._readRegistersFn(
    "settingRegisters", Curta.NUM_SETTING_REGISTERS);


/**
 * Reads the counting registers.
 */
Curta.prototype.readCounting = Curta.prototype._readRegistersFn(
    "countingRegisters", Curta.NUM_COUNTING_REGISTERS);


/**
 * Reads the result registers.
 */
Curta.prototype.readResult = Curta.prototype._readRegistersFn(
    "resultRegisters", Curta.NUM_RESULT_REGISTERS);


/**
 * General function to set a given register using a particular key and
 * capacity of the register group.
 */
Curta.prototype._setRegisterFn = function(key, capacity) {
    return function(register, value) {
        if (register < 1 || register > capacity) {
            throw new Error(
                "Setting register must be a value between (1) through (" +
                Curta.NUM_SETTING_REGISTERS + ")");
        }

        if (value < 0 || value > 9) {
            throw new Error(
                "Setting register value must be between (0) through (9)");
        }

        var registers = this._toDigitArray(this.state.get(key), capacity)
            .set(register - 1, value);

        var state = {};
        state[key] = this._toDecimal(registers);
        this.setState(state);
    };
};


/**
 * Sets a given setting register to a given value.
 * The naming for this one is a little convoluted.
 */
Curta.prototype.setRegister = Curta.prototype._setRegisterFn(
    "settingRegisters", Curta.NUM_SETTING_REGISTERS);


/**
 * Sets a given counting register to a given value.
 */
Curta.prototype._setCountingRegister = Curta.prototype._setRegisterFn(
    "countingRegisters", Curta.NUM_COUNTING_REGISTERS);


/**
 * Sets a given result register to a given value.
 */
Curta.prototype._setResultRegister = Curta.prototype._setRegisterFn(
    "resultRegisters", Curta.NUM_RESULT_REGISTERS);


module.exports = Curta;
