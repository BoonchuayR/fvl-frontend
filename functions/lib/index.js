"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordElectricity = exports.helloWorld = exports.api = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const user_routes_1 = require("./users/user.routes");
const axios_1 = require("axios");
const moment = require("moment");
const firestore_1 = require("firebase-admin/firestore");
const utils_routes_1 = require("./utils/utils.routes");
const customer_routes_1 = require("./customer/customer.routes");
admin.initializeApp();
const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));
(0, user_routes_1.userRoutes)(app);
(0, customer_routes_1.customerRoutes)(app);
(0, utils_routes_1.utilRoutes)(app);
const db = (0, firestore_1.getFirestore)();
exports.api = functions.https.onRequest(app);
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});
// Start cron jobs >>>>>>>>>>>
exports.recordElectricity = functions.pubsub
    .schedule("0 0 * * *")
    .timeZone("Asia/Bangkok")
    .onRun((context) => {
    console.log("Schedule for record electricity >>> ");
    try {
        const bodyReq = {
            CMD_TYPE: "METER_SELECT",
            CMD_TOKEN: "FVIOT_ADMIN_a7e1b49f6dbdd1579de1929af0d7c303",
            CMD_PARAMS: [
                "BOOTH_ID",
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
            BOOTH_ID: ["*"],
            LIMIT: {
                PAGE: 1,
                PAGE_SIZE: 7,
            },
        };
        return (0, axios_1.default)({
            method: "post",
            url: "https://www.k-tech.co.th/foodvilla/meter/api/controller.php",
            data: bodyReq,
        }).then(async (res) => {
            const meterData = res.data.DATA_RESPONSE;
            console.log("meterData >>> ", meterData);
            for (let i = 0; i < meterData.length; i++) {
                const electricity = {
                    boothId: meterData[i].BOOTH_ID,
                    date: moment().format("YYYY-MM-DD hh:mm:ss"),
                    priviousUnit: meterData[i].METER_STATE_PREVIOUS_UNIT,
                    calculateUnit: meterData[i].METER_STATE_CALCULATE_UNIT,
                    charge: +meterData[i].METER_STATE_CALCULATE_UNIT * 7 * 100,
                    uid: "",
                    balanceAmt: 0,
                };
                const shopSnapshot = await db
                    .collection("shop")
                    .where("boothIds", "array-contains", meterData[i].BOOTH_ID)
                    .get();
                shopSnapshot.forEach(async (doc) => {
                    console.log(doc.id, "=>", doc.data());
                    const shop = doc.data();
                    const customerSnapshot = await db
                        .collection("customers")
                        .where("uid", "==", shop.uid)
                        .get();
                    customerSnapshot.forEach(async (cust) => {
                        const customer = cust.data();
                        // Update current money of cutomer
                        customer.currentMoney =
                            +customer.currentMoney - +electricity.charge;
                        cust.ref.update(customer);
                        // Add electricity
                        electricity.uid = customer.uid;
                        electricity.balanceAmt = customer.currentMoney;
                        db.collection("electricity")
                            .add(electricity)
                            .then(() => {
                            // console.log("res: ", res);
                        });
                    });
                    // console.log(doc.id, '=>', doc.data());
                });
            }
        });
    }
    catch (err) {
        console.log("error: ", err);
    }
});
//# sourceMappingURL=index.js.map