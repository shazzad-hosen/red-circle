import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bloodGroup: "",
    location: {
      city: "",
    },
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "city") {
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, city: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/profile");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-5 sm:p-6 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
          Create Account
        </h2>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* Blood Group */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-600">Blood Group</label>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              required
              className="border rounded-xl px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select blood group</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </div>

          <Input
            label="City"
            name="city"
            value={form.location.city}
            onChange={handleChange}
            required
          />

          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Optional"
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2.5 rounded-xl
              bg-red-600 hover:bg-red-700
              text-white font-semibold
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-red-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

// Reusable Input component
const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm text-gray-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="
        border rounded-xl px-3 py-2
        text-sm sm:text-base
        focus:outline-none
        focus:ring-2 focus:ring-red-500
      "
    />
  </div>
);

export default Register;