import { Line } from 'vue-chartjs';

export default {
  name: 'header-chart',
  extends: Line,
  props: ['dataOrganic', 'dataRecommended', 'dataSearch', 'dataOverlay', 'labels'],
  mounted() {
      let colorDefault = "#ffffff";
      let colorOrganic = "#00d2fc";
      let colorRecommended = "#5ffc1f";
      let colorSearch = "#800080";
      let colorOverlay = "#ffff00";

      const ctx = document.getElementById(this.chartId).getContext('2d');

      let gradientFillOrganic = ctx.createLinearGradient(0, 500, 0, 0);
      gradientFillOrganic.addColorStop(0, colorOrganic);
      gradientFillOrganic.addColorStop(.3, colorDefault);
      gradientFillOrganic.addColorStop(1, colorOrganic);

      let gradientFillRecommended = ctx.createLinearGradient(0, 500, 0, 0);
      gradientFillRecommended.addColorStop(0, colorRecommended);
      gradientFillRecommended.addColorStop(.3, colorDefault);
      gradientFillRecommended.addColorStop(1, colorRecommended);

      let gradientFillSearch = ctx.createLinearGradient(0, 500, 0, 0);
      gradientFillSearch.addColorStop(0, colorSearch);
      gradientFillSearch.addColorStop(.3, colorDefault);
      gradientFillSearch.addColorStop(1, colorSearch);

      let gradientFillOverlay = ctx.createLinearGradient(0, 500, 0, 0);
      gradientFillOverlay.addColorStop(0, colorOverlay);
      gradientFillOverlay.addColorStop(.3, colorDefault);
      gradientFillOverlay.addColorStop(1, colorOverlay);

    this.renderChart(
      {
        labels: this.labels || [],
        datasets: [
          {
            label: 'Orgânico',
            borderColor: colorOrganic,
            backgroundColor: gradientFillOrganic,
            pointBorderColor: colorDefault,
            pointBackgroundColor: gradientFillOrganic,
            pointHoverBackgroundColor: colorOrganic,
            pointHoverBorderColor: colorDefault,
            pointBorderWidth: 1,
            pointHoverRadius: 7,
            pointHoverBorderWidth: 2,
            pointRadius: 0,
            fill: true,
            borderWidth: 2,
            data: this.dataOrganic || []
          },
          {
            label: 'Recomendação',
            borderColor: colorRecommended,
            backgroundColor: gradientFillRecommended,
            pointBorderColor: colorDefault,
            pointBackgroundColor: gradientFillRecommended,
            pointHoverBackgroundColor: colorRecommended,
            pointHoverBorderColor: colorDefault,
            pointBorderWidth: 1,
            pointHoverRadius: 7,
            pointHoverBorderWidth: 2,
            pointRadius: 0,
            fill: true,
            borderWidth: 2,
            data: this.dataRecommended || []
          },
          {
            label: 'Busca',
            borderColor: colorSearch,
            backgroundColor: gradientFillSearch,
            pointBorderColor: colorDefault,
            pointBackgroundColor: gradientFillSearch,
            pointHoverBackgroundColor: colorSearch,
            pointHoverBorderColor: colorDefault,
            pointBorderWidth: 1,
            pointHoverRadius: 7,
            pointHoverBorderWidth: 2,
            pointRadius: 0,
            fill: true,
            borderWidth: 2,
            data: this.dataSearch || []
          },
          {
            label: 'Overlay',
            borderColor: colorOverlay,
            backgroundColor: gradientFillOverlay,
            pointBorderColor: colorDefault,
            pointBackgroundColor: gradientFillOverlay,
            pointHoverBackgroundColor: colorOverlay,
            pointHoverBorderColor: colorDefault,
            pointBorderWidth: 1,
            pointHoverRadius: 7,
            pointHoverBorderWidth: 2,
            pointRadius: 0,
            fill: true,
            borderWidth: 2,
            data: this.dataOverlay || []
          }
        ]
      },
      {
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 0,
            bottom: 0
          }
        },
        maintainAspectRatio: false,
        tooltips: {
            backgroundColor: '#fff',
            titleFontColor: '#333',
            bodyFontColor: '#666',
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest"
        },
        legend: {
          position: 'bottom',
          fillStyle: '#FFF',
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: 'rgba(255,255,255,0.4)',
                fontStyle: 'bold',
                beginAtZero: true,
                maxTicksLimit: 5,
                padding: 10
              },
              gridLines: {
                drawTicks: true,
                drawBorder: false,
                display: true,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: 'transparent'
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                zeroLineColor: 'transparent',
                display: false
              },
              ticks: {
                padding: 10,
                fontColor: 'rgba(255,255,255,0.4)',
                fontStyle: 'bold'
              }
            }
          ]
        }
      }
    );
  }
};
