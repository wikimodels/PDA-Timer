import { Component, OnInit } from '@angular/core';
import { UserActions } from 'src/models/users-actions';
import { ChartControls } from 'src/models/chart-controls';
import { ChartControlService } from '../services/chart-controls.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent  implements OnInit {
  constructor(private chartConstorlsService: ChartControlService){}
  chartControls: ChartControls;

  ngOnInit(){
    this.chartConstorlsService.chartControls$.subscribe(chartControls =>{
      this.chartControls = chartControls;
      //console.log(this.chartControls)
    })
  }

  passAction(action: UserActions){
    this.chartConstorlsService.setUserAction(action)
  }
  // passChartUserAtion(action: UserActions){
  //   this.chartConstorlsService.setUserAction(action)
  // }
}
