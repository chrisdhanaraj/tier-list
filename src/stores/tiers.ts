import { writable, derived } from "svelte/store";
import { divisionStore } from "./divisions";

export interface TierItem {
  name: string;
}

interface TierStore {
  resources: Record<TierItem["name"], TierItem>;
  order: TierItem["name"][];
}

export function createTierStore() {
  const { subscribe, set, update } = writable<TierStore>({
    resources: {},
    order: [],
  });

  return {
    subscribe,
    addTier: (name: string, position?: number) => {
      update((state) => {
        const newState = { ...state };

        newState.resources[name] = {
          name,
        };

        newState.order.splice(position ?? state.order.length, 0, name);

        // Send update to Division Store that a new tier has
        // been added

        divisionStore.addTier({
          name,
        });

        return newState;
      });
    },
    removeTier: (position) => {
      update((state) => {
        const newState = [...state];
        newState.splice(position, 1);

        return newState;
      });
    },
  };
}

export const tierStore = createTierStore();

export const tierDictionary = derived(tierStore, ($tierStore) => {
  const dictionary = new Map();

  $tierStore.forEach((tier) => {
    dictionary.set(tier.name, tier);
  });

  return dictionary;
});
