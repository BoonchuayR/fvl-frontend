const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const request = require("request-promise");
const moment = require("moment");
const cors = require('cors');
const express = require('express');
const { user } = require("firebase-functions/v1/auth");

initializeApp();

const app = express();

const db = getFirestore();

// exports.scheduledFunction = functions.pubsub.schedule("* * * * *")
//     .timeZone("Asia/Bangkok")
//     .onRun(async (context) => {
//     //   console.info("This will be run every minute!");

//     // db.collection("customers").get().then((documentSnapshot) => {
// 	// 	let data = documentSnapshot.data;
//   	// 	console.log(`Retrieved data: ${JSON.stringify(data)}`);
//     // });

// 		const customersRef = db.collection('customers');
// 		const shopRef = db.collection('shop');
		
// 		const snapshot = await customersRef.get();
// 		snapshot.forEach(async doc => {
// 			console.info(`Customer ${doc.id} `, '=>', doc.data());
// 			customer = doc.data;
// 			uid = customer.uid;

// 			// Get customer's shop
// 			const shopSnapshot = await shopRef.where('uid', '==', uid).get();
// 			if (shopSnapshot.empty) {
// 				console.log('No matching documents.');
// 				return;
// 			}  

// 			shopSnapshot.forEach(doc => {
// 				const shop = doc.data();
// 				console.log(`Customer[${customer.custName}], Shop[${shop.boothName}]`);
// 			});
// 		});

// 		// console.info("snapshot >>> ", snapshot);

//       	const bodyReq = {
//         CMD_TYPE: "METER_SELECT",
// 				CMD_TOKEN: "a7e1b49f6dbdd1579de1929af0d7c303",
// 				CMD_PARAMS: [
// 					"STORE_ID",
// 					"DEVICE_ZONE",
// 					"DEVICE_ID",
// 					"SERIAL_NO",
// 					"SLAVE_ID",
// 					"MODEL_SPEC",
// 					"LINE_VOLTAGE",
// 					"LINE_FREQUENCY",
// 					"LINE_CURRENT",
// 					"ACTIVE_POWER",
// 					"ACTIVE_ENERGY",
// 					"UPDATE_DATETIME",
// 					"METER_STATE",
// 					"UPDATE_STATE_DATETIME",
// 					"METER_STATE_ADMIN",
// 					"UPDATE_STATE_ADMIN_DATETIME",
// 					"METER_STATE_PREVIOUS_UNIT",
// 					"METER_STATE_CALCULATE_UNIT"
// 				],
// 				STORE_ID: ["*"]
//       };

//       return request({
//         method: "POST",
//         uri: "https://www.k-tech.co.th/foodvilla/meter/api/controller.php",
//         body: bodyReq,
//         json: true,
//       }).then((meters) => {
// 				const meterData = meters.DATA;
// 				// console.log("meterData: ", meterData);
//         for (let i = 0; i < 100; i++) {
//           const electricity = {
//             storeId: meterData[i].STORE_ID,
//             date: moment().format("YYYY-MM-DD hh:mm:ss"),
//             priviousUnit: meterData[i].METER_STATE_PREVIOUS_UNIT,
//             calculateUnit: meterData[i].METER_STATE_CALCULATE_UNIT,
//             charge: +meterData[i].METER_STATE_CALCULATE_UNIT * 7,
//           };

// 			db.collection('electricity').add(electricity).then(res => {
// 				// console.log("res: ", res)
// 			});
					
//         }
//       });
//     });

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

// TODO: [Bento] Create get all users API
app.get("/users", async (req, res) => {

	// res.status(200).jsonp({"message": "success"})

	const userRef = db.collection('user');
	const usersSnapshot = await userRef.get();
	const users = [];

	usersSnapshot.forEach(async doc => {
		users.push(doc.data());
	});

	res.status(200).jsonp({
		"result": "success",
		"data": users
	});
});




// TODO: [Bento] Create get all customers API


app.get("/customers", async (req, res) => {

	// res.status(200).jsonp({"message": "success"})

	const customerRef = db.collection('customers');
	const customersSnapshot = await customerRef.get();
	const customers = [];

	customersSnapshot.forEach(async doc => {
		customers.push(doc.data());
	});

	res.status(200).jsonp({
		"result": "success",
		"data": customers
	});
});

// TODO: [Bento] Create get all shops API


app.get("/shops", async (req, res) => {

	// res.status(200).jsonp({"message": "success"})

	const shopRef = db.collection('shop');
	const shopsSnapshot = await shopRef.get();
	const shops = [];

	shopsSnapshot.forEach(async doc => {
		shops.push(doc.data());
	});

	res.status(200).jsonp({
		"result": "success",
		"data": shops
	});
});

// TODO: [Bento] Create get all meters API

app.get("/meters", async (req, res) => {

	// res.status(200).jsonp({"message": "success"})

	const meterRef = db.collection('meter');
	const metersSnapshot = await meterRef.get();
	const meters = [];

	metersSnapshot.forEach(async doc => {
		meters.push(doc.data());
	});

	res.status(200).jsonp({
		"result": "success",
		"data": meters
	});
});

// TODO: [Bento] Create get all topups API

app.get("/topups", async (req, res) => {

	// res.status(200).jsonp({"message": "success"})

	const topupRef = db.collection('topup');
	const topupsSnapshot = await topupRef.get();
	const topups = [];

	topupsSnapshot.forEach(async doc => {
		topups.push(doc.data());
	});

	res.status(200).jsonp({
		"result": "success",
		"data": topups
	});
});

// TODO: [Bento] Create get all repairing services API

app.get("/service", async (req, res) => {

	// res.status(200).jsonp({"message": "success"})

	const repairingRef = db.collection('tickets');
	const repairSnapshot = await repairingRef.get();
	const repair = [];

	repairSnapshot.forEach(async doc => {
		repair.push(doc.data());
	});

	res.status(200).jsonp({
		"result": "success",
		"data": repair
	});
});

app.post("/customercurrentmoney", async (req, res) => {

	// res.status(200).jsonp({"message": "success"})

	const repairingRef = db.collection('customers');
	const repairSnapshot = await repairingRef.post();
	const repair = [];

	repairSnapshot.forEach(async doc => {
		repair.post(doc.data());
	});
	res.status(200).jsonp({
		"result": "success",
		"data": repair
	});
});

exports.api = functions.https.onRequest(app);

