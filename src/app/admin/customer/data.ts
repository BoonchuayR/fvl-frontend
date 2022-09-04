import { ChartType } from '../customer/customer.model';

const emailSentBarChart: ChartType = {
    chart: {
        height: 338,
        type: 'line',
        stacked: false,
        offsetY: -5,
        toolbar: {
            show: false
        }
    },
    stroke: {
        width: [0, 0, 0, 1],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
            columnWidth: '40%'
        }
    },
    colors: ['#2cb57e', '#f1b44c'],
    series: [{
        name: 'ค่าไฟ',
        type: 'column',
        data: [23, 11, 22, 27, 13, 22]
    }, {
        name: 'เติมเงิน',
        type: 'column',
        data: [19, 8, 26, 21, 18, 36]
    }],
    fill: {
        opacity: [0.85, 1, 0.25, 1],
        gradient: {
            inverseColors: false,
            shade: 'light',
            type: "vertical",
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
        }
    },
    labels: ['01/01/2022', '02/01/2022', '03/01/2022', '04/01/2022', '05/01/2022', '06/01/2022'],
    markers: {
        size: 0
    },

    xaxis: {
        type: 'datetime'
    },
    yaxis: {
        title: {
            text: 'Points',
        },
    },
    tooltip: {
        shared: true,
        intersect: false,
        y: {
            formatter: function (y: any) {
                if (typeof y !== "undefined") {
                    return y.toFixed(0) + " points";
                }
                return y;

            }
        }
    },
    grid: {
        borderColor: '#f1f1f1',
        padding: {
            bottom: 15
        }
    }
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
