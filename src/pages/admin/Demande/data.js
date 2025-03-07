import avatar1 from "@/assets/images/avatars/img-1.jpg";
import avatar2 from "@/assets/images/avatars/img-2.jpg";
import avatar3 from "@/assets/images/avatars/img-3.jpg";
import avatar4 from "@/assets/images/avatars/img-4.jpg";
import avatar7 from "@/assets/images/avatars/img-7.jpg";
import avatar8 from "@/assets/images/avatars/img-8.jpg";
import avatar9 from "@/assets/images/avatars/img-9.jpg";

const statisticChart1 = {
  series: [{ name: "This Month", data: [98, 85, 60, 80, 100, 150, 120] }],
  chart: { height: 90, type: "area", toolbar: { show: !1 } },
  grid: { show: false },
  legend: {
    show: false,
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      inverseColors: !1,
      opacityFrom: 0.4,
      opacityTo: 0,
    },
  },
  dataLabels: { enabled: false },
  stroke: { curve: "stepline" },
  colors: ["#f97316"],
  xaxis: {
    labels: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
};

const statisticChart2 = {
  series: [{ name: "This Month", data: [110, 79, 72, 89, 120, 150, 140] }],
  chart: { height: 90, type: "area", toolbar: { show: !1 } },
  grid: { show: false },
  legend: {
    show: false,
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      inverseColors: !1,
      opacityFrom: 0.4,
      opacityTo: 0,
    },
  },
  dataLabels: { enabled: false },
  stroke: { curve: "stepline" },
  colors: ["#14b8a6"],
  xaxis: {
    labels: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
};

const statisticChart3 = {
  series: [{ name: "This Month", data: [148, 100, 80, 92, 110, 160, 130] }],
  chart: { height: 90, type: "area", toolbar: { show: !1 } },
  grid: { show: false },
  legend: {
    show: false,
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      inverseColors: !1,
      opacityFrom: 0.4,
      opacityTo: 0,
    },
  },
  dataLabels: { enabled: false },
  stroke: { curve: "stepline" },
  colors: ["#0ea5e9"],
  xaxis: {
    labels: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
};

const statisticData = [
  {
    title: "Today Revenue",
    state: "$2100",
    change: 10.21,
    variant: "text-teal-500",
    chartOptions: statisticChart1,
  },
  {
    title: "Product Sold",
    state: "558",
    change: 5.05,
    variant: "text-red-500",
    chartOptions: statisticChart2,
  },
  {
    title: "New Customers",
    state: "65",
    change: 25.16,
    variant: "text-teal-500",
    chartOptions: statisticChart3,
  },
];

const sources = [
  {
    type: "Direct",
    session: 358,
    view: 250,
  },
  {
    type: "Referral",
    session: 501,
    view: 50,
  },
  {
    type: "Email",
    session: 460,
    view: 600,
  },
  {
    type: "Organic",
    session: 920,
    view: 150,
  },
];
const topPerformers = [
  {
    name: "Saske N",
    position: "Senior Sales Guy",
    image: avatar7,
  },
  {
    name: "Greeva Y",
    position: "Social Campaign",
    image: avatar9,
  },
  {
    name: "Nik G",
    position: "Inventory Manager",
    image: avatar4,
  },
  {
    name: "Hardik G",
    position: "Sales Person",
    image: avatar1,
  },
  {
    name: "GB Patel G",
    position: "Sales Person",
    image: avatar8,
  },
  {
    name: "Jessica B",
    position: "Inventory Senior Manager",
    image: avatar2,
  },
  {
    name: "Tony S",
    position: "Sales Guy",
    image: avatar3,
  },
];

const recentOrders = [
  {
    id: 98754,
    product: "ASOS Ridley High",
    customer: "Otto B",
    price: 79.49,
    status: "Pending",
  },
  {
    id: 98753,
    product: "Marco Lightweight Shirt",
    customer: "Mark P",
    price: 125.49,
    status: "Delivered",
  },
  {
    id: 98752,
    product: "Half Sleeve Shirt",
    customer: "Dave B",
    price: 35.49,
    status: "Declined",
  },
  {
    id: 98751,
    product: "Lightweight Jacket",
    customer: "Lightweight Jacket",
    price: 49.49,
    status: "Delivered",
  },
  {
    id: 98750,
    product: "Marco Shoes",
    customer: "Rik N",
    price: 69.49,
    status: "Declined",
  },
];

export { sources, statisticData, topPerformers, recentOrders };
