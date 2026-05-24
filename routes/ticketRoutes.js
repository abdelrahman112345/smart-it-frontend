const express = require("express");
const router = express.Router();
const {createTicket, getTickets, updateTicket, deleteTicket, assignTicket} = require("../controllers/ticketController");
const {protect, authorizeRoles} = require("../middleware/authMiddleware");
// Auth Middleware
router.post("/", protect, authorizeRoles("user", "admin"), createTicket);
router.get("/", protect, getTickets);
router.patch("/:id", protect, authorizeRoles("it", "admin"), updateTicket);
router.patch(
  "/assign/:id",
  protect,
  authorizeRoles("it", "admin"),
  assignTicket
);
router.delete("/:id", protect, authorizeRoles("it", "admin"), deleteTicket);

module.exports = router;