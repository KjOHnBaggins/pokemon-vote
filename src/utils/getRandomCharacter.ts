const MAX_DEX_ID = 500;

export const getRandomCharacter: (notThisOne?: number) => number = (
  notThisOne?: number
) => {
  const characterNumber = Math.floor(Math.random() * (MAX_DEX_ID - 1) + 1);
  if (characterNumber !== notThisOne) return characterNumber;
  return getRandomCharacter(notThisOne);
};

export const getOptionsForVote = () => {
  const firstId = getRandomCharacter();
  const secondId = getRandomCharacter(firstId);
  return [firstId, secondId];
};
