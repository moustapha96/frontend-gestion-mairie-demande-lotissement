import { statisticData } from "../data";
import StatisticWidget from "./StatisticWidget";

const Statistics = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {statisticData.map((statistic, idx) => (
        <StatisticWidget statistic={statistic} key={idx} />
      ))}
    </div>
  );
};

export default Statistics;
