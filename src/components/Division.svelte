<script lang="ts">
  import { each } from "svelte/internal";
  import Champion from "./Champion.svelte";

  import type { DivisionItem } from "../stores/divisions";
  import { divisionStore } from "../stores/divisions";

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  const randomCount = getRandomInt(10, 30);

  function handleClick() {
    divisionStore.mergeWithNextDivision(division.name);
  }

  export let columnNumber: number;
  export let division: DivisionItem;
</script>

<style>
  .champion-container {
    display: flex;
    gap: 4px;
    align-content: flex-start;
    flex-wrap: wrap;
  }

  .cell {
    grid-column: var(--column);
    grid-row: var(--row);
  }

  .header {
    display: flex;
  }
</style>

<div class="header">
  <h1>{division.name}</h1>
  <button on:click={handleClick}>Merge</button>
</div>

{#each division.tiers as tier, index}
  <div
    class="champion-container cell"
    style="--row: {index + 2}; --column: {columnNumber}">
    {#each { length: randomCount } as _, i}
      <Champion divisionName={division.name} />
    {/each}
  </div>
{/each}
