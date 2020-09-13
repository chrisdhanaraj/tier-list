// This is a future id

import { writable } from "svelte/store";

interface Resource<Item> {
  resources: Record<any, Item>;
  lists: {
    order: any[];
  };
}

interface ResourceState {
  resources: Record<string, any>;
}

export function createResourceStore<Resource>() {
  const { subscribe, set, update } = writable<ResourceState>({
    resources: {
      books: "sotere",
    },
  });

  function updateResourceItem() {}
  function deleteResourceItem() {}
  function getResourceItem() {}

  function addToList() {}
  function removeFromList() {}
  function updateList() {}
  function insertToList() {}

  return {
    subscribe,
    update,
    updateResourceItem,
    deleteResourceItem,
    getResourceItem,
    addToList,
    removeFromList,
    updateList,
    insertToList,
  };
}
