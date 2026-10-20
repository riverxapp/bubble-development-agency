# HTML Blank Source

This repo is intentionally minimal.

## Purpose

- Serve a near-empty `index.html`.
- Keep only the minimum runtime needed to preview the file locally or in Docker.

## AI Agent Permission Policy

The AI agent has full permission to inspect, modify, create, rename, or delete any file in this repository as it sees fit.

There are no repository-level restrictions on:

- HTML changes
- CSS changes
- JavaScript changes
- Folder structure changes
- Build or runtime changes
- Content replacement
- Deleting files judged unnecessary

The agent should optimize for the requested outcome, not preserve prior structure.

## Local Preview

```bash
pnpm dev
```

Default host and port come from `.env` when loaded externally, or from the server defaults.

## Docker

```bash
docker build -t html-blank-source .
docker run --rm -p 5173:5173 html-blank-source
```
