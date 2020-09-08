import { writable, derived } from "svelte/store";
import { tierDictionary } from "./tiers";

enum Divisions {
  Bronze = "Bronze",
  Silver = "Silver",
  Gold = "Gold",
  Platinum = "Platinum",
  Challenger = "Challenger",
}

interface Tier {
  name: string;
  champions: string[];
}

export interface DivisionItem {
  name: string;
  tiers: Tier[];
}

interface DivisionStoreStructure {
  resources: Record<DivisionItem["name"], DivisionItem>;
  order: DivisionItem["name"][];
}

const defaultDivisions: DivisionItem[] = Object.keys(Divisions).map((item) => {
  return {
    name: item,
    tiers: [],
  };
});

export function createDivisionStore() {
  const { subscribe, set, update } = writable<DivisionItem[]>(defaultDivisions);

  return {
    subscribe,
    addChampion: ({ divisionName, tierName, champion }) => {},
    mergeWithNextDivision: (startDivisionName: string) => {
      update((currentState) => {
        const startDivisionIndex = currentState.findIndex((division) => {
          return division.name === startDivisionName;
        });

        console.log(startDivisionIndex, currentState);

        const startDivision = currentState[startDivisionIndex];
        const endDivision = currentState[startDivisionIndex + 1];

        const mergedTiers: Tier[] = startDivision.tiers.map((tier, index) => {
          return {
            name: tier.name,
            champions: tier.champions.concat(
              endDivision.tiers[index].champions
            ),
          };
        });

        const mergedDivisions: DivisionItem = {
          name: `${startDivision.name} / ${endDivision.name}`,
          tiers: mergedTiers,
        };

        const finalState = [
          ...currentState.slice(0, startDivisionIndex),
          mergedDivisions,
          ...currentState.slice(startDivisionIndex + 2, currentState.length),
        ];

        return finalState;
      });
    },
    addTier: ({ name }) => {
      update((currentState) => {
        const newState = currentState.map((division) => {
          const newTiers = [...division.tiers];

          newTiers.push({
            name,
            champions: [],
          });

          return {
            ...division,
            tiers: newTiers,
          };
        });

        return newState;
      });
    },
  };
}

export const divisionStore = createDivisionStore();

export const divisionDictionary = derived(divisionStore, ($divisionStore) => {
  const dictionary = new Map();

  $divisionStore.forEach((division) => {
    dictionary.set(division.name, division);
  });

  return dictionary;
});
