import ReactApexChart from "react-apexcharts";

const RevenueChart = () => {
  const chartOpts = {
    series: [
      {
        name: "Sales",
        data: [35.5, 35.5, 36, 36, 36.5, 36.5, 36, 36, 36.5, 36.5, 36],
      },
    ],
    chart: {
      fontFamily: "inherit",
      type: "area",
      height: 400,
      toolbar: { show: false },
    },
    plotOptions: {},
    legend: { show: true },
    dataLabels: { enabled: false },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 90, 120],
      },
    },
    stroke: { curve: "smooth", show: true, width: 3 },
    xaxis: {
      categories: [
        "Apr 01",
        "Apr 02",
        "Apr 03",
        "Apr 04",
        "Apr 05",
        "Apr 06",
        "Apr 07",
        "Apr 08",
        "Apr 09",
        "Apr 10",
        "Apr 11",
        "Apr 12",
        "Apr 13",
        "Apr 14",
        "Apr 15",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: {
        position: "front",
        stroke: { color: "#f97316", width: 2 },
      },
      tooltip: {
        enabled: !0,
        formatter: void 0,
        offsetY: 0,
        style: { fontSize: "12px" },
      },
    },
    yaxis: {
      max: 37.3,
      min: 34,
      tickAmount: 8,
      labels: {
        style: { colors: "#f97316", fontSize: "12px" },
        formatter: function (e) {
          return "$" + Math.trunc(10 * e);
        },
      },
    },
    states: {
      normal: { filter: { type: "none", value: 0 } },
      hover: { filter: { type: "none", value: 0 } },
      active: {
        allowMultipleDataPointsSelection: !1,
        filter: { type: "none", value: 0 },
      },
    },
    colors: ["#f97316"],
    grid: {
      borderColor: "#f97316",
      strokeDashArray: 6,
      yaxis: { lines: { show: true } },
    },
    markers: {
      strokeWidth: 6,
      strokeOpacity: 0.6,
    },
  };
  return (
    <div className="rounded-md border border-default-200 bg-white dark:bg-default-50">
      <div className="border-b border-default-200 px-6 py-3">
        <h4 className="text-lg text-default-900">Revenue</h4>
      </div>
      <div className="p-5">
        <ReactApexChart
          height={400}
          type="area"
          options={chartOpts}
          series={chartOpts.series}
          className="apex-charts"
        />
      </div>
    </div>
  );
};

export default RevenueChart;
