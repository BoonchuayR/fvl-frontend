import { ChartType } from '../profile/profile.model';

const emailSentBarChart: ChartType = {
    chart: {
      height: 350,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    colors: ["#f1b44c"],
    plotOptions: {
      bar: {
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: string) => {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    series: [
      {
        name: "Inflation",
        data: [2.5, 3.2, 5.0, 10.1, 4.2, 3.8, 3, 2.4, 4.0, 1.2, 3.5, 0.8],
      },
    ],
    xaxis: {
      categories: [
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
      position: "bottom",
      labels: {
        offsetY: -18,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
        offsetY: -35,
      },
    },
    fill: {
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [50, 0, 100, 100],
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: (val: string) => {
          return val + "%";
        },
      },
    },
    title: {
      text: "ยอดเงินคงเหลือรายวัน",
      floating: true,
      offsetY: 320,
      align: "center",
      style: {
        color: "#444",
      },
    },
  };

const monthlyEarningChart: ChartType = {
    chart: {
        height: 200,
        type: 'radialBar',
        offsetY: -10
    },
    plotOptions: {
        radialBar: {
            startAngle: -135,
            endAngle: 135,
            dataLabels: {
                name: {
                    fontSize: '13px',
                    color: undefined,
                    offsetY: 60
                },
                value: {
                    offsetY: 22,
                    fontSize: '16px',
                    color: undefined,
                    formatter: (val: any) => {
                        return val + '%';
                    }
                }
            }
        }
    },
    colors: ['#fccd0e'],
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'dark',
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 65, 91]
        },
    },
    stroke: {
        dashArray: 4,
    },
    series: [90],
    labels: ['เงินคงเหลือ'],
};

export { emailSentBarChart, monthlyEarningChart };
