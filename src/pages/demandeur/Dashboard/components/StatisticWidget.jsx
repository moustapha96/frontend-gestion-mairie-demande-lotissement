import { LuTrendingDown, LuTrendingUp } from "react-icons/lu";
import ReactApexChart from "react-apexcharts";

const StatisticWidget = ({ statistic }) => {
  const { change, state, title, variant, chartOptions } = statistic;

  return (
    <div className="rounded-md border border-default-200 bg-white dark:bg-default-50">
      <div className="p-5">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-default-600">
              {title}
            </span>
            <span className={variant}>
              {variant === "text-teal-500" ? (
                <>
                  <LuTrendingUp className="me-1 inline size-4" /> +
                </>
              ) : (
                <>
                  <LuTrendingDown className="me-1 inline size-4" /> -
                </>
              )}
              {change}%
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <h3 className="text-3xl font-medium text-default-800">{state}</h3>
            <ReactApexChart
              height={chartOptions.chart?.height}
              series={chartOptions.series}
              options={chartOptions}
              type={chartOptions.chart?.type}
              className="apex-charts"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticWidget;
