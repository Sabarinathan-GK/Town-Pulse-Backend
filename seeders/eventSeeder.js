
const Event = require("../models/Event");
const User = require("../models/User");
const defaultEvents = require("../data/defaultEvents");

const seedDefaultEvents = async () => {
  try {
    // Check whether events already exist
    const eventCount = await Event.countDocuments();

    if (eventCount > 0) {
      console.log("Events already exist. Skipping default event seeding.");
      return;
    }

    // Find an existing admin user
    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      console.warn(
        "No admin user found. Default events were not inserted."
      );
      return;
    }

    // Map static event data to the Event schema
    const eventsToInsert = defaultEvents.map((event) => ({
      eventName: event.eventName,
      description: event.description,
      category: event.category,
      dateTime: event.dateTime,
      location: event.location,
      price: event.price || 0,
      priceCategory: event.price > 0 ? "Paid" : "Free",
      bannerImage: event.bannerImage || "",
      coverImage: event.coverImage || "",
      eventTags: event.eventTags || [],
      featured: event.featured || false,
      recommended: event.recommended || false,
      interestedPeopleCount: event.interestedPeopleCount || 0,
      organizedBy: event.organizedBy || "",
      createdBy: admin._id,
    }));

    // Insert all default events
    await Event.insertMany(eventsToInsert);

    console.log(
      `${eventsToInsert.length} default events inserted successfully.`
    );
  } catch (error) {
    console.error("Default event seeding failed:", error.message);
    throw error;
  }
};

module.exports = seedDefaultEvents;
