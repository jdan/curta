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

describe("clearing", function() {
    it("should clear the counting registers", function() {
        var curta = new Curta();
        curta.turn(5);
        assert.equal(5, curta.readCounter());

        curta.clearCounting();
        assert.equal(0, curta.readCounter());
    });

    it("should clear the result registers", function() {
        var curta = new Curta();
        curta.setRegister(1, 1);
        curta.turn(5);
        assert.equal(5, curta.readResult());

        curta.clearResult();
        assert.equal(0, curta.readResult());

        // Make sure the counting registers have not been cleared
        assert.equal(5, curta.readCounter());
    });

    it("should clear the counting and result registers", function() {
        var curta = new Curta();
        curta.setRegister(1, 1);
        curta.turn(5);
        assert.equal(5, curta.readCounter());
        assert.equal(5, curta.readResult());

        curta.clear();
        assert.equal(0, curta.readCounter());
        assert.equal(0, curta.readResult());
    });
});

describe("turning", function() {
    it("should count 1 by default", function() {
        var curta = new Curta();
        curta.turn();
        assert.equal(1, curta.readCounter());
    });

    it("should count based on the carriage setting", function() {
        var curta = new Curta();
        curta.setCarriage(2);
        curta.turn();
        assert.equal(10, curta.readCounter());
    });

    it("should be able to turn multiple times", function() {
        var curta = new Curta();
        curta.turn(2);
        assert.equal(2, curta.readCounter());

        curta.setCarriage(2);
        curta.turn(5);
        assert.equal(52, curta.readCounter());
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

        curta.clear();
        curta.setRegister(1, 5);
        curta.setRegister(2, 2);
        curta.setCarriage(3);
        curta.turn(3);
        assert.equal(7500, curta.readResult());
    });

    it("should error if we specify an invalid crank amount", function() {
        var curta = new Curta();
        assert.throws(function() {
            curta.turn(0);
        });
        assert.throws(function() {
            curta.turn(-1);
        });
    });

    it("should subtract if the crank is up", function() {
        var curta = new Curta();
        curta.setRegister(1, 4);
        curta.turn(4);
        assert.equal(16, curta.readResult());

        curta.liftCrank();
        curta.turn();
        assert.equal(12, curta.readResult());

        curta.lowerCrank();
        curta.turn(2);
        assert.equal(20, curta.readResult());
    });

    it("should handle underflows and overflows", function() {
        var curta = new Curta();
        curta.liftCrank();
        curta.turn();
        assert.equal(999999, curta.readCounter());

        curta.lowerCrank();
        curta.turn();
        assert.equal(0, curta.readCounter());

        curta.clear();
        curta.liftCrank();
        curta.setCarriage(2);
        curta.setRegister(1, 5);
        curta.turn();

        assert.equal(999990, curta.readCounter());
        assert.equal(99999999950, curta.readResult());
    });
});
