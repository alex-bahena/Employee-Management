const router = require("express").Router();
const Event = require("../../models/EventModel");
const authenticate = require("../middleware/authenticate");
const isAdmin = require("../middleware/isAdmin");
const validateEventInput = require("../middleware/validateEventInput"); // Assuming you have this

// Get all events
router.get("/", authenticate, isAdmin, async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

// Create a new event
router.post(
  "/",
  [authenticate, validateEventInput, isAdmin],
  async (req, res) => {
    try {
      const newEvent = await Event.create(req.body);
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

// Update an event
router.put(
  "/:id",
  [authenticate, validateEventInput, isAdmin],
  async (req, res) => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).send("Event not found");
      }

      // Update event details
      event.title = req.body.title || event.title;
      event.description =
        req.body.description !== undefined
          ? req.body.description
          : event.description;
      event.start_date = req.body.start_date || event.start_date;
      event.end_date = req.body.end_date || event.end_date;
      event.all_day =
        req.body.all_day !== undefined ? req.body.all_day : event.all_day;
      event.event_type = req.body.event_type || event.event_type;
      event.hours = req.body.hours !== undefined ? req.body.hours : event.hours;

      await event.save();
      res.json({ message: "Event updated successfully" });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

// Delete an event (admin or super_admin only)
router.delete("/:id", [authenticate, isAdmin], async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).send("Event not found");
    }

    await event.destroy();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
