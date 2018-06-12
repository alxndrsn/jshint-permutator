const _ = require('lodash');
const fs = require('fs');
const jshint = require('jshint').JSHINT;

const DEBUG = false;

const code = fs.readFileSync('main.js', { encoding:'utf-8' });

const possibleOptions = {
  bitwise: [ true, false ],
  curly: [ true, false ],
  eqeqeq: [ true, false ],
  funcscope: [ true, false ],
  futurehostile: [ true, false ],
  latedef: [ true, false ],
  shadow: [ 'inner', 'outer', false, true ],
  strict: [ 'implied', false ],
  undef: [ true, false ],
  unused: [ true, 'vars', 'strict' ],
};

const optionsArray = Object.keys(possibleOptions).map(k => ({
  name: k,
  values: possibleOptions[k],
}));

const permutations = optionsArray.reduce((perms, opt) => {
  let newPerms = [];

  function newPermutationFor(permutation, optValue) {
    permutation = _.clone(permutation);
    permutation[opt.name] = optValue;
    return permutation;
  }

  for(let v of opt.values) {
    newPerms = newPerms.concat(perms.map(p => newPermutationFor(p, v)));
  }

  return newPerms;
},
[{}]);

if(DEBUG) console.log('Testing options permutations:');
if(DEBUG) console.log(permutations);

const results = permutations.map(options => {
  const passed = jshint(code, options);
  const errors = jshint.data().errors;
  return { passed, options, errors };
});


console.log(`Of ${permutations.length} permutations...`);
const failures = results.filter(r => !r.passed);
if(failures.length) {
  console.log('SOMETHING FAILED JSHINT!!!');
  console.log(JSON.stringify(failures, null, 2));
} else console.log('Nothing failed to lint :(');
