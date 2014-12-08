var assert = require("assert");
var Curta = require("./");

describe("carraige", function() {
    var curta = new Curta();

    it("should return 1 initially", function() {
        assert.equal(1, curta.readCarriage());
    });

    it("should be able to change", function() {
        curta.setCarriage(2);
        assert.equal(2, curta.readCarriage());
    });

    it("should error when set to an invalid slot", function() {
        assert.throws(function() {
            curta.setCarriage(-1);
        });
        assert.throws(function() {
            curta.setCarriage(7);
        });
    });
});

describe("registers", function() {
    var curta = new Curta();

    it("should return 0 initially", function() {
        assert.equal(0, curta.readSetting());
    });

    it("should be able to change individual registers", function() {
        curta.setRegister(1, 8);
        assert.equal(8, curta.readSetting());

        curta.setRegister(2, 2);
        assert.equal(28, curta.readSetting());
    });

    it("should be able to read individual registers", function() {
        assert.equal(2, curta.readSetting(2));
        assert.equal(0, curta.readSetting(3));
    });

    it("should error if we attempt to read invalid registers", function() {
        assert.throws(function() {
            curta.readSetting(0);
        });
        assert.throws(function() {
            curta.readSetting(-1);
        });
        assert.throws(function() {
            curta.readSetting(100);
        });
    });

    it("should error if we attempt to set invalid registers", function() {
        assert.throws(function() {
            curta.setRegister(-1, 1);
        });
        assert.throws(function() {
            curta.setRegister(0, 1);
        });
        assert.throws(function() {
            curta.setRegister(100, 1);
        });
    });

    it("should error if we attempt to set invalid values to registers", function() {
        assert.throws(function() {
            curta.setRegister(1, -1);
        });
        assert.throws(function() {
            curta.setRegister(1, 10);
        });
    });
});

describe("turning", function() {
    it("should count 1 by default", function() {
        var curta = new Curta();
        curta.turn();
        assert.equal(1, curta.readCounting());
    });

    it("should count based on the carriage setting", function() {
        var curta = new Curta();
        curta.setCarriage(2);
        curta.turn();
        assert.equal(10, curta.readCounting());
    });

    it("should be able to turn multiple times", function() {
        var curta = new Curta();
        curta.turn(2);
        assert.equal(2, curta.readCounting());

        curta.setCarriage(2);
        curta.turn(5);
        assert.equal(52, curta.readCounting());
    });

    it("should not affect the result", function() {
        var curta = new Curta();
        curta.turn();
        assert.equal(0, curta.readResult());
    });

    it("should change the result if we change the setting registers", function() {
        var curta = new Curta();
        curta.setRegister(1, 5);
        curta.turn(4);
        assert.equal(20, curta.readResult());

        curta = new Curta();
        curta.setRegister(1, 5);
        curta.setRegister(2, 2);
        curta.setCarriage(3);
        curta.turn(3);
        assert.equal(7500, curta.readResult());
    });
});
