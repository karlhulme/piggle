# Piggle

A simple mechanism for executing fragile (e.g. network or database reliant) functions.

![](https://github.com/karlhulme/piggle/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/piggle.svg)](https://www.npmjs.com/package/piggle)

Define a long-running operation as an asynchronous javascript function.

Piggle will automatically retry any transitory failures using exponential backoff strategy.  The errors considered transitory and the backoff strategy can be configured.

There's a good piggle!

## Example

A typical usage for piggle is where you need to update multiple external resources in sequence and there is no transaction mechanism for just rolling back.  An auto retry strategy can greatly increase the chance of success.

In this example below, functions `callExternalResourceOne` and `callExternalResourceTwo` are async functions that call a webservice. 

```javascript
import { retryable } from 'piggle'
import { setValueOnService, SomeNetworkError } from 'external-service'
import { setValueAtDatabase, SomeDatabaseError } from 'external-database'

async function doWork (newValue: string): Promise<void> {
  await setValueOnService(newValue)
  await setValueAtDatabase(newValue)
}

// retry using the defaults
await retryable(doWork)

// specifying the errors to treat as transient
await retryable(doWork, { transientErrorTypes: [SomeNetworkError, SomeDatabaseError] })

// specifying the number of retry attempts by specifying the intervals between attempts (in milliseconds)
await retryable(doWork, { retryIntervalsInMilliseconds: [100, 200, 500] })
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
