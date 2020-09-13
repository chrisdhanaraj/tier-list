import { writable } from "svelte/store";

enum Divisions {
  Bronze = "Bronze",
  Silver = "Silver",
  Gold = "Gold",
  Platinum = "Platinum",
  Challenger = "Challenger",
}

export interface Division {
  id: number;
  name: string;
}

interface DivisionStoreStructure {
  resources: Record<Division["id"], Division>;
  order: Division["id"][];
}

const defaultResources = {
  resources: {},
  order: [],
};

Object.keys(Divisions).forEach((divisionName, index) => {
  defaultResources.resources[index] = {
    id: index,
    name: divisionName,
  };

  defaultResources.order.push(index);
});

export function createDivisionStore() {
  const { subscribe, update } = writable<DivisionStoreStructure>(
    defaultResources
  );

  return {
    subscribe,
    mergeWithNextDivision: (startDivisionId: number) => {
      // Merge order, merge resources
      update((currentState) => {
        // clone so we can operate
        const newResources = { ...currentState.resources };
        const newOrder = [...currentState.order];

        const startDivisionIndex = newOrder.findIndex((id) => {
          return id === startDivisionId;
        });

        const startDivision = newResources[startDivisionIndex];
        const endDivision = newResources[startDivisionIndex + 1];

        const mergedDivisions: Division = {
          id: 100,
          name: `${startDivision.name} / ${endDivision.name}`,
        };

        // remove old stuff
        delete newResources[startDivision.id];
        delete newResources[endDivision.id];

        // add in the new one
        newOrder.splice(startDivisionIndex, 2, mergedDivisions.id);

        return {
          resources: newResources,
          order: newOrder,
        };
      });
    },
  };
}

export const divisionStore = createDivisionStore();
