import yargs from "yargs"
import { hideBin } from "yargs/helpers"

export function parseArgs(): {
  portNumber: string
  searchTerms: string[]
} {
  const args: any = yargs(hideBin(process.argv)).argv
  const searchTerms: string[] = [].concat(args._ ?? [])
  const portNumber: string = args.port || args.p || ""

  return {
    portNumber,
    searchTerms,
  }
}
