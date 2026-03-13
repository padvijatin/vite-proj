const express = require("express");
const adminController = require("../controllers/admin-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");
const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.route("/users").get(adminController.getAllusers);
router
  .route("/users/:id")
  .patch(adminController.updateUserById)
  .delete(adminController.deleteUserById);

router.route("/contacts").get(adminController.getAllContacts);
router
  .route("/contacts/:id")
  .patch(adminController.updateContactById)
  .delete(adminController.deleteContactById);
router.route("/services").get(adminController.getAllServices);
router
  .route("/services/:id")
  .patch(adminController.updateServiceById)
  .delete(adminController.deleteServiceById);

module.exports = router;
