import React, { useState } from "react";

function SoftwareManager() {
  const [softwareList, setSoftwareList] = useState([]);
  const [form, setForm] = useState({ name: "", version: "", license: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.version) return;
    setSoftwareList([...softwareList, { ...form }]);
    setForm({ name: "", version: "", license: "" });
  };

  return (
    <div>
      <h2>소프트웨어 등록</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <input name="name" placeholder="이름" value={form.name} onChange={handleChange} required />
        <input name="version" placeholder="버전" value={form.version} onChange={handleChange} required />
        <input name="license" placeholder="라이선스" value={form.license} onChange={handleChange} />
        <button type="submit">등록</button>
      </form>
      <h3>등록된 소프트웨어 목록</h3>
      <ul>
        {softwareList.map((sw, idx) => (
          <li key={idx}>{sw.name} / {sw.version} / {sw.license}</li>
        ))}
      </ul>
    </div>
  );
}

export default SoftwareManager; 