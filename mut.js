import R from 'ramda';

const immutator = R.assocPath;
const mutator = (p, v, data) => {
    // simple key assignment
    if (p.length === 1) {
        data[p] = v;
        return data;
    }
    // unnest one level and mutate
    return mutator(p.slice(1), v, data[p[0]]);
}

function mut(data = {}, immutable = true) {

    const $mutator = immutable ? immutator : mutator;

    return (mutation, val = undefined) => {
        // end of mutations
        if (mutation === undefined) return data;

        if (typeof mutation === 'object') {
            // perform extend-like mutation chaining atomic mutations
            return Object.keys(mutation).reduce(
                (partial, key) => partial(key, mutation[key]),
                mut(data, immutable)
            );
        } else if (typeof mutation === 'string') {
            // mutate a single key (could be a deep key)
            const deep_key = mutation.split('.');
            return mut($mutator(deep_key, val, data), immutable);
        }
    };
}

export default mut;
