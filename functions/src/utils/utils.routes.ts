import {Application} from "express";
import {checkDupMeter} from "./util.controller";
import {isAuthenticated} from "../auth/authenticated";
import {isAuthorized} from "../auth/authorized";

/**
 * User routes
 * @param {Application} app application.
 */
export function utilRoutes(app: Application) {
  // lists all users
  app.get("/checkDupMeter", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin"]}),
    checkDupMeter,
  ]);
}
