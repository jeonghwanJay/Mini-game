"use strict";

import PopUp from "./popup.js";
import { GameBuilder, Reason } from "./game.js";
import * as sound from './audio.js';

const game = new GameBuilder()
  .withGameDuration(20)
  .withCarrotCnt(20)
  .withBugCnt(20)
  .build();

game.setGameStopListener((reason) => {
  let message;
  switch (reason) {
    case Reason.cancel:
      message = "REPLAY❓";
      sound.playAlert();
      break;
    case Reason.lose:
      message = "YOU LOST 💩";
      sound.playBug();
      break;
    case Reason.win:
      message = "YOU WON 🎉";
      sound.playWin();
      break;
    default:
      throw new Error("not valid reason");
  }
  gameFinishBanner.showWithText(message);
});

const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(() => {
  game.startGame();
});