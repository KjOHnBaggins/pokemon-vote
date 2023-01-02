import type { GetServerSideProps } from "next";
import { prisma } from "@/backend/utils/prisma";
import React from "react";
import { inferAsyncReturnType } from "@trpc/server";
import { AsyncReturnType } from "@/utils/ts-bs";
import { type } from "os";
import Image from "next/image";

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: { _count: "desc" },
    },
    select: {
      id: true,
      name: true,
      spritesUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
  });
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const PokemonListing: React.FC<{ pokemon: PokemonQueryResult[number] }> = (
  props
) => {
  return (
    <div className="flex">
      <Image
        src={props.pokemon.spritesUrl}
        width={256}
        height={256}
        alt="pokemon-img"
      />
    </div>
  );
};

const ResultsPage: React.FC<{
  pokemon: AsyncReturnType<typeof getPokemonInOrder>;
}> = (props) => {
  return (
    <div className="flex flex-col">
      <h2>Results</h2>
      {props.pokemon.map((currentPokemon) => {
        return <PokemonListing pokemon={currentPokemon} key={index} />;
      })}
    </div>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const pokemonOrdered = await getPokemonInOrder();

  return {
    props: {
      pokemon: pokemonOrdered,
    },
    revalidate: 60,
  };
};
