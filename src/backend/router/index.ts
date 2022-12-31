import { procedure, router } from "../trpc";
import * as trpc from "@trpc/server";
import { z } from "zod";
import { PokemonClient } from "pokenode-ts";
import { prisma } from "../utils/prisma";

export const appRouter = router({
  getPokemonById: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const pokeApiConnection = new PokemonClient();
      const pokemon = await pokeApiConnection.getPokemonById(input?.id);
      return {
        name: pokemon.name,
        sprites: {
          front_default: pokemon.sprites.front_default || "",
        },
      };
    }),
  castVote: procedure
    .input(
      z.object({
        votedFor: z.number(),
        votedAgainst: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const voteInDb = await prisma.vote.create({
        data: {
          id: "some-unique-id",
          votedFor: input.votedFor,
          votedAgainst: input.votedAgainst,
        },
      });
      return { success: true, vote: voteInDb };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
