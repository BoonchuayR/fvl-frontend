import {Request, Response} from "express";
import * as admin from "firebase-admin";


/**
 * List all users
 * @param {Request} req request.
 * @param {Response} res response.
 */
export async function checkDupMeter(req: Request, res: Response) {
  try {
    const params = req.query;

    if (!params.boothId) {
      res.status(200).send("Not found boothId");
    }

    const boothId = params.boothId;
    const meterRef = admin.firestore().collection("meter");
    const meterSnapshot = await meterRef.where("boothId", "==", boothId).get();
    const meters = [];
    meterSnapshot.forEach(async (doc) => {
      meters.push(doc.data());
    });

    if (meters.length > 0) {
      res.status(200).jsonp({"isDup": true});
    }
    return res.status(200).jsonp({"isDup": false});
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * Handler error
 * @param {Request} res response.
 * @param {any} err error.
 * @Return {any} error
 */
function handleError(res: Response, err: any): any {
  return res.status(500).send({message: `${err.code} - ${err.message}`});
}
