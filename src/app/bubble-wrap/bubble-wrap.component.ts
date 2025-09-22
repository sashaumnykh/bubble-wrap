import { Component, ElementRef, ViewChild } from '@angular/core';
import { BubbleObj } from '../models/bubbleObj copy';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-bubble-wrap',
  standalone: false,
  templateUrl: './bubble-wrap.component.html',
  styleUrls: ['./bubble-wrap.component.scss'],
  providers: []
})

export class BubbleWrapComponent {

  listBubbles: BubbleObj[] = [];
  numberOfBubbles: number = 0;
  areAllPopped: boolean = false;
  killerBubblePressed: boolean = false;

  bubbleSize: number = 60;

  gap: number = 4;
  rows: number | undefined = 0;
  columns: number | undefined = 0;

  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  constructor(
  ) {
    this.listBubbles = new Array(this.numberOfBubbles).fill(null).map(() => new BubbleObj());
  }

  ngAfterViewInit() {
    if (environment.mode === 'bot') {
      this.rows = environment.rows;
      this.columns = environment.cols;

      this.fillBubbles();
    } else {
      this.calcRowsAndCols();

      window.addEventListener('resize', () => {
        this.calcRowsAndCols();
      });
    }
  }

  calcRowsAndCols() {
    const totalBubbleSize = this.bubbleSize + this.gap;

    const containerEl = this.containerRef.nativeElement;
    const { width, height } = containerEl.getBoundingClientRect();

    debugger;
    const safeOffset = 8;
    const availableHeight = height - safeOffset;
    this.columns = Math.floor(width / totalBubbleSize);
    this.rows = Math.floor(availableHeight / totalBubbleSize);

    this.fillBubbles();
  }

  fillBubbles() {
    this.numberOfBubbles = (this.columns && this.rows) ? (this.columns * this.rows) : 0;

    this.listBubbles = new Array(this.numberOfBubbles).fill(null).map(() => new BubbleObj());
    let killerIndex = Math.floor(Math.random() * this.numberOfBubbles);
    this.listBubbles[killerIndex].isKiller = true;
  }

  pop(bubble: BubbleObj) {
    if (bubble.isKiller) {
      this.killerBubblePressed = true;
      this.listBubbles.forEach(b => b.isPopped = true);

      setTimeout(() => {
        this.areAllPopped = true;
      }, 500);
      return;
    }
    
    let audio = new Audio();
    audio.src =  "assets/bubble-wrap-1.mp3";
    audio.load();
    audio.play();
    bubble.isPopped = true;
    this.areAllPopped = this.listBubbles.filter(b => !b.isKiller).every(b => b.isPopped);

    /*
    if (this.areAllPopped) {
      this.listBubbles = new Array(this.numberOfBubbles).fill(null).map(() => new BubbleObj());
    }*/
  }
  
  playAgain() {
    this.listBubbles = new Array(this.numberOfBubbles).fill(null).map(() => new BubbleObj());
    let killerIndex = Math.floor(Math.random() * this.numberOfBubbles);
    this.listBubbles[killerIndex].isKiller = true;
    this.killerBubblePressed = false;
    this.areAllPopped = false;
  }
}