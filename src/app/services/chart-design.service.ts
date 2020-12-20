import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Line } from 'src/models/line.js';
import { getSimpleFigures } from '../../assets/scripts/simple-figures.js';
import { getComplexFigures } from '../../assets/scripts/complex-figures.js';
import {
  setSvg,
  setCanvas,
  calculateDistanceBtwLines,
  calculateLinesCoordinates,
  calculateLablesCoordinates,
} from '../../assets/scripts/chart-draw.js';
import { ChartControlService } from './chart-controls.service.js';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Figure } from 'src/models/figure.js';
import * as defaults from '../../assets/utils/defaults.json'
import { ChartAnimationService } from './chart-animation.service.js';

@Injectable({
  providedIn: 'any',
})
export class ChartDesignService {
  constructor(
    private chartControlsService: ChartControlService,
    private chartAnimationService: ChartAnimationService,
    public breakpointObserver: BreakpointObserver,
    ){}
    startMarginX = 30;
    svg = setSvg(this.breakpointObserver.isMatched('(max-width: 400px)'))
    canvas = setCanvas(this.svg);
    complexExhaleValue = defaults.exhaleComplexDefault;

  // CURRENT PDA VALUE
  private _currentPdaValueSubj = new BehaviorSubject(defaults.pdaSimpleDefault);
  currentPdaValueSubj$ = this._currentPdaValueSubj.asObservable();

  getCurrentPdaValue() {
    return this._currentPdaValueSubj.getValue();
  }

  setCurrentPdaValue(value) {
    this._currentPdaValueSubj.next(value);
  }

  // CURRENT INHALE VALUE
  private _currentInhaleValueSubj = new BehaviorSubject(defaults.inhaleDefault);
  currentInhaleValueSubj$ = this._currentInhaleValueSubj.asObservable();

  getCurrentInhaleValue() {
    return this._currentInhaleValueSubj.getValue();
  }

  setCurrentInhaleValue(value) {
    this._currentInhaleValueSubj.next(value);
  }

  // CURRENT ABBS VALUE
  private _currentAbbsValueSubj = new BehaviorSubject(defaults.abbsDefault);
  abbsValueSubj$ = this._currentAbbsValueSubj.asObservable();

  getCurrentAbbsValue() {
    return this._currentAbbsValueSubj.getValue();
  }

  setCurrentAbbsValue(value) {
    this._currentAbbsValueSubj.next(value);
  }

  // IS CURRNET COMPLEX CHART
  setIsCurrentComplexChart(isComplexChart){
    this.chartControlsService.setIsComplexChartValue(isComplexChart);
  }

  getIsCurrentComplexChart(){
    return this.chartControlsService.getIsComplexChartValue();
  }

  // CURRENT CONTROLS VALUES
  setCurrentContorlsValues(pdaValue, inhaleValue, abbsValue, isComplexChart){
    this.setCurrentPdaValue(pdaValue);
    this.setCurrentInhaleValue(inhaleValue);
    this.setCurrentAbbsValue(abbsValue);
    this.setIsCurrentComplexChart(isComplexChart)
  }

  // LINES COORDINATES

  private _linesCoordinatesSubj = new BehaviorSubject<Line[]>([])
  linesCoordinatesSubj$ = this._linesCoordinatesSubj.asObservable();

  setLinesCoordinates(lines: Line[]) {
    this._linesCoordinatesSubj.next(lines)
  }

  getLinesCoordinates(){
    return this._linesCoordinatesSubj.getValue();
  }

  calculateCoordinatesOfLines() {
    const isComplexChart = this.getIsCurrentComplexChart();

    const numberOfLines = isComplexChart === true ? defaults.exhaleComplexDefault : this.getCurrentExhaleValue();

    let coordinates = calculateLinesCoordinates(
      this.canvas.width,
      this.canvas.height,
      numberOfLines
    )
    this.setLinesCoordinates(coordinates);
  };

  // LABELS COORDINATES
  private _labesCoordinatesSubj = new BehaviorSubject<Line[]>([])
  labesCoordinatesSubj$ = this._labesCoordinatesSubj.asObservable();

  setLablesCoordinates(labes: Line[]){
    this._labesCoordinatesSubj.next(labes)
  }

  getLablesCoordinates(){
    return this._labesCoordinatesSubj.getValue()
  }

  calculateCoordinatesOfLables() {
    let coordinates =  calculateLablesCoordinates(
      this.canvas.height,
      this.getCurrentExhaleValue()
    )
    this.setLablesCoordinates(coordinates);
  };

  // CREATE CHART
  createChart() {
    this.calculateDistanceBtwLines();
    this.calculateCoordinatesOfLines();
    this.calculateCoordinatesOfLables();
  }

  // DISTANCE BTW LINES
  private _distanceBtwLinesSubj = new BehaviorSubject(0);
  distanceBtwLinesSubj$ = this._distanceBtwLinesSubj.asObservable();

  getDistanceBtwLines() {
    return this._distanceBtwLinesSubj.getValue();
  }

  setDistanceBtwLines(distance){
    this._distanceBtwLinesSubj.next(distance)
  }

  calculateDistanceBtwLines() {
    let distance = calculateDistanceBtwLines(
      this.canvas.height,
      this.getCurrentExhaleValue()
    );
    this._distanceBtwLinesSubj.next(distance);
  }

  // GET EXHALE VALUE
  private getCurrentExhaleValue() {
    const pda = this.getCurrentPdaValue();
    const inhale = this.getCurrentInhaleValue();
    const abbs = this.getCurrentAbbsValue();
    const isComplexChart = this.getIsCurrentComplexChart();
    // EXHALE VALUE FOR COMPLEX or SIMPLE CHART
    const exhale = isComplexChart === true ? this.complexExhaleValue :
    Math.round(pda - inhale - abbs);
    return exhale;
  }

  private _figuresSubj = new BehaviorSubject<Figure[]>([]);

  figuresSubj$ = this._figuresSubj.asObservable();

  setFigures(figures: Figure[]){
    this.chartAnimationService.setFigures(figures)
    this._figuresSubj.next(figures)
  }

  getFigures(){
    return this._figuresSubj.getValue()
  }

  drawFigures(){
    const figures = this.calculateFigures();
    this.setFigures(figures);
  }

  calculateFigures(){
    const pdaTime = this.getCurrentPdaValue();
    const inhaleTime  = this.getCurrentInhaleValue();
    const exhaleTime = this.getCurrentExhaleValue();
    const abbsTime = this.getCurrentAbbsValue();
    const distance = this.getDistanceBtwLines();
    const canvasWidth = this.canvas.width;
    const isComplexChart = this.getIsCurrentComplexChart();

    const figures =
    isComplexChart === true ?
    getComplexFigures(
      pdaTime,
      inhaleTime,
      abbsTime,
      distance,
      canvasWidth,
      this.startMarginX
    )
    :
    getSimpleFigures(
      inhaleTime,
      exhaleTime,
      abbsTime,
      distance,
      canvasWidth,
      this.startMarginX
      );
    return figures;
  }

}

