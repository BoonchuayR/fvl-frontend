// Chart data
export interface ChartType {
    chart?: any;
    plotOptions?: any;
    colors?: any;
    series?: any;
    fill?: any;
    dataLabels?: any;
    legend?: any;
    xaxis?: any;
    stroke?: any;
    labels?: any;
    markers?: any;
    yaxis?: any;
    tooltip?: any;
    grid?: any;
}
export interface DashboardUser{
    typeUser: string;
    displayName: string;
    email: string;
    phone: string;
}

export interface DashboardShop{
    boothName: string;
    custName: string;
    boothCode: string;
    custPhone: string;
}
