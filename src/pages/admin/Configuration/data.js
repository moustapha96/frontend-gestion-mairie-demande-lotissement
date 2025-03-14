import avatar1 from "@/assets/images/avatars/img-1.jpg";
import avatar2 from "@/assets/images/avatars/img-2.jpg";
import avatar3 from "@/assets/images/avatars/img-3.jpg";
import avatar4 from "@/assets/images/avatars/img-4.jpg";
import avatar7 from "@/assets/images/avatars/img-7.jpg";
import avatar8 from "@/assets/images/avatars/img-8.jpg";
import avatar9 from "@/assets/images/avatars/img-9.jpg";

// Configuration for Area Charts using Ant Design chart style
const statisticChart1 = {
    series: [{ name: "Ce Mois", data: [98, 85, 60, 80, 100, 150, 120] }],
    chart: { 
        height: 90, 
        type: "area",
        toolbar: { show: false },
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial'
    },
    grid: { show: false },
    legend: { show: false },
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 0.6,
            opacityFrom: 0.5,
            opacityTo: 0.1,
            stops: [0, 90, 100]
        }
    },
    dataLabels: { enabled: false },
    stroke: { 
        curve: "smooth",
        width: 2
    },
    colors: ["#1677ff"], // Ant Design primary blue
    xaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
    },
    yaxis: { show: false },
    tooltip: {
        theme: "light",
        style: {
            fontSize: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial'
        }
    }
};

const statisticChart2 = {
    ...statisticChart1,
    series: [{ name: "Ce Mois", data: [110, 79, 72, 89, 120, 150, 140] }],
    colors: ["#52c41a"] // Ant Design success green
};

const statisticChart3 = {
    ...statisticChart1,
    series: [{ name: "Ce Mois", data: [148, 100, 80, 92, 110, 160, 130] }],
    colors: ["#722ed1"] // Ant Design purple
};

// Updated statistic data with Ant Design status colors
const statisticData = [
    {
        title: "Revenu Aujourd'hui",
        state: "2100 FCFA",
        change: 10.21,
        variant: "#52c41a", // Ant Design success color
        chartOptions: statisticChart1,
        icon: "RiseOutlined"
    },
    {
        title: "Produits Vendus",
        state: "558",
        change: 5.05,
        variant: "#f5222d", // Ant Design error color
        chartOptions: statisticChart2,
        icon: "ShoppingOutlined"
    },
    {
        title: "Nouveaux Clients",
        state: "65",
        change: 25.16,
        variant: "#52c41a", // Ant Design success color
        chartOptions: statisticChart3,
        icon: "UserAddOutlined"
    }
];

// Updated sources data with Ant Design styling
const sources = [
    {
        type: "Direct",
        session: 358,
        view: 250,
        color: "#1677ff" // Ant Design primary blue
    },
    {
        type: "Référence",
        session: 501,
        view: 50,
        color: "#52c41a" // Ant Design success green
    },
    {
        type: "Email",
        session: 460,
        view: 600,
        color: "#faad14" // Ant Design warning yellow
    },
    {
        type: "Organique",
        session: 920,
        view: 150,
        color: "#722ed1" // Ant Design purple
    }
];

// Updated top performers with Ant Design avatar sizes
const topPerformers = [
    {
        name: "Saske N",
        position: "Senior Commercial",
        image: avatar7,
        size: 40 // Ant Design default avatar size
    },
    {
        name: "Greeva Y",
        position: "Campagne Sociale",
        image: avatar9,
        size: 40
    },
    {
        name: "Nik G",
        position: "Gestionnaire d'Inventaire",
        image: avatar4,
        size: 40
    },
    {
        name: "Hardik G",
        position: "Commercial",
        image: avatar1,
        size: 40
    },
    {
        name: "GB Patel G",
        position: "Commercial",
        image: avatar8,
        size: 40
    },
    {
        name: "Jessica B",
        position: "Gestionnaire Senior d'Inventaire",
        image: avatar2,
        size: 40
    },
    {
        name: "Tony S",
        position: "Commercial",
        image: avatar3,
        size: 40
    }
];

// Updated recent orders with Ant Design status tags
const recentOrders = [
    {
        id: 98754,
        product: "ASOS Ridley High",
        customer: "Otto B",
        price: "79.49 FCFA",
        status: "pending",
        statusColor: "processing" // Ant Design Tag color
    },
    {
        id: 98753,
        product: "Marco Lightweight Shirt",
        customer: "Mark P",
        price: "125.49 FCFA",
        status: "delivered",
        statusColor: "success"
    },
    {
        id: 98752,
        product: "Half Sleeve Shirt",
        customer: "Dave B",
        price: "35.49 FCFA",
        status: "declined",
        statusColor: "error"
    },
    {
        id: 98751,
        product: "Lightweight Jacket",
        customer: "Shreyu N",
        price: "49.49 FCFA",
        status: "delivered",
        statusColor: "success"
    },
    {
        id: 98750,
        product: "Marco Shoes",
        customer: "Rik N",
        price: "69.49 FCFA",
        status: "declined",
        statusColor: "error"
    }
];

export {
    statisticData,
    sources,
    topPerformers,
    recentOrders
};
