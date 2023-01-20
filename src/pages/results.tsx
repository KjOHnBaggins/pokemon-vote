import type { GetServerSideProps } from "next";
import { prisma } from "@/backend/utils/prisma";
import React from "react";
import { AsyncReturnType } from "@/utils/ts-bs";
import Image from "next/image";

const getCharacterInOrder = async () => {
  return await prisma.character.findMany({
    orderBy: {
      VoteFor: { _count: "desc" },
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
  });
};

type CharacterQueryResult = AsyncReturnType<typeof getCharacterInOrder>;

const generateCountPercent = (character: CharacterQueryResult[number]) => {
  const { VoteFor, VoteAgainst } = character._count;
  if (VoteFor + VoteAgainst === 0) return 0;
  return (VoteFor / (VoteFor + VoteAgainst)) * 100;
};

const CharacterListing: React.FC<{
  character: CharacterQueryResult[number];
}> = (props) => {
  return (
    <div className="flex border-b p-2 items-center justify-between">
      <div className="flex items-center">
        <Image
          src={props.character.imageUrl}
          width={64}
          height={64}
          className="rounded-lg mr-3"
          alt="character-img"
        />
        <div className="capitalize font-medium text-sm sm:text-xl">
          {props.character.name}
        </div>
      </div>
      <div className="pr-4">
        {generateCountPercent(props.character).toFixed(2) + "%"}
      </div>
    </div>
  );
};

const ResultsPage: React.FC<{
  character: CharacterQueryResult;
}> = (props) => {
  return (
    <div className="flex flex-col items-center mx-3 sm:mx-12">
      <h2 className="text-2xl p-4">Results</h2>
      <div className="flex flex-col w-full max-w-2xl border rounded-lg">
        {props.character
          .sort((a, b) => generateCountPercent(b) - generateCountPercent(a))
          .map((currentCharacter, index) => {
            return (
              <CharacterListing character={currentCharacter} key={index} />
            );
          })}
      </div>
    </div>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const characterOrdered = await getCharacterInOrder();

  return {
    props: {
      character: characterOrdered,
    },
    revalidate: 60,
  };
};
