"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const admin = require("firebase-admin");
/**
 * Authenticate user
 * @param {Request} req request.
 * @param {Response} res response.
 * @param {any} next next.
 */
async function isAuthenticated(req, res, next) {
    const { authorization } = req.headers;
    console.log("authorization >>> ", authorization);
    if (!authorization) {
        return res.status(401).send({ message: "Unauthorized" });
    }
    console.log("headers have authorization");
    if (!authorization.startsWith("Bearer")) {
        return res.status(401).send({ message: "Unauthorized" });
    }
    console.log("Start with Bearer");
    const split = authorization.split("Bearer ");
    if (split.length !== 2) {
        return res.status(401).send({ message: "Unauthorized" });
    }
    const token = split[1];
    try {
        const decodedToken = await admin
            .auth()
            .verifyIdToken(token);
        console.log("decodedToken", JSON.stringify(decodedToken));
        res.locals = Object.assign(Object.assign({}, res.locals), { uid: decodedToken.uid, role: decodedToken.role, email: decodedToken.email });
        return next();
    }
    catch (err) {
        console.error(`${err.code} -  ${err.message}`);
        return res.status(401).send({ message: "Unauthorized" });
    }
}
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=authenticated.js.map