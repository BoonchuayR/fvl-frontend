
export interface profileShopData{
    boothCode:string;
    boothName:string;
    contractNo:string;
    boothZone:string;
    contractEndDate:string;
    custPhone:string;
    custName:string;
    contractDate:string;
    boothCate:string
    id:string;
}


export interface profileMeterData{
    boothId:string;
    deviceZone:string;
    deviceId:string;
    meterState:string;
    id:string;
}

export interface profileTopupData{
    createdAt:string;
    topupMoney:string;
    statusName:string;
}


export interface profileElectricData{
    boothId:string;
    date:string;
    calculateUnit:string;
    charge:string;
}