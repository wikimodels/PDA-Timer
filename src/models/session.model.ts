export interface Session {
  _id?: string;
  sessionId?: string;
  date: number;
  email?: string,
  displayName?: string,
  displayDate?: string;
  displayTime?: string;
  inhaleTime: number;
  pdaTime: number;
  abbsTime: number;
  waterVol: number;
  sessionDuration: number;
  postsync?: boolean,
  sendsync?: boolean
}

export interface SessionApi {
  sessions: Session[];
  total_count: number;
}
