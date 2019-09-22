/*
global
  am4core,
  am4charts
*/
//const db = require("../shared/database");
const playerData = require("../shared/player-data");

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

  var chart = am4core.create(chartDiv, am4charts.XYChart);

  // Create axes
  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 50;

  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = "yPos";
  series.dataFields.dateX = "date";
  series.strokeWidth = 2;
  series.minBulletDistance = 10;
  series.tooltipText = "{yPos}";
  series.tooltip.pointerOrientation = "vertical";
  series.tooltip.background.cornerRadius = 20;
  series.tooltip.background.fillOpacity = 0.5;
  series.tooltip.label.padding(12, 12, 12, 12);

  // Add scrollbar
  chart.scrollbarX = new am4charts.XYChartScrollbar();
  chart.scrollbarX.series.push(series);

  // Add cursor
  chart.cursor = new am4charts.XYCursor();
  chart.cursor.xAxis = dateAxis;
  chart.cursor.snapToSeries = series;

  // Add data
  let season = playerData.rank.constructed.seasonOrdinal;
  chart.data = playerData.seasonalRank(season, seasonType);
  chart.data = chart.data.map(obj => {
    let yPos = getRankY(obj.newClass, obj.newLevel, obj.newStep);
    obj.date = new Date(obj.timestamp);
    /*
    obj.bullet = series.bullets.push(new am4charts.Bullet());
    if (obj.newLevel !== obj.oldLevel) {
      let image = obj.bullet.createChild(am4core.Image);
      image.href = `../images/rank_${seasonType}/${obj.newClass}_${
        obj.newStep
      }.png`;
      image.minWidth = 120;
      image.outerHeight = 24;
      image.width = 24;
      image.height = 24;
      console.log(image.element);
      image.horizontalCenter = "middle";
      image.verticalCenter = "middle";
    }
    */
    return { ...obj, yPos };
  });

  console.log(chart.data);

  mainDiv.appendChild(chartDiv);
}

module.exports = { openTimelineTab: openTimelineTab };
