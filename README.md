# Steroids for React

Find documentation [here](docs/index.md)

## Use package from source in project

1. Copy `tsconfig-debug.json.sample` to `tsconfig-debug.json`
2. Replace `outDir` path to node_modules nest path in project
3. Run from this directory `nps watch` or 'yarn script watch'

## All scripts available
```
yarn script
```

## To publish to NPM manually use the command (_nps_ **is not a typo!**):
```
nps publish.manual

#OR

yarn script publish.manual
```
**You should be authorized in NPM first!** For this purpose use:
```
npm login
```
