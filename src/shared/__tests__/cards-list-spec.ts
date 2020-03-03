/* eslint-env jest */

import CardsList from "../cardsList";

import db from "../database";

describe("cards-list", () => {
  describe("as logged", () => {
    describe("constructor", () => {
      it("merges adjacent duplicates", () => {
        expect(new CardsList([66091, 66091, 66091]).getAsLogged()).toEqual([
          {
            id: 66091,
            quantity: 3
          }
        ]);
      });

      it("does not merge non-adjacent duplicates", () => {
        expect(new CardsList([66091, 66089, 66091]).getAsLogged()).toEqual([
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
            quantity: 1
          }
        ]);
      });

      it("does not merge by name", () => {
        // 66091 = Opt (Ixalan), 67224 = Opt (Dominaria)
        expect(db.card(66091)?.name).toEqual(db.card(67224)?.name);
        expect(new CardsList([66091, 67224]).getAsLogged()).toEqual([
          {
            id: 66091,
            quantity: 1
          },
          {
            id: 67224,
            quantity: 1
          }
        ]);
      });
    });

    describe("getAsLogged", () => {
      it("returns a copy", () => {
        let list = new CardsList([66091, 66089, 66091]);
        let asLogged = list.getAsLogged();
        asLogged[2].quantity = 5;
        asLogged.push({ id: 66089, quantity: 2 });
        expect(list.getAsLogged()).toEqual([
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
            quantity: 1
          }
        ]);
      });
    });

    describe("add", () => {
      it("merges adjacent duplicates", () => {
        let list = new CardsList();
        list.add(66091);
        list.add(66091, 2);
        expect(list.getAsLogged()).toEqual([
          {
            id: 66091,
            quantity: 3
          }
        ]);
      });

      it("does not merge non-adjacent duplicates", () => {
        let list = new CardsList();
        list.add(66091);
        list.add(66089);
        list.add(66091);
        list.add(66089, 2, true);
        expect(list.getAsLogged()).toEqual([
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
            quantity: 1
          },
          {
            id: 66089,
            quantity: 2
          }
        ]);
      });

      it("does not merge by name", () => {
        // 66091 = Opt (Ixalan), 67224 = Opt (Dominaria)
        expect(db.card(66091)?.name).toEqual(db.card(67224)?.name);
        let list = new CardsList();
        list.add(66091, 1, true);
        list.add(67224, 2, true);
        expect(list.getAsLogged()).toEqual([
          {
            id: 66091,
            quantity: 1
          },
          {
            id: 67224,
            quantity: 2
          }
        ]);
      });
    });

    describe("removeDuplicates", () => {
      it("does not affect as-logged list", () => {
        let list = new CardsList([66091, 66089, 66091]);
        list.removeDuplicates(true);
        expect(list.get()).toHaveLength(2);
        expect(list.getAsLogged()).toEqual([
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
            quantity: 1
          }
        ]);
      });
    });
  });
});
