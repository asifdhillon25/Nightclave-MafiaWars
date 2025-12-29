import { useState } from "react";
import axios from "axios";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    student_id: "",
    name: "",
    roll_no: "",
    email: "",
    department: "",
    year: "",
    photo_url: "",
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
      await axios.post("http://localhost:5000/api/students", formData);
      setMessage("Student added successfully ✅");
      setFormData({
        student_id: "",
        name: "",
        roll_no: "",
        email: "",
        department: "",
        year: "",
        photo_url: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding student ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background px-4">
      <div className="w-full max-w-lg bg-light-surface dark:bg-dark-surface p-8 rounded-xl shadow-lg border border-light-border dark:border-dark-border">
        <h2 className="text-2xl font-bold mb-6 text-center text-light-textPrimary dark:text-dark-textPrimary">
          Add Student
        </h2>

        {message && (
          <p className="mb-4 text-center text-sm text-light-accent dark:text-dark-accent">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "student_id", placeholder: "Student ID", type: "text" },
            { name: "name", placeholder: "Name", type: "text" },
            { name: "roll_no", placeholder: "Roll No", type: "text" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "department", placeholder: "Department", type: "text" },
            { name: "year", placeholder: "Year", type: "number" },
            { name: "photo_url", placeholder: "Photo URL (optional)", type: "text" },
          ].map(({ name, placeholder, type }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              required={name !== "photo_url"}
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
            {loading ? "Saving..." : "Add Student"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
