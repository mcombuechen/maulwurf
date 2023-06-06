const UNICODE_EOT = "\u0003"

export function println(msg: string): void {
  process.stderr.write(`${msg}\n`)
}

export async function waitForEscKey(done: Function): Promise<void> {
  process.stdin.setRawMode(true)
  process.stdin.resume()
  process.stdin.setEncoding("utf-8")

  return new Promise((res) => {
    process.stdin.on("data", (data) => {
      if (data.toString() !== UNICODE_EOT) {
        return
      }

      done()
      res()
    })
  })
}
