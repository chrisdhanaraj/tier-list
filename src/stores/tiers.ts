import { writable, get } from "svelte/store";
import { v4 as generateId } from "uuid";
import { divisionTierStore } from "./divisionTier";

export interface Tier {
  id: number;
  name: string;
}

interface TierStore {
  resources: Record<Tier["id"], Tier>;
  order: Tier["id"][];
}

interface AddTier {
  name: string;
  position: number;
}

interface RemoveTier {
  tierId: Tier["id"];
}

interface RenameTier {
  tierId: Tier["id"];
  name: string;
}

export function createTierStore() {
  const { subscribe, update } = writable<TierStore>({
    resources: {},
    order: [],
  });

  return {
    subscribe,
    addTier: ({ name, position }: AddTier) => {
      update((state) => {
        // Create one for every division
        const id = generateId();

        const newTier: Tier = {
          id,
          name,
        };

        const newResources = {
          ...state.resources,
          [id]: newTier,
        };

        const newOrder = state.order.splice(
          position ?? state.order.length,
          0,
          id
        );

        divisionTierStore.initializeDivisionTier({
          tierId: id,
        });

        return {
          resources: newResources,
          order: newOrder,
        };
      });
    },
    removeTier: ({ tierId }: RemoveTier) => {
      update((state) => {
        const newResources = { ...state.resources };

        delete newResources[tierId];

        const newOrder = state.order.filter((orderId) => {
          return orderId !== tierId;
        });

        return {
          resources: newResources,
          order: newOrder,
        };
      });
    },
    renameTier: ({ tierId, name }: RenameTier) => {
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
