# Piggle

![](https://github.com/karlhulme/piggle/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/piggle.svg)](https://www.npmjs.com/package/piggle)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Define long-running operations as javascript generator functions.  Ensure there's a yield after each important change.

Piggle will then execute those operations ensuring that any steps that experience transitory failures are retried.  You can set the strategy for this.

After each step in the operation an event emits an object that represents the current state of the operation.  You can (and should) save this in a database.  Ultimately, if the operation cannot be completed, the existing progress will be saved and can be resumed by passing the current state when re-launching the operation.

There's a good piggle!

## installation

```bash
npm install piggle
```

## Development

Code base adheres to the rules chosen by https://standardjs.com/.  Code is formatted with 2 spaces.

Tests are written using Jest with 100% coverage.

```javascript
npm test
```

## Continuous Integration and Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the library to be re-published.
