import Field, { ItemType } from "./field.js";
import * as sound from "./audio.js";

export const Reason = Object.freeze({
    cancel: "cancel",
    lose: "lose",
    win: "win",
})

// Game builder
export class GameBuilder {
  withGameDuration(time) {
    this.gameDuration = time;
    return this;
  }

  withCarrotCnt(num) {
    this.carrotCnt = num;
    return this;
  }

  withBugCnt(num) {
    this.bugCnt = num;
    return this;
  }

  build() {
    return new Game(
        this.gameDuration,
        this.carrotCnt,
        this.bugCnt
    );
  }
}

class Game {
    constructor(gameDuration, carrotCnt, bugCnt) {
        this.GAME_DURATION_SEC = gameDuration;
        this.CARROT_COUNT = carrotCnt;
        this.BUG_COUNT = bugCnt;
    this.gameBtn = document.querySelector(".game__button");
    this.timerIndicator = document.querySelector(".game__timer");
    this.gameScore = document.querySelector(".game__score");
    this.started = false;
    this.score = 0;
    this.timer = undefined;
    this.gameField = new Field(this.CARROT_COUNT, this.BUG_COUNT);
    this.gameField.setClickListener((e) => {
      this.onItemClick(e);
    });
    this.gameBtn.addEventListener("click", () => {
      if (this.started) {
        this.stopGame(Reason.cancel);
      } else {
        this.startGame();
      }
    });
  }

  onItemClick(item) {
    if (!this.started) {
      return;
    }
    if (item === ItemType.carrot) {
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.CARROT_COUNT) {
        this.stopGame(Reason.win);
      }
    } else if (item === ItemType.bug) {
      this.stopGame(Reason.lose);
    }
  }

  startGame() {
    this.started = true;
    this.gameField.canClick();
    this.initGame();
    this.showStopButton();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBg();
  }

  stopGame(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();
    this.gameField.cannotClick();
    sound.stopBg();
    this.onGameStop && this.onGameStop(reason);
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }
  showStopButton() {
    const icon = this.gameBtn.querySelector(".fas");
    icon.classList.add("fa-stop");
    icon.classList.remove("fa-play");
    this.gameBtn.style.visibility = "visible";
  }

  hideGameButton() {
    this.gameBtn.style.visibility = "hidden";
  }

  showTimerAndScore() {
    this.timerIndicator.style.visibility = "visible";
    this.gameScore.style.visibility = "visible";
  }

  startGameTimer() {
    let remainingTimeSec = this.GAME_DURATION_SEC;
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.stopGame(this.score === this.CARROT_COUNT ? Reason.win : Reason.lose);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.timerIndicator.innerHTML = `${minutes}:${seconds}`;
  }

  initGame() {
    this.score = 0;
    this.gameScore.innerText = this.CARROT_COUNT;
    // 벌레와 당근을 생성한뒤 field에 추가해줌
    this.gameField.init();
  }

  updateScoreBoard() {
    this.gameScore.innerText = this.CARROT_COUNT - this.score;
  }
}
