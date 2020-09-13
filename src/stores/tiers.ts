import { writable, derived } from "svelte/store";
import { v4 as generateId } from "uuid";
import type { Division } from "./divisions";
import type { Champion } from "./champions";

interface Tier {
  divisionId: Division["id"];
  id: number;
  name: string;
  championOrder: Champion["id"][];
}

interface TierStore {
  resources: Record<Tier["id"], Tier>;
  order: Tier["id"][];
}

export function createTierStore() {
  const { subscribe, update } = writable<TierStore>({
    resources: {},
    order: [],
  });

  return {
    subscribe,
    addChampionToTier: ({ championId, tierId, position }: any) => {
      update((state) => {
        const newResources = { ...state.resources };
        const { championOrder } = newResources[tierId];

        championOrder.splice(position ?? championOrder.length, 0, championId);

        return {
          resources: newResources,
          order: state.order,
        };
      });
    },
    bulkAddChampionToTier: ({ championIds, tierId }: any) => {
      update((state) => {
        const newResources = { ...state.resources };
        const { championOrder } = newResources[tierId];

        championOrder.concat(championIds);

        return {
          resources: newResources,
          order: state.order,
        };
      });
    },
    deleteChampionFromTier: ({ championPosition, tierId }: any) => {
      update((state) => {
        const newResources = { ...state.resources };
        const { championOrder } = newResources[tierId];

        championOrder.splice(championPosition, 1);

        return {
          resources: newResources,
          order: state.order,
        };
      });
    },
    moveChampionFromTier: ({
      startChampionPosition,
      endChampionPosition,
      startTierId,
      endTierId,
    }: any) => {
      update((state) => {
        const newResources = { ...state.resources };
        const { championOrder: startChampionOrder } = newResources[startTierId];
        const championId = startChampionOrder[startChampionPosition];

        startChampionOrder.splice(startChampionPosition, 1);

        if (endTierId === undefined) {
          // moving within the same tier
          startChampionOrder.splice(endChampionPosition, 0, championId);
        } else {
          newResources[endTierId].championOrder.splice(
            endChampionPosition,
            0,
            championId
          );
        }

        return {
          resources: newResources,
          order: state.order,
        };
      });
    },
    addTier: ({ name, position, divisionId }: any) => {
      update((state) => {
        const id = generateId();

        const newResources = {
          ...state.resources,
        };

        const newOrder = state.order.splice(
          position ?? state.order.length,
          0,
          id
        );

        newResources[id] = {
          id,
          divisionId,
          name,
          championOrder: [],
        };

        return {
          resources: newResources,
          order: newOrder,
        };
      });
    },
    removeTier: ({ id }: any) => {
      update((state) => {
        const newResources = { ...state.resources };

        delete newResources[id];

        const newOrder = state.order.filter((orderId) => {
          return orderId !== id;
        });

        return {
          resources: newResources,
          order: newOrder,
        };
      });
    },
    renameTier: ({ tierId, name }: any) => {
      update((state) => {
        const newResources = { ...state.resources };

        newResources[tierId].name = name;

        return {
          resources: newResources,
          order: state.order,
        };
      });
    },
  };
}

export const tierStore = createTierStore();
