const Ticket = require("../models/Ticket");
// Create Ticket 
const createTicket = async (req, res) => {
    try {
        const {title, description, priority} = req.body;
        const ticket = await Ticket.create({
            title,
            description,
            priority,
            createdBy: req.user.id,
        });
        res.status(201).json(ticket);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};
// Get All Tickets
// const getTickets = async (req, res) => {
//   try {
//     let tickets;

//     if (req.user.role === "user") {
//       tickets = await Ticket.find({ createdBy: req.user.id });
//     } else {
//       tickets = await Ticket.find()
//         .populate("createdBy", "name email")
//         .populate("assignedTo", "name email");
//     }

//     res.json(tickets);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getTickets = async (req, res) => {
  try {
    let tickets;

    // 👤 User يشوف بتاعه فقط
    if (req.user.role === "user") {
      tickets = await Ticket.find({ createdBy: req.user.id })
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");
    }

    // 🧑‍💻 IT و 👑 Admin يشوفوا الكل
    else {
      tickets = await Ticket.find()
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");
    }

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Ticket Status
const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const { title, description, status } = req.body;

    ticket.title = title || ticket.title;
    ticket.description = description || ticket.description;
    ticket.status = status || ticket.status;

    await ticket.save();

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// const updateTicketStatus = async (req, res) => {
//     try {
//         const {status, assignedTo} = req.body;
//         const ticket = await Ticket.findByIdAndUpdate(
//             req.params.id,
//             {status, assignedTo},
//             {new: true}
//         );
//         res.status(201).json(ticket)
//     } catch (err) {
//         res.status(500).json({message: err.message});
//     }
// };

// Delete Ticket
const deleteTicket = async (req, res) => {
  try {

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    await ticket.deleteOne();

    res.json({
      message: "Ticket deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

// ================= Assign Ticket =================
const assignTicket = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Not found" });
    }

    ticket.assignedTo = assignedTo;

    await ticket.save();

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    createTicket,
    getTickets,
    updateTicket,
    deleteTicket,
    assignTicket
}