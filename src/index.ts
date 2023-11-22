import inquirer from "inquirer"
import exit from "exit"
import ora from "ora"

import { parseArgs } from "./args"
import { createTunnel, logIntoDB } from "./teleport"
import { println, waitForEscKey } from "./tty"
import { getDBName } from "./db"
import { executeWithSpinner } from "./spinner"

// todos
// - context info
// - check for tsh

export default async function main(args?: any) {
  let { portNumber, searchTerms } = args || parseArgs()
  const dbName: string = await getDBName(searchTerms)

  if (!portNumber) {
    portNumber = Math.floor(Math.random() * 20000) + 50000 // generate a random port number between 5000 and 7000
    println(`No port number supplied, will use port: ${portNumber}`)
  }

  await executeWithSpinner(`Logging into ${dbName}`, logIntoDB, dbName)

  const { abort, port } = await executeWithSpinner(
    `Creating tunnel to ${dbName}`,
    createTunnel,
    dbName,
    portNumber
  )

  println(`Tunnel created on port :${port}`)
  println("Press <ctrl-c> key to kill tunnel")

  await waitForEscKey(abort)

  exit(0)
}
