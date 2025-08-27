import React, { useState } from "react";

function PurchaseRequestManager() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    hardware: "",
    software: "",
    reason: "",
    requester: "",
    date: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.hardware || !form.software || !form.requester) return;
    setRequests([...requests, { ...form }]);
    setForm({ hardware: "", software: "", reason: "", requester: "", date: "" });
  };

  return (
    <div>
      <h2>구매요청 등록</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <input name="hardware" placeholder="하드웨어" value={form.hardware} onChange={handleChange} required />
        <input name="software" placeholder="소프트웨어" value={form.software} onChange={handleChange} required />
        <input name="reason" placeholder="요청 사유" value={form.reason} onChange={handleChange} />
        <input name="requester" placeholder="요청자" value={form.requester} onChange={handleChange} required />
        <input name="date" type="date" value={form.date} onChange={handleChange} />
        <button type="submit">요청 등록</button>
      </form>
      <h3>구매요청 목록</h3>
      <ul>
        {requests.map((req, idx) => (
          <li key={idx}>
            {req.hardware} / {req.software} / {req.reason} / {req.requester} / {req.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PurchaseRequestManager; 