import mut from './mut.es5.js';
import assert from 'assert';

{
    const dummy = mut({a: 1})('b', 2)('c', 3)();
    assert(dummy.a === 1, dummy.b === 2, dummy.c === 3);
}
{
    const dummy = mut({a: 1})({b: 2})({c: 3})();
    assert(dummy.a === 1, dummy.b === 2, dummy.c === 3);
}
{
    const dummy = mut({a: 1})({b: 2, c: 3})();
    assert(dummy.a === 1, dummy.b === 2, dummy.c === 3);
}
{
    const dummy = mut({a: 1})('b.c', 3)();
    assert(dummy.b.c === 3);
}
{
    const dummy = mut({a: 1})({b: {c : 3}})();
    assert(dummy.b.c === 3);
}
{
    const obj = {a: 1};
    const dummy = mut(obj)('a', 2)();
    assert(obj.a !== dummy.a);
}
{
    const obj = {a: 1};
    const dummy = mut(obj, false)('a', 2)();
    assert(obj.a === dummy.a);
}

console.log('tests: ok');
