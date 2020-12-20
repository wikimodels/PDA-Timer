export interface AdminPanelUser {
  _id: string;
  email: string;
  lastVisitDate?: string;
  lastVisitDisplayDate?: string;
  lastVisitDisplayTime?: string;
  numberOfSessions: number;
  toBeDeleted: boolean;
}

export interface AdminPanelUsersApi {
  adminPanelUsers: AdminPanelUser[];
  adminPanelUsersCount: number;
}
