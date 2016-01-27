# leela

Simple tool to provide you with a nice way to abstract away object mutation and object structures.

![Leela](http://cdn.meme.am/instances2/500x/4014569.jpg)

## Installation

**leela** is distributed via npm

```
npm i leela -S
```

Then you can just `import` it in your files

```js
import leela from 'leela';
```

## Usage

The library exports a single function

#### `leela([data = undefined[, immutable = true]])`

It accepts an object to mutate and a flag to decide wheter apply directly the mutations to the object or make a shallow copy of the object and mutate that.

Once "initialized", you can mutate your object in two ways:

* Providing a key and a value
```js
leela(obj)('key', value)('key2', value2)();
```

* Providing an object describing the mutations you want to apply
```js
leela(obj)({key: value, key2: value2})();
```

You state your mutations by simply *call* the returning value of `leela()` how many times you need to. When you are done, just make an empty call to get your mutated object.

```js
const default_options = {
    url: 'http://mattecapu.github.io',
    mime: 'text/html',
    async: false
};

// apply a mutation with ease
const async_options = leela(default_options)({async: true})();

// simply call your mutations one after the other
const auth_options = leela(options)('user', getUser())('password', getPassword)();

// nested objects are decomposed into atomic mutations
// hence this
const post_options = leela(default_options)({method: 'POST', body: {a: 1, b: 2}})();
// is equivalent to
const post_options = leela(default_options)('method', 'POST')('body.a', 1)('body.b', 2)();

// uh, didn't I mention it? leela supports key "paths"
const nested = leela({a: {b: {c: 3}}})('a.b.c', 4)();

// if you have dot-separated keys, just tell me (in the third argument)
const dot_separated = leela({'a.b.c', 3})('a.b.c', 4, false)();
```

You can also create *per-se* mutations, independent from any object. Just state what the mutation does.

In this way you have easily reusable pure functions (if you leave `immutable` set to `true`) and you can abstract away the mutation logic in a one-liner. *Fuck yeah*.

```js
// just call leela without arguments, and then instead of returning
// an object, the empty call will return a mutating function
const tmnt = leela()('ninja', true)();

// now tmnt() contains the logic of a "ninja mutation",
// so you can use it with the canonical turtles
const ninja_turtles =
    ['leonardo', 'raffaello', 'donatello', 'michelangelo']
        .map(name => tmnt({name}));

// or with any other turtle you like
ninja_turtles.push(tmnt({name: 'antonello'}));

// if you want a really mutating mutator (lolz),
// just pass undefined as the first argument
const radioactiveSpider = leela(undefined, false)('nerd', false)('mary-jane', true)();

let PeterParker = {nerd: true};

// Peter is modified in-place, no cloning is made
radioactiveSpider(PeterParker);

assert(PeterParker.nerd === false);
```

## Pretty cool, nah?
Star this if you like it. You can tweet it too. Anyway, let me know!

## License
ISC
