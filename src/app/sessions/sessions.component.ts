import { Component, OnInit } from '@angular/core';
import { SessionsStore } from '../services/sessions-store.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css'],
})
export class SessionsComponent implements OnInit {
  email = '';
  constructor(public sessionStore: SessionsStore) {}
  ngOnInit(): void {}
}
