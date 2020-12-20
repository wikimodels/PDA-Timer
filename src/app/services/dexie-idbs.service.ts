import { Injectable } from '@angular/core';
import * as defaults from '../../assets/utils/defaults.json'
import Dexie from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class DexieDelSyncService extends Dexie {
  constructor() {
    super(defaults.IDBDelSyncName);
    this.version(1).stores({
      sessions: "sessionId",
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class DexiePostSyncService extends Dexie {
  constructor() {
    super(defaults.IDBPostSyncName);
    this.version(1).stores({
      sessions: "sessionId",
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class DexiePdaDbService extends Dexie {
  constructor() {
    super(defaults.IDBName);
    this.version(1).stores({
      sessions: "sessionId, email"

    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class DexieCurrentUserDbService extends Dexie {
  constructor() {
    super(defaults.IDBCurrentUserName);
    this.version(1).stores({
      user: "email",
    });
  }
}
