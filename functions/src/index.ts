import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import {userRoutes} from "./users/user.routes";
import axios from "axios";
import * as moment from "moment";
import {getFirestore} from "firebase-admin/firestore";
import {utilRoutes} from "./utils/utils.routes";
import {customerRoutes} from "./customer/customer.routes";

admin.initializeApp();

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: true}));
userRoutes(app);
customerRoutes(app);
utilRoutes(app);

const db = getFirestore();

export const api = functions.https.onRequest(app);

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// Start cron jobs >>>>>>>>>>>
export const recordElectricity = functions.pubsub
  .schedule("0 0 * * *")
  .timeZone("Asia/Bangkok")
  .onRun((context): any => {
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

      return axios({
        method: "post",
        url: "https://www.k-tech.co.th/foodvilla/meter/api/controller.php",
        data: bodyReq,
      }).then(async (res: any) => {
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
    } catch (err) {
      console.log("error: ", err);
    }
  });
