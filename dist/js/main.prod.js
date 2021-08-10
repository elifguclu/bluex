"use strict";
$(document).ready(function () {
    $(".open-menu").click(function () {
      console.log($(".content").width());
      $(".one").removeClass("col-5").addClass("col");
      $(".two").removeClass("col-3").addClass("col");
      $(".three").removeClass("col-4").addClass("col");
      $(".newMember").removeClass("px-4").addClass("px-2");
      //$("member").removeClass("py-3", "px-4").addClass("p-3");
      //$(".latestSales").removeClass("p-4").addClass("py-4", "px-1");
      //$("topSales").removeClass("p-4").addClass("py-4", "px-3");
    });
    $(".close-menu").click(function () {
      console.log($(".content").width());
      $(".one").removeClass("col").addClass("col-5");
      $(".two").removeClass("col").addClass("col-3");
      $(".three").removeClass("col").addClass("col-4");
      $(".newMember").removeClass("px-2").addClass("px-4");
      //$(".latestSales").removeClass("py-4 px-1").addClass("p-4");
      //$("member").removeClass("p-3").addClass("py-3 px-4");
      //$("topSales").removeClass("py-4 px-3").addClass("p-4");
    });

    /*
    var c = new Chart($("#barChart"), {
      type: "bar",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            data: [42, 35, 32, 38, 45, 58, 48, 50, 62, 75, 88, 78],
            label: "Month",
            backgroundColor: "#4FABEA",
          },
        ],
      },
      options: {
        maintainAspectRatio: true,
        responsive: true,
        barRoundness: 1,
        legend: {
          display: false,
        },
        //cornerRadius: 20,
        scales: {
          yAxes: [
            {
              gridLines: {
                drawBorder: false,
                zeroLineColor: "#4FABEA",
                zeroLineWidth: 2,
                drawBorder: false,
                lineWidth: 0.5,
                borderDash: [5, 5],
                fontSize: 16,
                fontColor: "black",
                defaultFontFamily: "'Roboto',sans-serif",
              },
              ticks: {
                beginAtZero: true,
                max: 90,
                min: 0, //buraya 10 yazınca 0 ile beraber beginAtZero da false oluyor
                stepSize: 10,
              },
            },
          ],
          xAxes: [
            {
              barPercentage: 0.4,
              gridLines: {
                drawBorder: false,
                lineWidth: 0,
                drawBorder: false,
              },
            },
          ],
        },
      },
    });

    */

    Chart.helpers.drawRoundedTopRectangle = function (
      ctx,
      x,
      y,
      width,
      height,
      radius
    ) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      // top right corner
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      // bottom right	corner
      ctx.lineTo(x + width, y + height);
      // bottom left corner
      ctx.lineTo(x, y + height);
      // top left
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };

    Chart.elements.RoundedTopRectangle = Chart.elements.Rectangle.extend({
      draw: function () {
        var ctx = this._chart.ctx;
        var vm = this._view;
        var left, right, top, bottom, signX, signY, borderSkipped;
        var borderWidth = vm.borderWidth;

        if (!vm.horizontal) {
          // bar
          left = vm.x - vm.width / 2;
          right = vm.x + vm.width / 2;
          top = vm.y;
          bottom = vm.base;
          signX = 1;
          signY = bottom > top ? 1 : -1;
          borderSkipped = vm.borderSkipped || "bottom";
        } else {
          // horizontal bar
          left = vm.base;
          right = vm.x;
          top = vm.y - vm.height / 2;
          bottom = vm.y + vm.height / 2;
          signX = right > left ? 1 : -1;
          signY = 1;
          borderSkipped = vm.borderSkipped || "left";
        }

        // Canvas doesn't allow us to stroke inside the width so we can
        // adjust the sizes to fit if we're setting a stroke on the line
        if (borderWidth) {
          // borderWidth shold be less than bar width and bar height.
          var barSize = Math.min(
            Math.abs(left - right),
            Math.abs(top - bottom)
          );
          borderWidth = borderWidth > barSize ? barSize : borderWidth;
          var halfStroke = borderWidth / 2;
          // Adjust borderWidth when bar top position is near vm.base(zero).
          var borderLeft =
            left + (borderSkipped !== "left" ? halfStroke * signX : 0);
          var borderRight =
            right + (borderSkipped !== "right" ? -halfStroke * signX : 0);
          var borderTop =
            top + (borderSkipped !== "top" ? halfStroke * signY : 0);
          var borderBottom =
            bottom + (borderSkipped !== "bottom" ? -halfStroke * signY : 0);
          // not become a vertical line?
          if (borderLeft !== borderRight) {
            top = borderTop;
            bottom = borderBottom;
          }
          // not become a horizontal line?
          if (borderTop !== borderBottom) {
            left = borderLeft;
            right = borderRight;
          }
        }

        // calculate the bar width and roundess
        var barWidth = Math.abs(left - right);
        var roundness = this._chart.config.options.barRoundness || 0.5;
        var radius = barWidth * roundness * 0.5;

        // keep track of the original top of the bar
        var prevTop = top;

        // move the top down so there is room to draw the rounded top
        top = prevTop + radius;
        var barRadius = top - prevTop;

        ctx.beginPath();
        ctx.fillStyle = vm.backgroundColor;
        ctx.strokeStyle = vm.borderColor;
        ctx.lineWidth = borderWidth;

        // draw the rounded top rectangle
        Chart.helpers.drawRoundedTopRectangle(
          ctx,
          left,
          top - barRadius + 1,
          barWidth,
          bottom - prevTop,
          barRadius
        );

        ctx.fill();
        if (borderWidth) {
          ctx.stroke();
        }

        // restore the original top value so tooltips and scales still work
        top = prevTop;
      },
    });

    Chart.defaults.roundedBar = Chart.helpers.clone(Chart.defaults.bar);

    Chart.controllers.roundedBar = Chart.controllers.bar.extend({
      dataElementType: Chart.elements.RoundedTopRectangle,
    });

    var ctx = document.getElementById("barChart").getContext("2d");
    var myBar = new Chart(ctx, {
      type: "roundedBar",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            data: [42, 35, 32, 38, 45, 58, 48, 50, 62, 75, 88, 78],
            label: "Month",
            backgroundColor: "#4FABEA",
          },
        ],
      },
      options: {
        responsive: true,
        barRoundness: 1,
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                drawBorder: false,
                zeroLineColor: "#4FABEA",
                zeroLineWidth: 2,
                drawBorder: false,
                lineWidth: 0.5,
                borderDash: [5, 5],
                fontSize: 16,
                fontColor: "black",
                defaultFontFamily: "'Roboto',sans-serif",
              },
              ticks: {
                beginAtZero: false,
                max: 90,
                min: 0, //buraya 10 yazınca 0 ile beraber beginAtZero da false oluyor
                stepSize: 10,
              },
            },
          ],
          xAxes: [
            {
              barPercentage: 0.4,
              gridLines: {
                drawBorder: false,
                lineWidth: 0,
                drawBorder: false,
              },
            },
          ],
        },
      },
    });
  });