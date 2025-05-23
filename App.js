import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    place: "",
    pincode: "",
    message: "",
    people_count: 1,
  });

  const [sosList, setSosList] = useState([]);
  const [volunteer, setVolunteer] = useState({
    name: "",
    phone: "",
    sosId: "",
  });

  // Fetch SOS list
  useEffect(() => {
    fetchSOSList();
    const interval = setInterval(fetchSOSList, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchSOSList = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sos");
      setSosList(res.data);
    } catch (error) {
      console.error("Error fetching SOS list", error);
    }
  };

  // Send SOS
  const sendSOS = async () => {
    try {
      await axios.post("http://localhost:5000/api/sos", form);
      alert("SOS sent successfully!");
      setForm({
        name: "",
        phone: "",
        place: "",
        pincode: "",
        message: "",
        people_count: 1,
      });
      fetchSOSList();
    } catch (error) {
      alert("Failed to send SOS");
      console.error(error);
    }
  };

  

  // Assign Volunteer
  const assignVolunteer = async () => {
    try {
      // eslint-disable-next-line no-template-curly-in-string
      await axios.post( 'http://localhost:5000/api/sos/${volunteer.sosId}/assign', {
        volunteerName: volunteer.name,
        volunteerPhone: volunteer.phone,
      });
      alert("Volunteer assigned successfully!");
      setVolunteer({ name: "", phone: "", sosId: "" });
      fetchSOSList();
    } catch (error) {
      alert("Failed to assign volunteer");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Disaster Relief SOS System</h1>

      <div className="form-section">
        <h2>Send SOS</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Place Name"
          value={form.place}
          onChange={(e) => setForm({ ...form, place: e.target.value })}
        />
        <input
          type="text"
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
        />
        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <input
          type="number"
          placeholder="Number of People"
          value={form.people_count}
          onChange={(e) => setForm({ ...form, people_count: e.target.value })}
        />
        <button onClick={sendSOS}>Send SOS</button>
      </div>

      <div className="form-section">
        <h2>Assign Volunteer</h2>
        <select
          value={volunteer.sosId}
          onChange={(e) => setVolunteer({ ...volunteer, sosId: e.target.value })}
        >
          <option value="">Select SOS</option>
          {sosList.map((sos) => (
            <option key={sos.id} value={sos.id}>
              {sos.name} - {sos.place} ({sos.status})
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Volunteer Name"
          value={volunteer.name}
          onChange={(e) => setVolunteer({ ...volunteer, name: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Volunteer Phone"
          value={volunteer.phone}
          onChange={(e) => setVolunteer({ ...volunteer, phone: e.target.value })}
        />
        <button onClick={assignVolunteer}>Assign Volunteer</button>
      </div>

      <div className="form-section">
        <h2>Active SOS Requests</h2>
        {sosList.length === 0 ? (
          <p>No SOS requests yet.</p>
        ) : (
          sosList.map((sos) => (
            <div
              // eslint-disable-next-line no-template-curly-in-string
              className={'sos-card ${sos.status === "Assigned" ? "assigned" : ""}'}
              key={sos.id}
            >
              <h3>{sos.name} ({sos.place})</h3>
              <div className="sos-details">
                <p>Phone: {sos.phone}</p>
                <p>Pincode: {sos.pincode}</p>
                <p>Message: {sos.message}</p>
                <p>People: {sos.people_count}</p>
                <p>Status: <strong>{sos.status}</strong></p>
                {sos.volunteer && (
                  <p>Assigned Volunteer: {sos.volunteer.name} ({sos.volunteer.phone})</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;