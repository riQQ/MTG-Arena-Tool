import React, { useCallback } from "react";
import Deck from "../../../shared/deck";
import Button from "../misc/Button";
import Aggregator, { AggregatorFilters } from "../../aggregator";
import CardTile from "../../../shared/CardTile";
import db from "../../../shared/database";
import { CardWinrateData } from "../../aggregator";
import { getWinrateClass } from "../../rendererUtil";
import { DbCardData } from "../../../types/Metadata";
import { compare_cards, getDeckAfterChange } from "../../../shared/util";
import { getDeckChangesList } from "../../../shared-store";
import { DeckChange } from "../../../types/Deck";
import ReactSelect from "../../../shared/ReactSelect";
import { format } from "date-fns";

function getWinrateValue(wins: number, losses: number): number {
  return wins + losses == 0 ? -1 : Math.round((100 / (wins + losses)) * wins);
}

function cardWinrateLine(
  winrates: Record<number, CardWinrateData>,
  cardObj: DbCardData,
  quantity: number,
  index: number
): JSX.Element {
  const wr = winrates[cardObj.id];
  const winrate = getWinrateValue(wr.wins, wr.losses);
  const sideInWinrate = getWinrateValue(wr.sideInWins, wr.sideInLosses);
  const initHandWinrate = getWinrateValue(wr.initHandWins, wr.initHandsLosses);
  const sideOutWinrate = getWinrateValue(wr.sideOutWins, wr.sideOutLosses);

  const sum = wr.turnsUsed.reduce((a, b) => a + b, 0);
  const avgTurn = sum / wr.turnsUsed.length || 0;
  return (
    <div className="card-wr-line" key={cardObj.id + "-" + index}>
      <div className="card-wr-line-card">
        <CardTile
          indent="c"
          isHighlighted={false}
          isSideboard={false}
          showWildcards={false}
          card={cardObj}
          key={"main-" + index + "-" + cardObj.id}
          quantity={quantity}
        />
      </div>
      <div
        className={
          getWinrateClass(winrate / 100) +
          "_bright card-wr-item card-wr-line-wr"
        }
      >
        {winrate >= 0 ? winrate + "%" : "-"}
      </div>
      <div
        className={
          getWinrateClass(initHandWinrate / 100) +
          "_bright card-wr-item card-wr-line-hand-wr"
        }
      >
        {initHandWinrate >= 0 ? initHandWinrate + "%" : "-"}
      </div>
      <div className="card-wr-item card-wr-line-sided-in">{wr.sidedIn}</div>
      <div className="card-wr-item card-wr-line-sided-out">{wr.sidedOut}</div>
      <div
        className={
          getWinrateClass(sideInWinrate / 100) +
          "_bright card-wr-item card-wr-line-sided-in-wr"
        }
      >
        {sideInWinrate >= 0 ? sideInWinrate + "%" : "-"}
      </div>
      <div
        className={
          getWinrateClass(sideOutWinrate / 100) +
          "_bright card-wr-item card-wr-line-sided-out-wr"
        }
      >
        {sideOutWinrate >= 0 ? sideOutWinrate + "%" : "-"}
      </div>
      <div className="card-wr-item card-wr-line-avg-turn">
        {avgTurn.toFixed(2)}
      </div>
    </div>
  );
}

function sortDeckChanges(a: DeckChange, b: DeckChange): number {
  const ad = new Date(a.date).getTime();
  const bd = new Date(b.date).getTime();
  return ad - bd;
}

interface CardsWinratesViewProps {
  deck: Deck;
  aggregator: Aggregator;
  setRegularView: { (): void };
  aggFilters: AggregatorFilters;
  setAggFilters: (filters: AggregatorFilters) => void;
}

