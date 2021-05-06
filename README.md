# Piggle

A simple mechanism for executing fragile (e.g. network or database reliant) functions.

![](https://github.com/karlhulme/piggle/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/piggle.svg)](https://www.npmjs.com/package/piggle)

Define a long-running operation as an asynchronous javascript function.  Pass that function to piggle to execute.

Piggle will automatically retry the function if a transitory error is raised using an exponential backoff strategy.  The errors considered transitory and the backoff strategy can be configured.

There's a good piggle!

## Example

In the example below, functions `setValueOnService` and `setValueAtDatabase` are async functions that call an external service and database respectively.  We know they could fail due to temporary issues, so we wrap the calls using the `retryable` function exported from `piggle`.

```javascript
import { retryable } from 'piggle'
import { setValueOnService, SomeNetworkError } from 'external-service'
import { setValueAtDatabase, SomeDatabaseError } from 'external-database'

async function doWork (newValue: string): Promise<void> {
  const transientErrorTypes = { transientErrorTypes: [SomeNetworkError, SomeDatabaseError] }
  const retryStrategy = [100, 200, 500]

  await retryable(() => setValueOnService(newValue), transientErrorTypes, retryStrategy)
  await retryable(() => setValueAtDatabase(newValue), transientErrorTypes, retryStrategy)
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
