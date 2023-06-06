# Maulwurf

## A simple CLI tool to tunnel into a database via Teleport.

If you are using [Teleport](https://teleport.sh/), you may find the process of creating a database tunnel somewhat tedious.

Maulwurf is a simple CLI tool that will list available databases, login in and create a tunnel for the selected database.

### Installation

```sh
$ npm install --global @mcombuec/maulwurf
```

### Usage

```sh
$ maulwurf [--port|-p <PORT_NUMBER>] [DB_NAME] [...<SEARCH_TERM>]
```
