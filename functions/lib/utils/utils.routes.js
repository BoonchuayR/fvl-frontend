"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utilRoutes = void 0;
const util_controller_1 = require("./util.controller");
const authenticated_1 = require("../auth/authenticated");
const authorized_1 = require("../auth/authorized");
/**
 * User routes
 * @param {Application} app application.
 */
function utilRoutes(app) {
    // lists all users
    app.get("/checkDupMeter", [
        authenticated_1.isAuthenticated,
        (0, authorized_1.isAuthorized)({ hasRole: ["admin"] }),
        util_controller_1.checkDupMeter,
    ]);
}
exports.utilRoutes = utilRoutes;
//# sourceMappingURL=utils.routes.js.map