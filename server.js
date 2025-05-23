const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory SOS data store
let sosList = [];

// Dummy location coordinates by pincode (can be expanded)
const dummyLocations = {
  "110001": { lat: 28.6304, lng: 77.2177 }, // New Delhi
  "560001": { lat: 12.9716, lng: 77.5946 }, // Bangalore
  "400001": { lat: 18.9398, lng: 72.8355 }, // Mumbai
};

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Create SOS
app.post("/api/sos", (req, res) => {
  const { name, phone, place, pincode, message, people_count } = req.body;

  if (!name || !phone || !place || !pincode || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const location = dummyLocations[pincode] || { lat: 20.5937, lng: 78.9629 };

  const newSOS = {
    id: generateId(),
    name,
    phone,
    place,
    pincode,
    message,
    people_count,
    status: "Pending",
    volunteer: null,
    location,
  };

  sosList.push(newSOS);
  res.status(201).json({ message: "SOS created", sos: newSOS });
});

// Get all SOS
app.get("/api/sos", (req, res) => {
  res.json(sosList);
});

// Assign volunteer
app.post("/api/sos/:id/assign", (req, res) => {
  const sosId = req.params.id;
  const { volunteerName, volunteerPhone } = req.body;

  const sos = sosList.find((s) => s.id === sosId);
  if (!sos) {
    return res.status(404).json({ error: "SOS not found" });
  }

  sos.volunteer = {
    name: volunteerName,
    phone: volunteerPhone,
  };
  sos.status = "Assigned";

  res.json({ message: "Volunteer assigned", sos });
});

// Start server
app.listen(PORT, () => {
  console.log('Server running on http://localhost:${5000}');
});