import { trpc } from "@/utils/trpc";
import { getOptionsForVote } from "@/utils/getRandomPokemon";
import React, { useState } from "react";
import { PostCreateOutput } from "./api/trpc/[trpc]";
import Image from "next/image";
import Link from "next/link";

const btn =
  "inline-flex items-center justify-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

export default function Home() {
  const [ids, updateIds] = useState(() => getOptionsForVote());
  const [first, second] = ids;
  const firstPokemon = trpc.getPokemonById.useQuery({ id: first });
  const secondPokemon = trpc.getPokemonById.useQuery({ id: second });

  const voteMutation = trpc.castVote.useMutation();

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }
    updateIds(getOptionsForVote());
  };

  const dataLoaded =
    !firstPokemon.isLoading &&
    firstPokemon.data &&
    !secondPokemon.isLoading &&
    secondPokemon.data;
  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center">
      <div className="text-2xl text-center pt-8">Which pokimon is Rounder?</div>
      <div className="p-2" />
      {dataLoaded && (
        <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
          <PokemonListing
            pokemon={firstPokemon.data}
            vote={() => voteForRoundest(first)}
          />
          <div className="p-8">Vs</div>
          <PokemonListing
            pokemon={secondPokemon.data}
            vote={() => voteForRoundest(second)}
          />
        </div>
      )}
      {!dataLoaded && <img src="/rings.svg" className="w-48" />}
      <div className="w-full text-xl text-center p-2">
        <a href="https://github.com/KjOHnBaggins/pokemon-vote">Github</a>
        {"|"}
        <Link href="/results">Results</Link>
      </div>
    </div>
  );
}

type PokemonFromServer = PostCreateOutput;

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={props.pokemon.spritesUrl}
        width={256}
        height={256}
        alt="pokemon-img"
      />

      <div className="text-xl text-center capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <button className={btn} onClick={() => props.vote()}>
        Rounder
      </button>
    </div>
  );
};
