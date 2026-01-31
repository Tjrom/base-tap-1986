# BASE TAP 1986 — Onchain Leaderboard

## Deploy to Base

1. Open [Remix](https://remix.ethereum.org), create `Leaderboard.sol` with the contract code.
2. Compile (Solidity 0.8.20).
3. Connect MetaMask/Rabby to **Base Mainnet** (chainId 8453).
4. Deploy (no constructor args).
5. Copy the deployed contract address.
6. In your app: set env `NEXT_PUBLIC_LEADERBOARD_CONTRACT=<address>` (e.g. in Vercel).

## Contract

- `submitScore(uint256 score)` — stores score only if it's higher than your current best.
- `bestScore(address)` — returns best score for an address.
- Event `ScoreSubmitted(address player, uint256 score)` — used to build the leaderboard.
