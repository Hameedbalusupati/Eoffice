import { useEffect, useState } from "react";
import API from "../../services/api"; // ✅ use your api.js

export default function TeachingSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    class_name: "",
    day: "",
    time: "",
  });

  // =========================
  // 📥 FETCH DATA
  // =========================
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/teaching-schedule");
      setSchedules(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // =========================
  // ✏️ HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // ➕ ADD SCHEDULE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/api/teaching-schedule", formData);

      // reset form
      setFormData({
        subject: "",
        class_name: "",
        day: "",
        time: "",
      });

      fetchSchedules();
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // =========================
  // ❌ DELETE SCHEDULE
  // =========================
  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/teaching-schedule/${id}`);
      fetchSchedules();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">
        Teaching Schedule
      </h1>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="class_name"
          placeholder="Class"
          value={formData.class_name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <select
          name="day"
          value={formData.day}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Day</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
        </select>

        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Schedule
        </button>
      </form>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p className="text-gray-500">Loading schedules...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Subject</th>
                <th className="p-2 border">Class</th>
                <th className="p-2 border">Day</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {schedules.length > 0 ? (
                schedules.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{item.subject}</td>
                    <td className="p-2 border">{item.class_name}</td>
                    <td className="p-2 border">{item.day}</td>
                    <td className="p-2 border">{item.time}</td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No schedules found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}