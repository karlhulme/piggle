/* eslint-env jest */
const { executeProcess } = require('./executeProcess')
const { retain } = require('./retain')
const { TransitoryError } = require('./TransitoryError')

function createInput () {
  return {
    first: 10,
    second: 20,
    third: 40,
    fourth: 80
  }
}

function flakeyAdder (responses) {
  if (!Array.isArray(responses)) {
    throw new Error('Expected array of responses.')
  }

  let index = -1

  return async function (firstOperand, secondOperand) {
    index++

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (index > responses.length - 1) {
          throw new Error('Not enough responses')
        } else if (responses[index] instanceof Error) {
          reject(responses[index])
        } else if (responses[index]) {
          resolve(firstOperand + secondOperand)
        } else {
          reject(new TransitoryError())
        }
      }, 50)
    })
  }
}

test('The executeProcess will execute all the steps in a generator function.', async () => {
  const input = createInput()
  const output = {}

  const generator = function * (input, output) {
    const adder = flakeyAdder([true, true, true])

    yield retain('A', () => adder(input.first, input.second))
    yield retain('B', () => adder(output.A, input.third))
    yield retain('C', () => adder(output.B, input.fourth))
  }

  await expect(executeProcess(generator, input, output)).resolves.not.toThrow()
  expect(output).toEqual({
    A: 30,
    B: 70,
    C: 150,
    _steps: [
      { name: 'A', attempts: [true] },
      { name: 'B', attempts: [true] },
      { name: 'C', attempts: [true] }
    ],
    _outcome: 'SUCCESS'
  })
})

test('The executeProcess will only execute the new steps in a generator function.', async () => {
  const input = createInput()
  const output = { A: 5 }

  const generator = function * (input, output) {
    const adder = flakeyAdder([true, true, true])

    yield retain('A', () => adder(input.first, input.second))
    yield retain('B', () => adder(output.A, input.third))
    yield retain('C', () => adder(output.B, input.fourth))
  }

  await expect(executeProcess(generator, input, output)).resolves.not.toThrow()
  expect(output).toEqual({
    A: 5,
    B: 45,
    C: 125,
    _steps: [
      { name: 'B', attempts: [true] },
      { name: 'C', attempts: [true] }
    ],
    _outcome: 'SUCCESS'
  })
})

test('The executeProcess will execute all the steps in a generator function ignoring transitory failures.', async () => {
  const input = createInput()
  const output = {}

  const generator = function * (input, output) {
    const adder = flakeyAdder([false, false, false, true, false, false, true, false, true])

    yield retain('A', () => adder(input.first, input.second))
    yield retain('B', () => adder(output.A, input.third))
    yield retain('C', () => adder(output.B, input.fourth))
  }

  await expect(executeProcess(generator, input, output)).resolves.not.toThrow()
  expect(output).toEqual({
    A: 30,
    B: 70,
    C: 150,
    _steps: [
      { name: 'A', attempts: ['Error: Transitory error.', 'Error: Transitory error.', 'Error: Transitory error.', true] },
      { name: 'B', attempts: ['Error: Transitory error.', 'Error: Transitory error.', true] },
      { name: 'C', attempts: ['Error: Transitory error.', true] }
    ],
    _outcome: 'SUCCESS'
  })
})

test('The executeProcess will fail to complete execution if an inrecoverable error is raised.', async () => {
  const input = createInput()
  const output = {}

  const generator = function * (input, output) {
    const adder = flakeyAdder([false, true, false, false, new Error('Bad Input')])

    yield retain('A', () => adder(input.first, input.second))
    yield retain('B', () => adder(output.A, input.third))
    yield retain('C', () => adder(output.B, input.fourth))
  }

  await expect(executeProcess(generator, input, output)).resolves.not.toThrow()
  expect(output).toEqual({
    A: 30,
    _steps: [
      { name: 'A', attempts: ['Error: Transitory error.', true] },
      { name: 'B', attempts: ['Error: Transitory error.', 'Error: Transitory error.', 'Error: Bad Input'] }
    ],
    _outcome: 'FAILURE'
  })
})

test('The executeProcess will fail to complete execution if too many transitory errors are received.', async () => {
  const input = createInput()
  const output = {}

  const generator = function * (input, output) {
    const adder = flakeyAdder([true, false, false, false, false, false])

    yield retain('A', () => adder(input.first, input.second))
    yield retain('B', () => adder(output.A, input.third))
    yield retain('C', () => adder(output.B, input.fourth))
  }

  await expect(executeProcess(generator, input, output)).resolves.not.toThrow()
  expect(output).toEqual({
    A: 30,
    _steps: [
      { name: 'A', attempts: [true] },
      { name: 'B', attempts: ['Error: Transitory error.', 'Error: Transitory error.', 'Error: Transitory error.', 'Error: Transitory error.', 'Error: Transitory error.'] }
    ],
    _outcome: 'EXPIRED'
  })
})
