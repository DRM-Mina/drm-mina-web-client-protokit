# DRM Mina Game Marketplace UI

DRM Mina is a game marketplace on top of Mina to verify game ownerships with zk-proofs.

## Quick start

This repo contains 1 package and 1 app:

- `packages/chain` contains app-chain related parts, will be removed in future
- `apps/web` contains the UI that connects to you hosted app-chain sequencer

**Prerequisites:**

- Node.js v18
- pnpm
- nvm

### Setup and Running

```zsh
nvm use
pnpm install
pnpm dev --filter=web
```
Navigate to `localhost:3000` to see access UI
