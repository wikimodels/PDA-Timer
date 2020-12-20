import { NgxIndexedDBService, ObjectStoreMeta, DBConfig } from 'ngx-indexed-db';
import * as defaults from './../utils/defaults.json'
// export interface ObjectStoreMeta {
//   store: string;
//   storeConfig: {
//       keyPath: string | string[];
//       autoIncrement: boolean;
//       [key: string]: any;
//   };
//   storeSchema: ObjectStoreSchema[];
// }
// export interface ObjectStoreSchema {
//   name: string;
//   keypath: string | string[];
//   options: {
//       unique: boolean;
//       [key: string]: any;
//   };
// }
export const dbConfig: DBConfig = {
  name: defaults.IDBName,
  version: 1,
  objectStoresMeta: [{
    store: defaults.IDBObjectStore,
    storeConfig: { keyPath: 'sessionId', autoIncrement: false },
    storeSchema: [
    ]
  }],
  migrationFactory
};

// export const dbConfigDel: DBConfig = {
//   name: 'pdaDel',
//   version: 1,
//   objectStoresMeta: [{
//     store: defaults.IDBObjectStore,
//     storeConfig: { keyPath: 'sessionId', autoIncrement: false },
//     storeSchema: [
//     ]
//   }],
//   migrationFactory
// };


export function migrationFactory() {
  // The animal table was added with version 2 but none of the existing tables or data needed
  // to be modified so a migrator for that version is not included.
  return {
    1: (db, transaction) => {
      //const store = transaction.objectStore(defaults.IDBObjectStore);
      //store.createIndex('sessionId', 'sessionId', { unique: true });
    }
  };
}


//export { dbConfig }
