import {Request, Response} from "express";
import * as admin from "firebase-admin";

/**
 * Authenticate user
 * @param {Request} req request.
 * @param {Response} res response.
 * @param {any} next next.
 */
export async function isAuthenticated(req: Request, res: Response, next: any) {
  const {authorization} = req.headers;

  console.log("authorization >>> ", authorization);

  if (!authorization) {
    return res.status(401).send({message: "Unauthorized"});
  }

  console.log("headers have authorization");

  if (!authorization.startsWith("Bearer")) {
    return res.status(401).send({message: "Unauthorized"});
  }

  console.log("Start with Bearer");

  const split = authorization.split("Bearer ");
  if (split.length !== 2) {
    return res.status(401).send({message: "Unauthorized"});
  }

  const token = split[1];

  try {
    const decodedToken: admin.auth.DecodedIdToken = await admin
      .auth()
      .verifyIdToken(token);
    console.log("decodedToken", JSON.stringify(decodedToken));
    res.locals = {
      ...res.locals,
      uid: decodedToken.uid,
      role: decodedToken.role,
      email: decodedToken.email,
    };
    return next();
  } catch (err: any) {
    console.error(`${err.code} -  ${err.message}`);
    return res.status(401).send({message: "Unauthorized"});
  }
}
