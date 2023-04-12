const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const request = require("request-promise");
const moment = require("moment");
const cors = require('cors');
const express = require('express');

initializeApp();

const app = express();

const db = getFirestore();

exports.scheduledFunction = functions.pubsub.schedule("* * * * *")
    .timeZone("Asia/Bangkok")
    .onRun(async (context) => {
    //   console.info("This will be run every minute!");

    // db.collection("customers").get().then((documentSnapshot) => {
	// 	let data = documentSnapshot.data;
  	// 	console.log(`Retrieved data: ${JSON.stringify(data)}`);
    // });

		const customersRef = db.collection('customers');
		const shopRef = db.collection('shop');
		
		const snapshot = await customersRef.get();
		snapshot.forEach(async doc => {
			console.info(`Customer ${doc.id} `, '=>', doc.data());
			customer = doc.data;
			uid = customer.uid;

			// Get customer's shop
			const shopSnapshot = await shopRef.where('uid', '==', uid).get();
			if (shopSnapshot.empty) {
				console.log('No matching documents.');
				return;
			}  

			shopSnapshot.forEach(doc => {
				const shop = doc.data();
				console.log(`Customer[${customer.custName}], Shop[${shop.boothName}]`);
			});
		});

		// console.info("snapshot >>> ", snapshot);

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

      return request({
        method: "POST",
        uri: "https://www.k-tech.co.th/foodvilla/meter/api/controller.php",
        body: bodyReq,
        json: true,
      }).then((meters) => {
				const meterData = meters.DATA;
				// console.log("meterData: ", meterData);
        for (let i = 0; i < 100; i++) {
          const electricity = {
            storeId: meterData[i].STORE_ID,
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
            priviousUnit: meterData[i].METER_STATE_PREVIOUS_UNIT,
            calculateUnit: meterData[i].METER_STATE_CALCULATE_UNIT,
            charge: +meterData[i].METER_STATE_CALCULATE_UNIT * 7,
          };

			db.collection('electricity').add(electricity).then(res => {
				// console.log("res: ", res)
			});
					
        }
      });
    });

// Calculate energy charge every day 00.00
// 1. Get all meter
// 2. Calculate energy charg of each meter
// ((current "ACTIVE_ENERGY" - last "ACTIVE_ENERGY") * 7)
// 3. Decrease topup money of meter's

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.get("/getRole", async (req, res) => {
	const params = req.query

	if (!params.uid) {
		res.status(200).send("Not found uid");
	}

	const uid = params.uid;
    
	// Check is customer or not
	const customersRef = db.collection('customers');
	const snapshot = await customersRef.where("uid", "==", uid).get();
	const customers = [];
	snapshot.forEach(async doc => {
		customers.push(doc.data());
	});

	if (customers.length > 0) {
		res.status(200).jsonp({"role": "customer"});
	}

	// Check other roles
	const userRef = db.collection('user');
	const userSnapshot = await userRef.where("uid", "==", uid).get();
	const users = [];
	userSnapshot.forEach(async doc => {
		users.push(doc.data());
	});

	if (users.length > 0) {
		if (users[0].typeUser === 'ฝ่ายขาย') {
			res.status(200).jsonp({"role": "sale"});
		} else if (users[0].typeUser === 'ฝ่ายบัญชี') {
			res.status(200).jsonp({"role": "account"});
		} else if (users[0].typeUser === 'ฝ่ายซ่อมบำรุง') {
			res.status(200).jsonp({"role": "service"});
		} else {
			res.status(200).jsonp({"role": "noRole"});
		}
		
	}

	res.status(200).send({"role": "noRole"});
})

app.get("/checkDupMeter", async (req, res) => {
	const params = req.query

	if (!params.storeId) {
		res.status(200).send("Not found storeId");
	}

	const storeId = params.storeId;

	const meterRef = db.collection('meter');
	const meterSnapshot = await meterRef.where("storeId", "==", storeId).get();
	const meters = [];
	meterSnapshot.forEach(async doc => {
		meters.push(doc.data());
	});

	if (meters.length > 0) {
		res.status(200).jsonp({"isDup": true});
	}

	res.status(200).jsonp({"isDup": false});
});

exports.api = functions.https.onRequest(app);

