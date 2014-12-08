# curta [![Build Status](https://travis-ci.org/jdan/curta.svg?branch=master)](https://travis-ci.org/jdan/curta)

Simulator for the [Curta Type I](http://en.wikipedia.org/wiki/Curta),
a mechanical calculator manufactured between 1947 and 1972.

## Install

```sh
npm install --save curta
```

## Usage

To compute the multiplication of **27 × 4**:

```js
var Curta = require("curta");
var curta = new Curta();

// Load 27 in the Setting Register
curta.setRegister(1, 7);
curta.setRegister(2, 2);

// Turn the handle 4 times
curta.turn(4);

curta.result(); // => 108
curta.readCounter(); // => 4
```

Just as we would on a normal Curta.

![27x4 on a Curta Type I](http://i.imgur.com/0XXL9hN.jpg)

More advanced, **1024 × 512**:

```js
var curta = new Curta();

curta.setRegister(4, 1);
curta.setRegister(2, 2);
curta.setRegister(1, 4);

curta.setCarriage(3);
curta.turn(5);

curta.setCarriage(2);
curta.turn();

curta.setCarriage(1);
curta.turn(2);

curta.result(); // => 524288
curta.readCounter(); // => 512
```

![1024x512 on a Curta Type I](http://i.imgur.com/zMjrGFD.jpg)

## API

### `var curta = new Curta()`

Creates a zeroed-out Curta state.

### `curta.turn([n])`

Turns the crank once, or if a number is passed in, that number of
times.

### `curta.liftCrank()`

Lifts the crank, so that each turn will subtract from the counter and
result instead of adding to them.

### `curta.lowerCrank()`

Lowers the crank, putting the calculator back in addition mode.

### `curta.clearCounting()`

Clears the counting registers.

### `curta.clearResult()`

Clears the result registers.

### `curta.clear()`

Clears both the counting and result registers.

### `curta.readCarriage`

Reads the carriage setting, which determines the exponent of 10 we add
to the counter.

### `curta.setCarriage(position)`

Sets the carriage position to a value between 1 and 6.

### `curta.readSetting([register])`

Reads the value of the setting registers. If a given `register`
is passed in (a number between 1 and 11), it reads the value of
that particular register.

### `curta.readCounter([register])`

Reads the value of the counting registers.

### `curta.readResult([register])`

Reads the value of the result registers.

### `curta.setRegister(register, value)`

Sets the given setting register to a particular value.

## License

MIT © [Jordan Scales](http://jordanscales.com)
