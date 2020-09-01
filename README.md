# piggle

A library for processing generator javascript functions with automatic retries on transitory failures.

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
