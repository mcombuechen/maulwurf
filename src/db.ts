import inquirer from "inquirer"
import { oraPromise as spinner } from "ora"

import { getAvailableDBs } from "./teleport.js"

export async function getDBName(searchTerms: string[]): Promise<string> {
  const availableDBs = await spinner(
    getAvailableDBs(),
    "Loading available databases"
  )

  // check if exact db name has been provided
  if (searchTerms.length === 1 && availableDBs.has(searchTerms[0])) {
    return searchTerms[0]
  }

  // show prompt with available db names
  let filteredDBs = [...availableDBs]
  if (searchTerms.length > 0) {
    for (const term of searchTerms) {
      filteredDBs = filteredDBs.filter((dbName) => dbName.includes(term))
    }
  }

  if (filteredDBs.length < 1) {
    filteredDBs = [...availableDBs]
  }

  const input = await inquirer.prompt<{ dbName: string }>([
    {
      type: "list",
      name: "dbName",
      message: "Select database to create tunnel for.",
      choices: filteredDBs,
    },
  ])

  return input.dbName
}
