# Overview

## Actions You Can Take (MVP)

- Add tier
- Rename tier
- Add champion
- Bulk add champions
- Rearrange champions (within a division)
- Filter by champion
- Filter by metadata TBD

## Other Features

- Aggressive champion metadata caching
- Cache bust on key, recreate champion cache

## Entities

- Divisions
- Tier
- Champion

## Relationships

- Divisions
  - Tier
    - Champion

Only _Tier_ is user specific. Divisions/Champions are app level. So when we create our internal resources, we should _probably_ focus on the Tier structure, even though they're reused across every division. Every tier is tied to a division, and contains ordered resources of champions.

## MVP Base Structure

Store Division for the future iterations that lets you create your own divisions

```ts
interface TierList {
  name: string;
  url: string;
  patchNumber: string;
  store: {
    divisions: Division["id"][];
    tiers: Tier["id"][];
  };
}

interface Division {
  id: number;
  name: string;
}

interface Tier {
  divisionId: Division["id"];
  id: number;
  name: string;
  championOrder: Champion["id"][];
}

interface Champion {
  id: number;
  metadata: {
    name: string;
    avatarUrl: string;
  };
}
```

## Post MVP

- Merge Divisions
- Patch Notes
- More League metadata in general
