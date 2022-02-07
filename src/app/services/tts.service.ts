// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class TtsService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';
import {
  SpeechSynthesisUtteranceFactoryService,
  SpeechSynthesisService,
} from '@kamiazya/ngx-speech-synthesis';

@Injectable({
  providedIn: 'root',
})
export class TtsService {
  constructor(
    public f: SpeechSynthesisUtteranceFactoryService,
    public svc: SpeechSynthesisService
  ) {}

  speech(text: string) {
    this.svc.speak(this.f.text(text));
  }

  pause() {
    this.svc.pause();
  }

  resume() {
    this.svc.resume();
  }

  cancel() {
    this.svc.cancel();
  }
}
