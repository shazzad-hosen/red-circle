import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toggleAvailability, updateDonation } from "../api/user.api";

const Profile = () => {
  const { user, setUser } = useAuth(); // get user from context
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loadingDonation, setLoadingDonation] = useState(false);
  const [error, setError] = useState("");

  // Toggle availability
  const handleAvailability = async () => {
    setLoadingAvailability(true);
    setError("");

    try {
      const newStatus = !user.isAvailable;
      await toggleAvailability(newStatus);
      setUser({ ...user, isAvailable: newStatus }); // update context
    } catch (err) {
      setError(err);
    } finally {
      setLoadingAvailability(false);
    }
  };

  // Update donation
  const handleDonation = async () => {
    setLoadingDonation(true);
    setError("");

    try {
      const now = new Date().toISOString();
      await updateDonation({ lastDonationAt: now });
      setUser({ ...user, lastDonationAt: now });
    } catch (err) {
      setError(err);
    } finally {
      setLoadingDonation(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>

      {error && <p className="text-red-600">{error}</p>}

      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4">
        <Info label="Name" value={user.name} />
        <Info label="Email" value={user.email} />
        <Info label="Blood Group" value={user.bloodGroup} />
        <Info label="Location" value={user.location} />
        <Info label="Phone" value={user.phone} />

        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-semibold">Availability:</span>
          <button
            onClick={handleAvailability}
            disabled={loadingAvailability}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              user.isAvailable
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            } disabled:opacity-50`}
          >
            {loadingAvailability
              ? "Updating..."
              : user.isAvailable
              ? "Available"
              : "Unavailable"}
          </button>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-semibold">Last Donation:</span>
          <button
            onClick={handleDonation}
            disabled={loadingDonation}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
          >
            {loadingDonation
              ? "Updating..."
              : user.lastDonationAt
              ? new Date(user.lastDonationAt).toLocaleDateString()
              : "Add Donation"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Info display component
const Info = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}:</span>
    <span className="font-semibold">{value || "-"}</span>
  </div>
);

export default Profile;
