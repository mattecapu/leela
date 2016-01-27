import leela from './leela.es5.js';
import assert from 'assert';

{
    const dummy = leela({a: 1})('b', 2)('c', 3)();
    assert(dummy.a === 1 && dummy.b === 2 && dummy.c === 3);
}
{
    const dummy = leela({a: 1})({b: 2})({c: 3})();
    assert(dummy.a === 1 && dummy.b === 2 && dummy.c === 3);
}
{
    const dummy = leela({a: 1})({b: 2, c: 3})();
    assert(dummy.a === 1 && dummy.b === 2 && dummy.c === 3);
}
{
    const dummy = leela({a: 1})('b.c', 3)();
    assert(dummy.b.c === 3);
}
{
    const dummy = leela({a: 1})({b: {c : 3}})();
    assert(dummy.b.c === 3);
}
{
    const obj = {a: 1};
    const dummy = leela(obj)('a', 2)();
    assert(obj.a !== dummy.a);
}
{
    const obj = {a: 1};
    const dummy = leela(obj, false)('a', 2)();
    assert(obj.a === dummy.a);
}
{
    const obj = {a: 1};
    const dummy = leela(obj, false)('a.b', 2)();
    assert(dummy.a.b === 2);
}
{
    const obj = {a: 1};
    const dummy = leela(obj)('d', {e: 4})('d.e', 5)();
    assert(dummy.a === 1 && dummy.d.e === 5);
}
{
    const obj = {a: {b: 3, c: 4}};
    const dummy = leela(obj)({a: {b: 5}})();
    assert(dummy.a.b === 5 && dummy.a.c === 4);
}
{
    const obj = {a: {b: 3, c: {d: 5}}};
    const dummy = leela(obj)({a: {b: 6, c: {d: 7}, d: 8}})();
    assert(dummy.a.b === 6 && dummy.a.c.d === 7 && dummy.a.d === 8);
}
{
    const obj = {a: {b: 5}, b: 6};
    const dummy = leela(obj)('a.b', 7)('b', 8)();
    assert(dummy.a.b === 7 && dummy.b === 8);
}
{
    const mutator = leela()({a: 1, b: 2})();
    const dummy = mutator({c: 3});
    assert(dummy.a === 1 && dummy.b === 2 && dummy.c === 3);
}
{
    const obj = {'a.b.c': 1};
    const dummy = leela(obj)('a.b.c', 2, false)('a.b', 3)();
    assert(dummy['a.b.c'] === 2 && dummy.a.b === 3);
}

console.log('tests: ok');
