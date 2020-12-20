import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Session } from 'src/models/session.model';
import { DexieDelSyncService, DexiePostSyncService, DexiePdaDbService, DexieCurrentUserDbService } from './dexie-idbs.service';

export interface User {
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class DexieDbOpsService {
  postSyncTable: Dexie.Table<Session>;
  delSyncTable: Dexie.Table<Session>;
  pdaTable: Dexie.Table<Session>;
  currentUserTable: Dexie.Table<User>;

  constructor(
    private dexiePostSyncService: DexiePostSyncService,
    private dexieDelSyncService: DexieDelSyncService,
    private dexieSessionsService: DexiePdaDbService,
    private dexieCurrentUserService: DexieCurrentUserDbService
  ) {
    this.postSyncTable = this.dexiePostSyncService.table('sessions');
    this.delSyncTable = this.dexieDelSyncService.table('sessions');
    this.pdaTable = this.dexieSessionsService.table('sessions');
    this.currentUserTable = this.dexieCurrentUserService.table('user');
  }

  async addSessionToPostSync(session: Session) {
    return await this.postSyncTable.add(session)
  }

  async addSessionToDelSync(session: Session) {
    return await this.delSyncTable.add(session)
  }

  async addSessionToPdaDb(session: Session) {
    return await this.pdaTable.add(session);
  }

  async addSessionsToPdaDb(sessions: Session[]) {
    return await this.pdaTable.bulkAdd(sessions);
  }

  async getAllSessionsFromPdaDb(email) {
    return await this.pdaTable.where({ email: email }).toArray();
  }

  async deleteSessionFromPdaDb(sessionId) {
    return await this.pdaTable.delete(sessionId);
  }

  async clearPdaDb() {
    return await this.pdaTable.clear();
  }

  async addCurrentUserToUserDb(user: User) {
    return await this.currentUserTable.add(user);
  }

  async getCurrentUserFromUserDb() {
    const users = await this.currentUserTable.toArray();
    return users[0];
  }

  async clearCurrentUserDb() {
    return await this.currentUserTable.clear();
  }

}
