import { trpc } from "@/utils/trpc";
import { getOptionsForVote } from "@/utils/getRandomCharacter";
import React, { useState } from "react";
import { PostCreateOutput } from "./api/trpc/[trpc]";
import Image from "next/image";
import Link from "next/link";

const btn =
  "w-24 h-24 sm:w-36 sm:h-12 lg:w-4/6 inline-flex self-center items-center justify-center border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-neutral-400 hover:text-white focus:outline-none focus:ring-8 focus:ring-offset-2 focus:ring-neutral-400";

export default function Home() {
  const [ids, updateIds] = useState(() => getOptionsForVote());
  const [first, second] = ids;
  const firstCharacter = trpc.getCharacterById.useQuery({ id: first });
  const secondCharacter = trpc.getCharacterById.useQuery({ id: second });

  const voteMutation = trpc.castVote.useMutation();

  const voteForWinner = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }
    updateIds(getOptionsForVote());
  };

  const dataLoaded =
    !firstCharacter.isLoading &&
    firstCharacter.data &&
    !secondCharacter.isLoading &&
    secondCharacter.data;
  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center">
      <div className="text-center text-lg sm:text-2xl lg:text-4xl mt-2 md:mt-6">
        Who Wins!
      </div>
      {dataLoaded && (
        <div className="flex flex-col sm:flex-row justify-between items-center min-h-[75%] min-w-[80%] md:min-w-[60%] ">
          <div className="flex self-start sm:self-center flex-row sm:flex-col justify-between md:items-center w-full">
            <CharacterListing
              character={firstCharacter.data}
              vote={() => voteForWinner(first)}
            />
          </div>
          <div className="flex flex-col m-8 w-[8%]">
            <span className="text-xl sm:text-2xl lg:text-4xl self-start">
              V
            </span>
            <span className="text-base sm:text-lg lg:text-2xl self-end">S</span>
          </div>
          <div className="flex self-end sm:self-center flex-row-reverse sm:flex-col justify-between md:items-center w-full">
            <CharacterListing
              character={secondCharacter.data}
              vote={() => voteForWinner(second)}
            />
          </div>
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

type CharacterFromServer = PostCreateOutput;

const CharacterListing: React.FC<{
  character: CharacterFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <>
      <div className="flex flex-col items-center">
        <Image
          src={props.character.imageUrl}
          width={356}
          height={356}
          alt="character-img"
          className="h-48 w-full sm:w-32 object-cover md:h-full md:w-48 lg:w-64 rounded-2xl"
        />
        <div className="text-center capitalize text-base sm:text-2xl mt-4 sm:my-6">
          {props.character.name}
        </div>
      </div>

      <button className={btn} onClick={() => props.vote()}>
        Wins
      </button>
    </>
  );
};
