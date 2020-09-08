<script lang="ts">
  import Division from "../components/Division.svelte";
  import { divisionStore } from "../stores/divisions";
  import { tierStore } from "../stores/tiers";

  let tierName = "";

  function handleClick() {
    if (tierName !== "") {
      tierStore.addTier(tierName);
      tierName = "";
    }
  }
</script>

<style>
  .division-container {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 300px;
    grid-auto-rows: auto;
    gap: 8px;
  }

  .cell {
    grid-column: 1;
    grid-row: var(--row);
  }
</style>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<div
  class="bg-gradient-to-r from-green-400 to-teal-400 h-screen w-screen
    overflow-auto">
  <h1>Tiers</h1>

  <input bind:value={tierName} />
  <button on:click={handleClick}>Add</button>

  <div class="division-container">
    <div>header</div>
    {#each $tierStore as tier, index}
      <div class="cell" style="--row: {index + 2}">{tier.name}</div>
    {/each}
    {#each $divisionStore as division, index}
      <Division {division} columnNumber={index + 2} />
    {/each}
  </div>
</div>
