# Piggle

![](https://github.com/karlhulme/piggle/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/piggle.svg)](https://www.npmjs.com/package/piggle)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Define long-running tasks as javascript generator functions.  Ensure there's a yield after each important change.

Piggle will then execute those tasks ensuring that any transitory failures are retries automatically.

If the long-running task cannot be completed then it will output the current progress as an object.  You can store this object in a database, and you can pass this object back to Piggle to have it resume the task from wherever it left off.

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
