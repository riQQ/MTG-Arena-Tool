/* eslint-env jest */

import getSetCodeInEventId from "../getSetInEventId";
import database from "../../database";
import { cardHasType, cardType } from "../../cardTypes";

describe("utils", () => {
  it("Set codes are detected preperly", () => {
    expect(getSetCodeInEventId("Ladder")).toBeUndefined();
    expect(getSetCodeInEventId("Historic_Shakeup_20200606")).toBeUndefined();
    expect(getSetCodeInEventId("TestName_WithIkoInIt")).toBeUndefined();
    expect(getSetCodeInEventId("Sealed_DAR_20190304")).toBe("DAR");
    expect(getSetCodeInEventId("QuickDraft_GRN_20190412")).toBe("GRN");
    expect(getSetCodeInEventId("PremierDraft_IKO_20200416")).toBe("IKO");
    expect(getSetCodeInEventId("CompDraft_WAR_20190425")).toBe("WAR");
  });

  it("Card types are detected preperly", () => {
    const phSwamp = database.card(72578);
    if (phSwamp) {
      expect(cardType(phSwamp)).toBe("Basic Land");
      expect(cardHasType(phSwamp, "basic land")).toBeTruthy();
      expect(cardHasType(phSwamp, "Basic Land")).toBeTruthy();
      expect(cardHasType(phSwamp, "Land")).toBeTruthy();
    }
    const ornithopter = database.card(32951);
    if (ornithopter) {
      expect(cardType(ornithopter)).toBe("Creature");
      expect(cardHasType(ornithopter, "Artifact")).toBeTruthy();
      expect(cardHasType(ornithopter, "Creature")).toBeTruthy();
    }
  });
});
