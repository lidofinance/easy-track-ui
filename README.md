# Lido EasyTrack UI

A UI app for interacting with Lido's [Easy Track](https://github.com/lidofinance/easy-track) governance feature.

Learn more about [Easy Track](https://github.com/lidofinance/lido-improvement-proposals/blob/develop/LIPS/lip-3.md).

## Pre-requisites

- Node.js v12+
- Yarn package manager

This project requires an .env file which is distributed via private communication channels. A sample can be found in .env.sample.

## Development

Step 1. Copy the contents of `.env.sample` to `.env.local`

```bash
cp .env.sample .env.local
```

Step 2. Fill out the `.env.local`. You will need to provide RPC provider urls with keys included.

Step 3. Install dependencies

```bash
yarn install
```

Step 4. Start the development server

```bash
yarn dev
```

## Environment variables

Note! Avoid using `NEXT_PUBLIC_` environment variables as it hinders our CI pipeline. Please use server-side environment variables and pass them to the client using `getInitialProps` in `_app.js`.

## Automatic versioning

Note! This repo uses automatic versioning, please follow the [commit message conventions](https://www.conventionalcommits.org/en/v1.0.0/).

e.g.

```
git commit -m "fix: a bug in calculation"
git commit -m "feat: dark theme"
```

## Production

```bash
yarn build && yarn start
```

## Notable dependencies

- [Next.js](https://nextjs.org/docs)
- [Typescript](https://www.typescriptlang.org/)
- [Styled Components](https://styled-components.com/)
- [Lido UI](https://github.com/lidofinance/ui)
- [SWR](https://swr.vercel.app)
- [TypeChain](https://github.com/ethereum-ts/Typechain#readme)
- [Web3 React](https://github.com/NoahZinsmeister/web3-react#readme)
- [The Ethers Project](https://github.com/ethers-io/ethers.js/)
- [EVM Script Decoder](https://github.com/lidofinance/evm-script-decoder)

## Release flow

To create a new release:

1. Merge all changes to the `main` branch.
1. After the merge, the `Prepare release draft` action will run automatically. When the action is complete, a release draft is created.
1. When you need to release, go to Repo → Releases.
1. Publish the desired release draft manually by clicking the edit button - this release is now the `Latest Published`.
1. After publication, the action to create a release bump will be triggered automatically.
