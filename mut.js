import R from 'ramda';

const INVALID_MUTATION_ERROR =
    'mut(): mutations can be described either by an object or by providing a string key and a value';

const mutateImmutably = R.assocPath;
const mutateMutably = (p, v, data) => {
    // simple key assignment
    if (p.length === 1) {
        data[p] = v;
    } else {
        // if we are getting too deep, create new objects
        if (typeof (data[p[0]]) !== 'object') {
            data[p[0]] = {};
        }
        // unnest one level and mutate
        mutateMutably(p.slice(1), v, data[p[0]]);
    }
    return data;
};

function mut(data = undefined, immutable = true, __mutations = []) {

    if (data !== undefined && typeof data !== 'object') {
        throw new TypeError('mut() cannot mutate non-object types');
    }

    // lambda which practically mutates the object
    const __mutator = immutable ? mutateImmutably : mutateMutably;

    return (mutation, val = undefined, as_deep = true) => {
        if (mutation === undefined) {
            if (data === undefined) {
                // return a mutating function
                return (obj) => mut(obj, immutable, __mutations)();
            } else {
                // apply mutations
                return __mutations
                    .map(({key, val}) => (o => __mutator(key, val, o)))
                    .reduce((par, m) => m(par), data);
            }
        }

        let new_mutations = [];

        if (typeof mutation === 'object') {
            // perform mutation described by the object provided,
            // traversing the object and make only atomic mutation
            // or create new keys or overwrite existing ones with atomic values
            const parse_object_mutation = (mutation_desc) => {
                return Object.keys(mutation_desc).reduce(
                    (news, key) => {
                        if (typeof mutation_desc[key] === 'object') {
                            // get mutations described by the sub-object and
                            // add them prefixed with the name of the parent key
                            parse_object_mutation(mutation_desc[key]).forEach((m) => {
                                m.key.unshift(key);
                                news.push(m);
                            });
                        } else {
                            // recycle news array to reduce memory greed (x_x)
                            news.push({key: [key], val: mutation_desc[key]});
                        }
                        return news;
                    },
                    []
                );
            };
            new_mutations = parse_object_mutation(mutation);
        } else if (typeof mutation === 'string') {
            // mutate a single key (could be a deep key)
            new_mutations = [{key: as_deep ? mutation.split('.') : [mutation], val}];
        } else {
            throw new TypeError(INVALID_MUTATION_ERROR);
        }
        return mut(data, immutable, __mutations.concat(new_mutations))
    };
}

export default mut;
