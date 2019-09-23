/*
global
  am4core,
  am4charts,
  am4themes_dark,
  am4themes_animated
*/
//const db = require("../shared/database");
const playerData = require("../shared/player-data");
const _ = require("lodash");

const { hideLoadingBars, resetMainContainer } = require("./renderer-util");
const { get_rank_index } = require("../shared/util");
const { createDiv } = require("../shared/dom-fns");

function getRankY(rank, tier, steps) {
  let value = 0;
  switch (rank) {
    case "Bronze":
      value = 0;
      break;
    case "Silver":
      value = 4 * 6;
      break;
    case "Gold":
      value = 4 * 6 * 2;
      break;
    case "Platinum":
      value = 4 * 6 * 3;
      break;
    case "Diamond":
      value = 4 * 6 * 4;
      break;
    case "Mythic":
      value = 4 * 6 * 5;
  }

  return value + 6 * tier + steps;
}

function openTimelineTab() {
  hideLoadingBars();
  const mainDiv = resetMainContainer();
  mainDiv.classList.add("flex_item");
  let seasonType = "constructed";
  let chartDiv = createDiv(["chartdiv"]);

  let season = playerData.rank.constructed.seasonOrdinal;
  let chartData = playerData.seasonalRank(season, seasonType);
  chartData = chartData.map(obj => {
    let yPos = getRankY(obj.newClass, obj.newLevel, obj.newStep);
    obj.date = new Date(obj.timestamp);

    let match = playerData[obj.lastMatchId];
    obj.deck = false;
    obj.deckId = match.playerDeck.id;
    obj.deckName = match.playerDeck.name;
    obj.deckColors = match.playerDeck.colors;

    if (obj.oldLevel !== obj.newLevel) {
      obj.bullet = `../images/rank_${seasonType.toLowerCase()}/${
        obj.newClass
      }_${obj.newLevel}.png`;
    } else {
      obj.bullet = "";
    }
    return { ...obj, yPos };
  });

  am4core.useTheme(am4themes_dark);
  am4core.useTheme(am4themes_animated);
  var chart = am4core.create(chartDiv, am4charts.XYChart);

  // Give each deck a new color
  let deckIds = Object.keys(_.groupBy(chartData, "deckId"));
  let deckColors = {};
  deckIds.forEach(id => {
    deckColors[id] = chart.colors.next();
    chart.colors.next();
  });

  chartData = chartData.map(obj => {
    let color = deckColors[obj.deckId];
    return { ...obj, color };
  });

  chart.data = chartData;

  // Create axes
  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 50;

  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
  var series = chart.series.push(new am4charts.LineSeries());
  series.tooltipText = "{deckName}";
  series.tooltip.pointerOrientation = "vertical";
  series.dataFields.valueY = "yPos";
  series.dataFields.dateX = "date";
  series.strokeWidth = 3;
  series.fillOpacity = 0.5;
  series.minBulletDistance = 1;
  series.propertyFields.stroke = "color";
  series.propertyFields.fill = "color";

  // Add scrollbar
  chart.scrollbarX = new am4charts.XYChartScrollbar();
  chart.scrollbarX.series.push(series);

  // Add cursor
  chart.cursor = new am4charts.XYCursor();
  chart.cursor.xAxis = dateAxis;
  chart.cursor.snapToSeries = series;

  mainDiv.appendChild(chartDiv);
}

module.exports = { openTimelineTab: openTimelineTab };
