import { useState } from "react";
import axios from "axios";

const AddClass = () => {
  const [formData, setFormData] = useState({
    class_id: "",
    name: "",
    department: "",
    year: "",
    instructor: "",
    schedule: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:5000/api/classes", formData);
      setMessage("Class added successfully ✅");
      setFormData({
        class_id: "",
        name: "",
        department: "",
        year: "",
        instructor: "",
        schedule: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding class ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background px-4">
      <div className="w-full max-w-lg bg-light-surface dark:bg-dark-surface p-8 rounded-xl shadow-lg border border-light-border dark:border-dark-border">
        <h2 className="text-2xl font-bold mb-6 text-center text-light-textPrimary dark:text-dark-textPrimary">
          Add Class
        </h2>

        {message && (
          <p className="mb-4 text-center text-sm text-light-accent dark:text-dark-accent">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "class_id", placeholder: "Class ID", type: "text" },
            { name: "name", placeholder: "Class Name", type: "text" },
            { name: "department", placeholder: "Department", type: "text" },
            { name: "year", placeholder: "Year", type: "number" },
            {
              name: "instructor",
              placeholder: "Instructor Name",
              type: "text",
            },
            {
              name: "schedule",
              placeholder: "Schedule (e.g., Mon 10-12)",
              type: "text",
            },
          ].map(({ name, placeholder, type }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg border
                bg-light-surface dark:bg-dark-surface
                text-light-textPrimary dark:text-dark-textPrimary
                border-light-border dark:border-dark-border
                placeholder-light-textMuted dark:placeholder-dark-textMuted
                focus:outline-none focus:ring-2
                focus:ring-light-primary dark:focus:ring-dark-primary"
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-semibold text-white
              bg-light-primary dark:bg-dark-primary
              hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover
              transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Add Class"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClass;
