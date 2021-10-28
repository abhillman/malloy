import { InMemoryUriFetcher } from "malloy";
import { run } from "./index";

const unModeledQuery = "'examples.flights' | reduce flight_count is count()";
const modeledQuery = "flights | reduce flight_count";
const model = "define flights is ('examples.flights' flight_count is count());";

const modelUri = "file:///flights.malloy";
const modeledQueryUri = "file:///modeled_query.malloy";
const unmodeledQueryUri = "file:///unmodeled_.malloy";

const files = new InMemoryUriFetcher(
  new Map([
    [modelUri, model],
    [modeledQueryUri, modeledQuery],
    [unmodeledQueryUri, unModeledQuery],
  ])
);

it("runs a query string", async () => {
  const result = await run(files, ["--query", unModeledQuery]);
  expect(result.result).toMatchObject([{ flight_count: 37561525 }]);
});

it("runs a query file", async () => {
  const result = await run(files, ["--query-file", unmodeledQueryUri]);
  expect(result.result).toMatchObject([{ flight_count: 37561525 }]);
});

it("runs a query string against a model string", async () => {
  const result = await run(files, ["--query", modeledQuery, "--model", model]);
  expect(result.result).toMatchObject([{ flight_count: 37561525 }]);
});

it("runs a query string against a model file", async () => {
  const result = await run(files, [
    "--query",
    modeledQuery,
    "--model-file",
    modelUri,
  ]);
  expect(result.result).toMatchObject([{ flight_count: 37561525 }]);
});

it("runs a query file against a model string", async () => {
  const result = await run(files, [
    "--query-file",
    modeledQueryUri,
    "--model",
    model,
  ]);
  expect(result.result).toMatchObject([{ flight_count: 37561525 }]);
});

it("runs a query file against a model file", async () => {
  const result = await run(files, [
    "--query-file",
    modeledQueryUri,
    "--model-file",
    modelUri,
  ]);
  expect(result.result).toMatchObject([{ flight_count: 37561525 }]);
});
