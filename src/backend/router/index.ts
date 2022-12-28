import { procedure, router } from "../trpc";
import * as trpc from "@trpc/server";
import { z } from "zod";
import { PokemonClient } from "pokemon-ts";

export const appRouter = router({
  getPokemonById: procedure.input(z.object({ id: z.number() })),
}).query({
  async resolve({ input }) {
    const api = new PokemonClient();
    const pokemon = await api.getPokeMonById(input?.id);
    return pokemon;
  },
});

// export type definition of API
export type AppRouter = typeof appRouter;
