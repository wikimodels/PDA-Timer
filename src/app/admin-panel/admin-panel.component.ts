import { Component, OnInit } from '@angular/core';
import { AdminPanelService } from '../services/admin-panel.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  constructor(private adminPanelService: AdminPanelService) {}

  ngOnInit(): void {
    this.adminPanelService.getAllAdminPanelUsers();
  }
}
