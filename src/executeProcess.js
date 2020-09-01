const { TransitoryError } = require('./TransitoryError')

const EXECUTE_PROCESS_STATUS_SUCCESS = 'SUCCESS'
const EXECUTE_PROCESS_STATUS_FAILURE = 'FAILURE'
const EXECUTE_PROCESS_STATUS_EXPIRED = 'EXPIRED'

// consider a timeout on the promises - which should be long, and then assume failure?
// consider a back-off strategy / different strategies generally on the retry

async function executeStep (promise) {
  const attempts = []

  for (let i = 0; i < 5; i++) {
    try {
      const value = await promise()
      attempts.push(true)
      return { status: EXECUTE_PROCESS_STATUS_SUCCESS, attempts, value }
    } catch (err) {
      attempts.push(err.toString())

      if (!(err instanceof TransitoryError)) {
        return { status: EXECUTE_PROCESS_STATUS_FAILURE, attempts }
      }
    }
  }

  return { status: EXECUTE_PROCESS_STATUS_EXPIRED, attempts }
}

async function executeProcess (processGFunc, input, output) {
  delete output._error

  output._steps = []

  const process = processGFunc(input, output)

  for (const step of process) {
    if (typeof output[step.stepName] === 'undefined') {
      const stepResult = await executeStep(step.promise)
      output._steps.push({ name: step.stepName, attempts: stepResult.attempts })

      if (stepResult.status === EXECUTE_PROCESS_STATUS_SUCCESS) {
        output[step.stepName] = stepResult.value
      } else {
        output._outcome = stepResult.status
        return
      }
    }
  }

  output._outcome = EXECUTE_PROCESS_STATUS_SUCCESS
}

module.exports = {
  executeProcess
}