export default function CardsWinratesView(
  props: CardsWinratesViewProps
): JSX.Element {
  const { aggregator, setRegularView, aggFilters, setAggFilters } = props;
  let { deck } = props;
  const deckChanges = getDeckChangesList(deck.id);
  if (aggFilters.deckVersion !== Aggregator.DEFAULT_DECK_VERSION) {
    const change = deckChanges.filter(
      change => change.newDeckHash == aggFilters.deckVersion
    )[0];
    if (change) {
      deck = getDeckAfterChange(change);
    }
  }
  const deckVersions = Array.from(
    new Set([
      "All Versions",
      ...deckChanges.sort(sortDeckChanges).map(change => change.newDeckHash)
    ])
  );

  const deckVersionFormatter = useCallback(
    (id: string) => {
      const index = deckVersions.indexOf(id);
      return id == "All Versions" ? (
        "All Versions"
      ) : (
        <>
          <div>Version {deckVersions.length - index}</div>
          <div className="list_deck_name_it">
            {" (" +
              format(
                new Date(
                  deckChanges.filter(
                    change => change.newDeckHash == deckVersions[index]
                  )[0].date
                ),
                "dd/MM/yy"
              ) +
              ")"}
          </div>
        </>
      );
    },
    [deckVersions, deckChanges]
  );

  const setDeckVersionFilter = useCallback(
    (version: string) => {
      // Set deck hash filter
      setAggFilters({ ...aggFilters, deckVersion: version });
    },
    [aggFilters, setAggFilters]
  );

  const winrates = aggregator.getCardsWinrates();
  // console.log(winrates);
  deck.sortMainboard(compare_cards);
  deck.sortSideboard(compare_cards);
  return (
    <>
      <Button text="Normal View" onClick={setRegularView} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          className="centered_setting_container"
          style={{ justifyContent: "center" }}
        >
          <label>Deck Version:</label>
          <ReactSelect
            options={deckVersions}
            optionFormatter={deckVersionFormatter}
            current={deckVersions[0]}
            callback={setDeckVersionFilter}
          />
        </div>
        <div className="settings_note" style={{ textAlign: "center" }}>
          All winrates shown correspond to the times when the card in question
          was cast during a game, except for the &quot;Sided out WR&quot;
          column.
        </div>
        <div className="card-wr-stats">
          <div className="card-wr-line">
            <div className="card-wr-item card-wr-line-card">Mainboard</div>
            <div className="card-wr-item card-wr-line-wr">Cast WR</div>
            <div className="card-wr-item card-wr-line-hand-wr">Hand WR</div>
            <div className="card-wr-item card-wr-line-sided-in">Sided in</div>
            <div className="card-wr-item card-wr-line-sided-out">Sided out</div>
            <div className="card-wr-item card-wr-line-sided-in-wr">
              Sided in WR
            </div>
            <div className="card-wr-item card-wr-line-sided-out-wr">
              Sided out WR
            </div>
            <div className="card-wr-item card-wr-line-avg-turn">Avg. turn</div>
          </div>
          {deck
            .getMainboard()
            .get()
            .map((card, index) => {
              const cardObj = db.card(card.id);
              if (cardObj && winrates[card.id]) {
                return cardWinrateLine(winrates, cardObj, card.quantity, index);
              }
            })}
          <div className="card-wr-line">
            <div className="card-wr-item card-wr-line-separator">Sideboard</div>
            <div className="card-wr-item card-wr-line-wr"></div>
            <div className="card-wr-item card-wr-line-hand-wr"></div>
            <div className="card-wr-item card-wr-line-sided-in"></div>
            <div className="card-wr-item card-wr-line-sided-out"></div>
            <div className="card-wr-item card-wr-line-sided-in-wr"></div>
            <div className="card-wr-item card-wr-line-sided-out-wr"></div>
            <div className="card-wr-item card-wr-line-avg-turn"></div>
          </div>
          {deck
            .getSideboard()
            .get()
            .map((card, index) => {
              const cardObj = db.card(card.id);
              if (cardObj && winrates[card.id]) {
                return cardWinrateLine(winrates, cardObj, card.quantity, index);
              }
            })}
        </div>
      </div>
    </>
  );
}
