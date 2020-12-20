import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'youtube'
})
export class YoutubePipe implements PipeTransform {

  constructor(private dom: DomSanitizer) {
  }

  transform(value: any): any {
    const dirtyUrl = 'https://www.youtube.com/embed/' + value + '?enablejsapi=1&autoplay=0&showinfo=1&controls=1';
    const cleanUrl = this.dom.bypassSecurityTrustResourceUrl(dirtyUrl);
    console.log('CLEAN URL: ', cleanUrl);
    return cleanUrl;
  }

}
