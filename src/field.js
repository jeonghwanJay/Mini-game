"use strict";

import * as sound from "./audio.js";
const CARROT_SIZE = 80;

export const ItemType = Object.freeze({
  carrot: "carrot",
  bug: "bug",
});

export default class Field {
  constructor(carrotCnt, bugCnt) {
    this.carrotCnt = carrotCnt;
    this.bugCnt = bugCnt;
    this.field = document.querySelector(".game__field");
    this.fieldRect = this.field.getBoundingClientRect();
    this.field.addEventListener("click", (event) => {
      this.onClick(event);
    });
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  onClick(event) {
    const target = event.target;
    if (target.matches(".carrot")) {
      this.onItemClick && this.onItemClick(ItemType.carrot);
      target.remove();
      sound.playCarrot();
    } else if (target.matches(".bug")) {
      this.onItemClick && this.onItemClick(ItemType.bug);
    }
  }

  cannotClick() {
    this.field.style.pointerEvents = "none";
  }

  canClick() {
    this.field.style.pointerEvents = "auto";
  }

  init() {
    this.field.innerHTML = "";
    this._addItem(ItemType.carrot, this.carrotCnt, "img/carrot.png");
    this._addItem(ItemType.bug, this.bugCnt, "img/bug.png");
  }

  _addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldRect.width - CARROT_SIZE;
    const y2 = this.fieldRect.height - CARROT_SIZE;
    for (let i = 0; i < count; i++) {
      const item = document.createElement("img");

      item.setAttribute("class", className);
      item.setAttribute("src", imgPath);
      item.style.position = "absolute";
      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);
      item.style.cursor = "pointer";
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      this.field.appendChild(item);
    }
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
