import * as trpcNext from "@trpc/server/adapters/next";
import { AppRouter, appRouter } from "@/backend/router";
import { inferProcedureOutput } from "@trpc/server";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});

// Theo's v9 helper
// export type inferQueryResponse<
//   TRouteKey extends keyof AppRouter["getPokemonById"]
// > = inferProcedureOutput<AppRouter["getPokemonById"][TRouteKey]>;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type PostCreateInput = RouterInput["getCharacterById"];
export type PostCreateOutput = RouterOutput["getCharacterById"];
