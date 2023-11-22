import main from "./index"

describe("index", function () {
  it("tunnels into a database using teleport", async function () {
    await main({
      searchTerms: ["targets-db"],
    })
  }, 30000)
})
