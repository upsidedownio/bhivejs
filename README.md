# PRE-Released
This project is currently very unstable.
even master branch's history may change

# [B]()Hive
Javascript implementation of BehaviorTree

# How to Use

## Installation
```bash
npm install bhivejs --save
```

## Usage -  conventional method
```javascript
const {AsyncTask, Sequence, Priority, Repeater} = require('bhivejs');

const SearchEnemy = new AsyncTask({
    title: 'SearchEnemy',
    run: async function(){
        // Searching Enemy
    }
})

const SearchEnemy = new AsyncTask({
    title: 'SearchEnemy',
    run: async function(){
        // Searching Enemy
    }
})

```

## Usage -  definitional method
TBD

# Build Document
You can build an API document and read it locally.
```bash
npm install
npm run doc
```

# Specs
TBD

# License
MIT License,  
See `LICENSE` file for details
