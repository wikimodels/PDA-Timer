import { BreakpointObserver } from '@angular/cdk/layout/breakpoints-observer';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { DynamicScriptLoaderService } from '../services/dynamic-script-loader.service';
import { LoadingService } from '../services/loading.service';
import {
  BOOK_1, BOOK_2
} from '../consts/urls.consts';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterViewInit {
  loading$ = this.loadingService.loading$;
  constructor(
    private loadingService: LoadingService,

  ) { }

  videoId = '1Ww7XzAW6gI';
  iframeHeight = 0;
  iframeWidth = 0;
  widowResize$ = fromEvent(window, 'resize');
  windowResizeSub: Subscription
  book_1 = BOOK_1();
  book_2 = BOOK_2();

  ngOnInit(): void {
    this.windowResizeSub = this.widowResize$.subscribe((v) => {
      console.log('resize', v)

      var iframe = document.getElementsByTagName('iframe')[0];
      if (iframe) {
        iframe.width = window.innerWidth * 0.9 + 'px';
        iframe.height = window.innerWidth * 0.9 * 0.5624 + 'px';
      }
      console.log('iframe', iframe[0])
    })
    this.loadingService.loadingOn();
  }

  ngAfterViewInit() {
    this.addIframe();
  }

  addIframe() {
    var target = document.getElementById("video");
    target.style.display = 'none';
    var loader = document.getElementById("loader");
    var newFrame = document.createElement('iframe');

    newFrame.onload = () => {
      this.loadingService.loadingOff();
      console.log('LOADED');
      target.style.display = 'block';
    };
    newFrame.setAttribute(
      'src',
      'https://www.youtube.com/embed/' + this.videoId
    );

    console.log('window height', window.innerWidth * 0.9 * 0.5625)
    console.log('window width', window.innerWidth * 0.9)
    newFrame.setAttribute('frameborder', '0');
    if (window.innerWidth < 420) {
      newFrame.width = window.innerWidth * 0.9 + 'px';
      newFrame.height = window.innerWidth * 0.9 * 0.5625 + 'px';
    } else {
      newFrame.width = window.innerWidth * 0.6 + 'px';
      newFrame.height = window.innerWidth * 0.6 * 0.5625 + 'px';
    }
    target.appendChild(newFrame);
  }

}
