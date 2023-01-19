import { prisma } from "../utils/prisma";
import { procedure, router } from "../trpc";
import * as trpc from "@trpc/server";
import { z } from "zod";

export const appRouter = router({
  getCharacterById: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const character = await prisma.character.findFirst({
        where: { id: input?.id },
      });

      if (!character) throw new Error("lol doen't exist");

      return character;
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
          votedForId: input.votedFor,
          votedAgainstId: input.votedAgainst,
        },
      });
      return { success: true, vote: voteInDb };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
