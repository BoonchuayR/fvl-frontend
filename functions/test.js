const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const request = require("request-promise");
const moment = require("moment");


initializeApp();

const db = getFirestore();

console.info("This will be run every minute!");

const bodyReq = {
    CMD_TYPE: "METER_SELECT",
    CMD_TOKEN: "a7e1b49f6dbdd1579de1929af0d7c303",
    CMD_PARAMS: [
        "STORE_ID",
        "DEVICE_ZONE",
        "DEVICE_ID",
        "SERIAL_NO",
        "SLAVE_ID",
        "MODEL_SPEC",
        "LINE_VOLTAGE",
        "LINE_FREQUENCY",
        "LINE_CURRENT",
        "ACTIVE_POWER",
        "ACTIVE_ENERGY",
        "UPDATE_DATETIME",
        "METER_STATE",
        "UPDATE_STATE_DATETIME",
        "METER_STATE_ADMIN",
        "UPDATE_STATE_ADMIN_DATETIME",
        "METER_STATE_PREVIOUS_UNIT",
        "METER_STATE_CALCULATE_UNIT",
    ],
    SERIAL_NO: ["*"],
};

request({
    method: "POST",
    uri: "https://www.k-tech.co.th/foodvilla/meter/api/controller.php",
    body: bodyReq,
    json: true,
    }).then((meters) => {
        const meterData = meters.DATA;
        // console.log("meterData: ", meterData);
        for (let i = 0; i < meterData.length; i++) {
            const electricity = {
            storeId: meterData[i].STORE_ID,
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
            priviousUnit: meterData[i].METER_STATE_PREVIOUS_UNIT,
            calculateUnit: meterData[i].METER_STATE_CALCULATE_UNIT,
            charge: +meterData[i].METER_STATE_CALCULATE_UNIT * 7,
            };

            db.collection('electricity').add(electricity).then(res => {
                console.log("res: ", res)
            });

            break;

        }
});