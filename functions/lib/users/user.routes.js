"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const user_controller_1 = require("./user.controller");
const authenticated_1 = require("../auth/authenticated");
const authorized_1 = require("../auth/authorized");
/**
 * User routes
 * @param {Application} app application.
 */
function userRoutes(app) {
    app.post("/users", authenticated_1.isAuthenticated, (0, authorized_1.isAuthorized)({ hasRole: ["admin"] }), user_controller_1.create);
    // lists all users
    app.get("/users", [
        authenticated_1.isAuthenticated,
        (0, authorized_1.isAuthorized)({ hasRole: ["admin"] }),
        user_controller_1.all,
    ]);
    // get :id user
    app.get("/users/:id", [
        authenticated_1.isAuthenticated,
        (0, authorized_1.isAuthorized)({ hasRole: ["admin"], allowSameUser: true }),
        user_controller_1.get,
    ]);
    // updates :id user
    app.patch("/users/:id", [
        authenticated_1.isAuthenticated,
        (0, authorized_1.isAuthorized)({ hasRole: ["admin"], allowSameUser: true }),
        user_controller_1.patch,
    ]);
    // deletes :id user
    app.delete("/users/:id", [
        authenticated_1.isAuthenticated,
        (0, authorized_1.isAuthorized)({ hasRole: ["admin"] }),
        user_controller_1.remove,
    ]);
}
exports.userRoutes = userRoutes;
//# sourceMappingURL=user.routes.js.map