import { prisma } from "../src/backend/utils/prisma";

interface Character {
  id: number;
  name: string;
  imageUrl: string;
}

const dataCreate = async () => {
  const character: Character[] = [];
  for (let i = 21; i <= 500; i++) {
    await fetch(`https://superheroapi.com/api/1268726273674195/${i}`)
      .then((res) => res.json())
      .then((res) => {
        character.push({
          id: parseInt(res.id),
          name: res.name,
          imageUrl: res.image.url,
        });
      })
      .catch((e) => console.log(e));
  }
  const creation = await prisma.character.createMany({
    data: character,
  });
};

dataCreate();
