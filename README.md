# idb-polyfill

> The ultimate IndexedDB polyfill

## Usage

```js
import idbPolyfill from 'idb-polyfill'

// try to rewrite native and set p* namespace
idbPolyfill.polyfill()

// or use native implementation for some browsers
idbPolyfill.polyfillExcept(['Chrome', 'Opera'])

const indexedDB = global.pIndexedDB || global.indexedDB
const IDBKeyRange = global.pIDBKeyRange || global.IDBKeyRange

// or use polyfill explicitly and set your own globals
import { indexedDB, IDBKeyRange } from 'idb-polyfill'
```

## License

Apache 2.0
