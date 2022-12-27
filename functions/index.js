const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const request = require("request-promise");
const moment = require("moment");


initializeApp();

const db = getFirestore();

exports.scheduledFunction = functions.pubsub.schedule("0 0 * * *")
    .timeZone("Asia/Bangkok")
    .onRun((context) => {
      console.info("This will be run every minute!");

    //   db.collection("customers").get().then((customers) => {
    //     customers.forEach((doc) => {
    //       console.log(doc.id, "=>", doc.data());
    //     });
    //   });

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
					"METER_STATE_CALCULATE_UNIT"
				],
				STORE_ID: ["*"]
      };

      request({
        method: "POST",
        uri: "https://www.k-tech.co.th/foodvilla/meter/api/controller.php",
        body: bodyReq,
        json: true,
      }).then((meters) => {
				const meterData = meters.DATA;
				console.log("meterData: ", meterData);
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
					
        }
      });
    });

// Calculate energy charge every day 00.00
// 1. Get all meter
// 2. Calculate energy charg of each meter
// ((current "ACTIVE_ENERGY" - last "ACTIVE_ENERGY") * 7)
// 3. Decrease topup money of meter's
