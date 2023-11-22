import ora from "ora"

/**
 * Executes an async function with a spinner
 * @param message the message for the spinner
 * @param fn the function to be executed during the lifecycle of the spinner
 * @param fnArgs arguments to be passed to the function
 * @returns any return value from the argument
 */
export async function executeWithSpinner(
  message: string,
  fn: Function,
  ...fnArgs: any[]
) {
  let spinner = ora(message).start()
  try {
    const result = await fn.apply(null, fnArgs)
    spinner.succeed()
    return result
  } catch (err) {
    spinner.fail()
    throw err
  }
}
