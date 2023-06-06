import inquirer from "inquirer"
import exit from "exit"
import { oraPromise as spinner } from "ora"

import { parseArgs } from "./args.js"
import { createTunnel, logIntoDB } from "./teleport.js"
import { println, waitForEscKey } from "./tty.js"
import { getDBName } from "./db.js"

// todos
// - context info
// - check for tsh

export default async function main() {
  const { portNumber, searchTerms } = parseArgs()
  const dbName: string = await getDBName(searchTerms)

  await spinner(logIntoDB(dbName), `Logging into ${dbName}`)

  const { port, abort } = await spinner(
    createTunnel(dbName, portNumber),
    `Creating tunnel to ${dbName}`
  )

  println(`Tunnel created on port :${port}`)
  println("Press <ctrl-c> key to kill tunnel")

  await waitForEscKey(abort)

  exit(0)
}
