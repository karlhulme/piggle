# Piggle

![](https://github.com/karlhulme/piggle/workflows/CD/badge.svg)
[![npm](https://img.shields.io/npm/v/piggle.svg)](https://www.npmjs.com/package/piggle)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Define long-running operations as javascript generator functions.  Ensure there's a yield after each important change.

Piggle will then execute those operations ensuring that any steps that experience transitory failures are retried.  You can set the strategy for this.

After each step in the operation an event emits an object that represents the current state of the operation.  You can (and should) save this in a database.  Ultimately, if the operation cannot be completed, the existing progress will be saved and can be resumed by passing the current state when re-launching the operation.

There's a good piggle!

## Example

Feels like an example would be helpful here.

## Installation

```bash
npm install piggle
```

## Development

Code written in Typescript.

## Types

The type declarations are produced by the typescript compiler `tsc`.  This configured via the `tsconfig.json` file.  Output is written to the `/types` folder.

```bash
npm run types
```

## Testing

Tests are written using the `Jest` framework.  100% coverage is required.

The `jest.transform` key (in `package.json`) instructs Jest to run all input files through babel before attempting to read the files.  Babel transpiles the files into es5.

```bash
npm test
```

## Build

`Rollup` is used to pass a series of configurations to babel with a view to producing cjs and esm modules.

```bash
npm run build
```

## Continuous Integration and Deployment

Any pushes or pull-requests on non-master branches will trigger the test runner.

Any pushes to master will cause the library to be re-published.
