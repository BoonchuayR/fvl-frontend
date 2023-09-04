"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorized = void 0;
/**
 * Check user is authorize
 * @param {any} opts role.
 * @Return {boolean}  boolean
 */
function isAuthorized(opts) {
    return (req, res, next) => {
        const { role, email, uid } = res.locals;
        const { id } = req.params;
        if (email === "sa@mail.com") {
            return next();
        }
        if (opts.allowSameUser && id && uid === id) {
            return next();
        }
        if (!role) {
            return res.status(403).send();
        }
        if (opts.hasRole.includes(role)) {
            return next();
        }
        return res.status(403).send();
    };
}
exports.isAuthorized = isAuthorized;
//# sourceMappingURL=authorized.js.map