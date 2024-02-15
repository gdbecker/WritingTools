import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
  
export class TimerComponent implements OnInit {
  ready = false;
  workMin: any = '';
  shortBreakMin: any = '';
  longBreakMin: any = '';
  reps = 0;
  timer = null;
  timerLabel = "Pomodoro Timer";
  timerText = "00:00";
  checkMarks = "";
  leftBtnLabel = "Start";

  @ViewChild('timerForm') form: any;
  
  ngOnInit() {
    
  }

  onSubmit({ value, valid }: { value: any; valid: boolean }) {
    if (!valid) {
      // show error
      alert("Please fill out all fields correctly");
    } else {
      this.workMin = parseInt(value.workmin);
      this.shortBreakMin = parseInt(value.shortbreakmin);
      this.longBreakMin = parseInt(value.longbreakmin);

      this.ready = true;
    }
  }

  resetTimer() {
    this.reps = 0;
    this.checkMarks = "";
    this.timerLabel = "Pomodoro Timer";
    this.timerText = "00:00";
    this.leftBtnLabel = "Start";
    clearTimeout(this.timer);
  }

  startTimer() {
    this.reps += 1;
    clearTimeout(this.timer);

    this.leftBtnLabel = "Skip to Next";

    const workSec = this.workMin * 60;
    const shortBreakSec = this.shortBreakMin * 60;
    const longBreakSec = this.longBreakMin * 60;

    // if it's the 1st/3rd/5th/7th rep:
    if (this.reps % 8 === 0) {
      this.timerLabel = "Long Break";
      this.countDown(longBreakSec);
    } else if (this.reps % 2 === 0) {
      this.timerLabel = "Short Break";
      this.countDown(shortBreakSec);
    } else {
      this.timerLabel = "Work";
      this.countDown(workSec);
      const numMarks = Math.floor(this.reps / 2);
      const marksArray = [];

      for (let i = 0; i < numMarks; i++) {
        marksArray.push("✔");
      }

      this.checkMarks = marksArray.join("");
    }
  }

  countDown(count) {
    let countMin: any = Math.floor(count / 60); 
    let countSec: any = count % 60;

    if (countSec < 10) {
      countSec = `0${countSec}`;
    }

    this.timerText = `${countMin}:${countSec}`;

    if (count > 0) {
      this.timer = setTimeout(() => {
        this.countDown(count - 1);
      }, 1000);
    } else {
      this.startTimer();
    }
  }
}
