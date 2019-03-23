"use strict";
/*
globals
  cardsDb,
  makeId,
  get_card_type_sort,
  addCardSeparator,
  addCardTile,
  compare_cards,
  getWildcardsMissing
*/
const CardsList = require("./cards-list.js");
const Colors = require("./colors.js");

class Deck {
  constructor(mtgaDeck) {
    this.mainboard = new CardsList(mtgaDeck.mainDeck.sort(compare_cards));
    this.sideboard = new CardsList(mtgaDeck.sideboard.sort(compare_cards));
    this.name = mtgaDeck.name || "";
    this.id = mtgaDeck.id || "";
    this.lastUpdated = mtgaDeck.lastUpdated || "";
    this.tile = mtgaDeck.deckTileId || 67003;
    this._colors = undefined;
    this.tags = mtgaDeck.tags || [mtgaDeck.format];
    this.custom = mtgaDeck.custom || false;

    return this;
  }

  get colors() {
    return this._colors || this.getColors();
  }

  sortMainboard(func) {
    this.mainboard.get().sort(func);
  }

  sortSideboard(func) {
    this.sideboard.get().sort(func);
  }

  /**
   * returns a color object based on the colors of the cards within
   * the mainboard or, if specified, the sideboard.
   * By default it only return the mainboard.
   **/
  getColors(countMainboard = true, countSideboard = false) {
    this._colors = new Colors();

    if (countMainboard) {
      let mainboardColors = this.mainboard.getColors();
      this._colors.addFromColor(mainboardColors);
    }

    if (countSideboard) {
      let sideboardColors = this.sideboard.getColors();
      this._colors.addFromColor(sideboardColors);
    }

    return this._colors;
  }

  /**
   *
   **/
  getMissingWildcards(countMainboard = true, countSideboard = true) {
    let missing = {
      rare: 0,
      common: 0,
      uncommon: 0,
      mythic: 0,
      token: 0,
      land: 0
    };

    if (countMainboard) {
      this.mainboard.get().forEach(card => {
        var grpid = card.id;
        var quantity = card.quantity;
        var rarity = cardsDb.get(grpid).rarity;

        let add = getWildcardsMissing(grpid, quantity);

        missing[rarity] += add;
      });
    }

    if (countSideboard) {
      this.sideboard.get().forEach(card => {
        var grpid = card.id;
        var quantity = card.quantity;
        var rarity = cardsDb.get(grpid).rarity;

        let add = getWildcardsMissing(grpid, quantity);

        missing[rarity] += add;
      });
    }

    return missing;
  }

  /**
   * Draws this deck on the specified DOM object
   **/
  draw(div) {
    var unique = makeId(4);
    div.html("");
    var prevIndex = 0;

    let mainBoard = this.mainboard;
    mainBoard.get().forEach(function(card) {
      let grpId = card.id;
      let type = cardsDb.get(grpId).type;
      let cardTypeSort = get_card_type_sort(type);
      if (prevIndex == 0) {
        let q = mainBoard.countType(type);
        addCardSeparator(cardTypeSort, div, q);
      } else if (prevIndex != 0) {
        if (cardTypeSort != get_card_type_sort(cardsDb.get(prevIndex).type)) {
          let q = mainBoard.countType(type);
          addCardSeparator(cardTypeSort, div, q);
        }
      }

      if (card.quantity > 0) {
        addCardTile(grpId, unique + "a", card.quantity, div);
      }

      prevIndex = grpId;
    });

    let sideBoard = this.sideboard;
    if (sideBoard._list.length > 0) {
      addCardSeparator(99, div, sideBoard.count());
      prevIndex = 0;
      sideBoard.get().forEach(card => {
        var grpId = card.id;
        if (card.quantity > 0) {
          addCardTile(grpId, unique + "b", card.quantity, div);
        }
      });
    }
  }
}

module.exports = Deck;
