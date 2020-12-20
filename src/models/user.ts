import { EmailValidator } from "@angular/forms";
import { Session } from "./session.model";

export interface User {
  email: string;
  sessions?: Session[];
  sessions_count?: number;
}

export interface CurrentUser {
  email: string;
}
