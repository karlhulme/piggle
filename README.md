# Piggle

A simple framework for ensuring long running and fragile (e.g. network reliant) operations are run to completion with each step performed exactly once.

![](https://github.com/karlhulme/piggle/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/piggle.svg)](https://www.npmjs.com/package/piggle)

Define a long-running operation as a javascript generator function, yielding after each creation or update of an external resource.  This provides a hook so that progress can be saved to a database as the operation proceeds.

Piggle will automatically retry any failed steps with an exponential backoff strategy.  If you wish, you can configure the strategy and define which errors should be treated as transitory.

Piggle can resume a failed operation from the point of failure.

There's a good piggle!

## Example

A typical usage for piggle is where you need to update multiple external resources in sequence and there is no transaction mechanism for just rolling back.

In this example below, functions `callExternalResourceOne` and `callExternalResourceTwo` are async functions that call a webservice and return the new id

```javascript
import { call, log, store, wait, executeOperation } from 'piggle'

function * myOperation (input, state) {
  // create the first external resource
  yield call('resourceOne', () => callExternalResourceOne(input.x))

  // other steps you can use
  yield log('pausing for 2 seconds')
  yield wait(2000)
  yield store('result', { foo: 'bar' })

  // create the second resource using data from the first
  yield call('resourceTwo', () => callExternalResourceTwo(state.resoureOne.value))
}

async function run () {
  // call the long-running operation from the beginning
  await executeOperation(myOperation, { x: 11111 }, {
    onSave: async state => { /* save the state to a database */ },
    onLog: message => console.log(message)
  })

  // call the long-running operation from after the creation of the first resource
  await executeOperation(myOperation, { x: 11111 }, {
    onSave: async state => { /* save the state to a database */ },
    onLog: message => console.log(message),
    state: {
      resourceOne: { value: 12345 }
    }
  })
}
```

## Installation

```bash
npm install piggle
```

## Development

Code written in Typescript.

## Testing

Tests are written using the `Jest` framework.  100% coverage is required.

```bash
npm test
```

## Build

Type declarations are produced by the typescript compiler `tsc`.  This is configured via the `tsconfig.json` file.  Output is written to the `/types` folder and included in the published npm package.

A CommonJS lib is produced in the `/lib` folder.

```bash
npm run build
```

## Continuous Integration and Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the library to be re-published.
