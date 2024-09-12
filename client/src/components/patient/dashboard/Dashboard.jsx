import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [hospitals, setHospitals] = useState([]);  // State for hospitals
  const [doctors, setDoctors] = useState([]);      // State for doctors in the selected hospital
  const [selectedHospital, setSelectedHospital] = useState(null);  // State for selected hospital
  const [loading, setLoading] = useState(false);   // Loading state
  const [error, setError] = useState(null);        // Error state
  const navigate = useNavigate();
  const auth = useAuth();

  // Function to handle logout
  const handleLogout = () => {
    auth.logout();
    navigate('/patient/login');
  };

  // Function to navigate to the Profile page
  const goProfile = () => {
    navigate('/patient/profile');
  };

  // Function to fetch hospitals from the API
  const fetchHospitals = async () => {
    try {
      setLoading(true); // Set loading state
      const response = await fetch('http://localhost:5000/api/hospitals');
      if (!response.ok) throw new Error('Failed to fetch hospitals');
      const data = await response.json();
      setHospitals(data);  // Set the hospitals data in state
      setError(null); // Clear error
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setError('Error fetching hospitals');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to fetch doctors of a selected hospital from the API
  const fetchDoctors = async (id) => {
    try {
      setLoading(true); // Set loading state
      const response = await fetch(`http://localhost:5000/api/hospitals/${id}`);
      if (!response.ok) throw new Error('Failed to fetch hospital details');
      const data = await response.json();

      // Assuming data.doctors is an array of doctor IDs
      const doctorIds = data.doctors;

      // Fetch details for each doctor by their ID
      const doctorsDetails = await Promise.all(
        doctorIds.map(async (doctorId) => {
          const doctorResponse = await fetch(`http://localhost:5000/api/doctor/profile/${doctorId}`);
          if (!doctorResponse.ok) throw new Error(`Failed to fetch doctor with id ${doctorId}`);
          return await doctorResponse.json(); // Assuming this returns a single doctor's data
        })
      );

      setDoctors(doctorsDetails);  // Set the full doctors data in state
      setSelectedHospital(data.name);  // Set selected hospital name for display
      setError(null); // Clear error
    } catch (error) {
      console.error('Error fetching hospital details or doctors:', error);
      setError('Error fetching hospital details or doctors');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // useEffect to fetch hospitals when the component loads
  useEffect(() => {
    fetchHospitals();
  }, []);

  // Function to go back to the hospitals list
  const goBackToHospitals = () => {
    setDoctors([]);  // Clear the doctors data
    setSelectedHospital(null);  // Clear selected hospital
  };

  // Updated function to handle appointment booking
  const handleappointment = (doctorId) => {
    navigate(`/patient/appointment/${doctorId}`); // No need to cast ObjectId
  };

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <h3>mediConnect</h3>
        <div className="navbar-content">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="header">
          <h2>Welcome to mediConnect Dashboard</h2>
          <button onClick={goProfile} className="profile-btn">View Profile</button>
        </div>

        {/* Show loading spinner or error if needed */}
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}

        {/* Conditional rendering based on whether a hospital is selected */}
        {selectedHospital ? (
          <div className="doctors-list">
            <h3>Doctors at {selectedHospital}</h3>
            <button onClick={goBackToHospitals} className="back-btn">Back to Hospitals</button>
            {doctors.length > 0 ? (
              doctors.map((doctor, index) => {
                return (
                  <div key={index} className="doctor-card" style={{ color: 'black' }}>
                    <h4>{doctor.name ? doctor.name : 'Unknown Name'}</h4>  {/* Fallback if name is missing */}
                    <p>
                      Specialization : {doctor.specialization && doctor.specialization.length > 0 ? (
                        doctor.specialization.map((spec, idx) => (
                          <span key={idx}>
                            {spec}{idx < doctor.specialization.length - 1 && ', '}
                          </span>
                        ))
                      ) : (
                        'N/A'
                      )}
                    </p>
                    <p>Experience : {doctor.experience ? doctor.experience : 'N/A'} years</p>
                    <button className="btn btn-primary" onClick={() => handleappointment(doctor._id)}>
                      Book Appointment
                    </button> {/* Pass doctor ID to handleappointment */}
                  </div>
                );
              })
            ) : (
              <p>No doctors available for this hospital.</p>
            )}
          </div>
        ) : (
          <div className="hospital-grid">
            {hospitals.length > 0 ? (
              hospitals.map((hospital, index) => (
                <div key={index} className="hospital-card" onClick={() => fetchDoctors(hospital._id)}>
                  <h3>{hospital.name}</h3>
                  <p>Location: {hospital.location}</p>
                  <p>Rating: {hospital.rating} ⭐</p>
                </div>
              ))
            ) : (
              <p>Loading hospitals...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
