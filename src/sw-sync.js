//import { DELELTE_SESSION_BY_ID } from "./app/consts/urls.consts";
//import { ADD_SESSIONS } from "./app/consts/urls.consts";

(function () {
  self.addEventListener("install", (event) => {
    console.log("Установленa версия 14");
  });

  self.addEventListener("activate", (event) => {
    console.log("Активирована версия 14");
  });

  self.addEventListener("fetch", (event) => {
    console.log("Происходит запрос на сервер");
  });

  self.addEventListener("sync", (event) => {
    if (event.tag === "sync-data") {
      console.log("sync started...");
      event.waitUntil(getAndPostSessions());
      event.waitUntil(clearPostSyncDb());
    }
  });

  function getAndPostSessions() {
    var db = new Dexie("pdadbpostsync");
    db.version(1).stores({
      sessions: "sessionId",
    });

    db.sessions.toArray().then((sessions) => {
      if (sessions.length > 0) {
        console.log("SW posts sessions", sessions);
        fetch(ADD_SESSIONS(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sessions),
        })
          .then(() => {
            console.log("start deleting...");
            getAndDeleteSessions();
            clearDelSyncDb();
            return Promise.resolve();
          })
          .catch((error) => {
            console.log("sync-post error", error);
            return Promise.reject();
          });
      } else {
        getAndDeleteSessions();
        clearDelSyncDb();
      }
    });
  }

  function clearPostSyncDb() {
    var db = new Dexie("pdadbpostsync");
    db.version(1).stores({
      sessions: "sessionId",
    });
    db.sessions.clear();
  }

  function getAndDeleteSessions() {
    var db = new Dexie("pdadbdelsync");
    db.version(1).stores({
      sessions: "sessionId",
    });

    db.sessions.toArray().then((sessions) => {
      const sessionsIds = sessions.reduce((acc, curr) => {
        acc.push(curr.sessionId);
        return acc;
      }, []);
      console.log("sessions to del", sessions);

      if (sessionsIds.length > 0) {
        const sessionsToDelete = {
          email: sessions[0].email,
          sessionsIds: sessionsIds,
        };
        fetch(DELELTE_SESSIONS_BY_IDS(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sessionsToDelete),
        })
          .then(() => Promise.resolve())
          .catch(() => {
            console.log("sync-delete error", error);
            return Promise.reject();
          });
      }
    });
  }

  function clearDelSyncDb() {
    var db = new Dexie("pdadbdelsync");
    db.version(1).stores({
      sessions: "sessionId",
    });
    db.sessions.clear();
  }
})();
