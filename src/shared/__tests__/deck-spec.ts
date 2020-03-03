/* eslint-env jest */

import Deck from "../deck";

describe("deck", () => {
  describe("constructor", () => {
    it("passes lists as is to CardsList", () => {
      let decks = [
        new Deck(
          {},
          [66091, 66089, 66091, 66091, 67224],
          [66091, 66089, 67224, 66091, 66091]
        ),
        new Deck({
          mainDeck: [
            {
              id: 66091,
              quantity: 1
            },
            {
              id: 66089,
              quantity: 1
            },
            {
              id: 66091,
              quantity: 2
            },
            {
              id: 67224,
              quantity: 1
            }
          ],
          sideboard: [
            {
              id: 66091,
              quantity: 1
            },
            {
              id: 66089,
              quantity: 1
            },
            {
              id: 67224,
              quantity: 1
            },
            {
              id: 66091,
              quantity: 2
            }
          ]
        }),
        new Deck(
          {},
          [66091, 66089, 67224, 66091, 66091],
          [66091, 66089, 66091, 66091, 67224],
          [66091, 66089, 66091, 66091, 67224],
          [66091, 66089, 67224, 66091, 66091]
        )
      ];
      decks.forEach(deck => {
        expect(deck.getMainboard().getAsLogged()).toEqual([
          {
            id: 66091,
            quantity: 1
          },
          {
            id: 66089,
            quantity: 1
          },
          {
            id: 66091,
            quantity: 2
          },
          {
            id: 67224,
            quantity: 1
          }
        ]);
        expect(deck.getSideboard().getAsLogged()).toEqual([
          {
            id: 66091,
            quantity: 1
          },
          {
            id: 66089,
            quantity: 1
          },
          {
            id: 67224,
            quantity: 1
          },
          {
            id: 66091,
            quantity: 2
          }
        ]);
      });
    });
  });

  describe("clone", () => {
    it("preserves original logged order", () => {
      let clone = new Deck(
        {},
        [66091, 66089, 67224, 66091, 66091],
        [66091, 66089, 66091, 66091, 67224],
        [66091, 66089, 66091, 66091, 67224],
        [66091, 66089, 67224, 66091, 66091]
      ).clone();
      expect(clone.getMainboard().getAsLogged()).toEqual([
        {
          id: 66091,
          quantity: 1
        },
        {
          id: 66089,
          quantity: 1
        },
        {
          id: 66091,
          quantity: 2
        },
        {
          id: 67224,
          quantity: 1
        }
      ]);
      expect(clone.getSideboard().getAsLogged()).toEqual([
        {
          id: 66091,
          quantity: 1
        },
        {
          id: 66089,
          quantity: 1
        },
        {
          id: 67224,
          quantity: 1
        },
        {
          id: 66091,
          quantity: 2
        }
      ]);
    });
  });

  describe("getSave", () => {
    it("includes logged order when requested", () => {
      let deck = new Deck(
        {},
        [66091, 66089, 66091, 66091, 67224],
        [66091, 66089, 67224, 66091, 66091]
      );
      let save = deck.getSave(true);
      expect(save).toHaveProperty("arenaMain", [
        {
          id: 66091,
          quantity: 1
        },
        {
          id: 66089,
          quantity: 1
        },
        {
          id: 66091,
          quantity: 2
        },
        {
          id: 67224,
          quantity: 1
        }
      ]);
      expect(save).toHaveProperty("arenaSide", [
        {
          id: 66091,
          quantity: 1
        },
        {
          id: 66089,
          quantity: 1
        },
        {
          id: 67224,
          quantity: 1
        },
        {
          id: 66091,
          quantity: 2
        }
      ]);
    });
  });
});
