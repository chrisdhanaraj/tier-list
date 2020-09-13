import { writable, get } from "svelte/store";
import { v4 as generateId } from "uuid";
import type { Division } from "./divisions";
import type { Champion } from "./champions";
import type { Tier } from "./tiers";
import { divisionStore } from "./divisions";

interface DivisionTier {
  id: number;
  divisionId: Division["id"];
  tierId: Tier["id"];
  championOrder: Champion["id"][];
}

interface DivisionTierStore {
  resources: Record<DivisionTier["id"], DivisionTier>;
}

interface InitializeDivisionTier {
  tierId: Tier["id"];
}

interface AddChampionToTier {
  championId: Champion["id"];
  divisionTierId: DivisionTier["id"];
  position: number;
}

interface BulkAddChampionToTier {
  championIds: Champion["id"][];
  divisionTierId: DivisionTier["id"];
}

interface DeleteChampionFromTier {
  championPosition: number;
  divisionTierId: DivisionTier["id"];
}

interface MoveChampionFromTier {
  startChampionPosition: number;
  endChampionPosition: number;
  startDivisionTierId: DivisionTier["id"];
  endDivisionTierId: DivisionTier["id"];
}

function createDivisionTierStore() {
  const { subscribe, update } = writable<DivisionTierStore>({
    resources: {},
  });

  return {
    subscribe,
    initializeDivisionTier: ({ tierId }: InitializeDivisionTier) => {
      update((state) => {
        const newResources = {
          ...state.resources,
        };

        const division = get(divisionStore);

        division.order.forEach((divisionId) => {
          const id = generateId();

          newResources[id] = {
            id,
            divisionId,
            tierId,
            championOrder: [],
          };
        });

        return {
          resources: newResources,
        };
      });
    },
    addChampionToTier: ({
      championId,
      divisionTierId,
      position,
    }: AddChampionToTier) => {
      update((state) => {
        const newResources = { ...state.resources };
        const { championOrder } = newResources[divisionTierId];

        championOrder.splice(position ?? championOrder.length, 0, championId);

        return {
          resources: newResources,
        };
      });
    },
    bulkAddChampionToTier: ({
      championIds,
      divisionTierId,
    }: BulkAddChampionToTier) => {
      update((state) => {
        const newResources = { ...state.resources };
        const { championOrder } = newResources[divisionTierId];

        championOrder.concat(championIds);

        return {
          resources: newResources,
        };
      });
    },
    deleteChampionFromTier: ({
      championPosition,
      divisionTierId,
    }: DeleteChampionFromTier) => {
      update((state) => {
        const newResources = { ...state.resources };
        const { championOrder } = newResources[divisionTierId];

        championOrder.splice(championPosition, 1);

        return {
          resources: newResources,
        };
      });
    },
    moveChampionFromTier: ({
      startChampionPosition,
      endChampionPosition,
      startDivisionTierId,
      endDivisionTierId,
    }: MoveChampionFromTier) => {
      update((state) => {
        const newResources = { ...state.resources };
        const { championOrder: startChampionOrder } = newResources[
          startDivisionTierId
        ];
        const championId = startChampionOrder[startChampionPosition];

        startChampionOrder.splice(startChampionPosition, 1);

        if (endDivisionTierId === undefined) {
          // moving within the same tier
          startChampionOrder.splice(endChampionPosition, 0, championId);
        } else {
          newResources[endDivisionTierId].championOrder.splice(
            endChampionPosition,
            0,
            championId
          );
        }

        return {
          resources: newResources,
        };
      });
    },
  };
}

export const divisionTierStore = createDivisionTierStore();
