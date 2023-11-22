import child_process from "node:child_process"

export async function createTunnel(
  dbName: string,
  portNumber: string
): Promise<{
  abort(): void
  port: string
}> {
  const ctrl = new AbortController()

  const { stdout, stderr } = await new Promise<{
    stdout: string
    stderr: string
  }>((res, rej) => {
    let _stdout = "",
      _stderr = "",
      _err: Error
    const args = ["proxy", "db", "--tunnel", dbName]
    if (portNumber && Number.isInteger(+portNumber)) {
      args.push("--port", portNumber)
    }
    const tunnelProc = child_process.spawn("tsh", args, {
      signal: ctrl.signal,
    })

    function resolve() {
      if (_err) {
        rej(_err)
        return
      }
      res({
        stdout: _stdout,
        stderr: _stderr,
      })
    }

    tunnelProc.stdout.on("data", (data) => {
      _stdout += data
      resolve()
    })
    tunnelProc.stderr.on("data", (data) => {
      _stderr += data
      resolve()
    })
    tunnelProc.on("error", (err) => {
      _err = err
      resolve()
    })
    tunnelProc.on("close", (code) => {
      if (code !== 0) {
        _err = new Error("tunnel closed with non 0 code")
      }
      resolve()
    })
  })

  return {
    port: portNumber,
    abort: () => {
      process.stdout.write("Killing tunnel...\n")
      ctrl.abort("killing tunnel")
    },
  }
}

export async function getAvailableDBs(): Promise<Set<string>> {
  const dbs = new Set<string>()

  const { stdout } = await new Promise<{
    stdout: string
    stderr: string
  }>((res, rej) => {
    child_process.exec(
      "tsh db ls --format json",
      {
        maxBuffer: 1024 * 1024 * 5,
      },
      (err, stdout, stderr) => {
        if (err) {
          rej(err)
        } else {
          res({
            stdout,
            stderr,
          })
        }
      }
    )
  })

  const parsed = JSON.parse(stdout)

  if (!Array.isArray(parsed)) {
    throw new Error("unexpected output from tsh")
  }

  for (const item of parsed) {
    if (item.kind !== "db") {
      continue
    }

    dbs.add(item.metadata.name)
  }

  return dbs
}

export async function logIntoDB(dbName: string): Promise<void> {
  await new Promise((res, rej) => {
    child_process.exec(`tsh db login ${dbName}`, (err, stdout, stderr) => {
      if (err) {
        rej(err)
      } else {
        res({
          stdout,
          stderr,
        })
      }
    })
  })
}
