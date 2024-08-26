import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import "../styles/doctor.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get("https://care-connect-p81e.onrender.com/api/v1/user/doctors", {
        withCredentials: true,
      });
      setDoctors(data.doctors);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch doctors.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const API = `https://care-connect-p81e.onrender.com/api/v1/user/doctor/${id}`;
      const { data } = await axios.delete(API);
      toast.success("Doctor has been deleted successfully");
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete doctor.");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <ToastContainer />
      <section className="page doctors">
        <h1>DOCTORS</h1>
        <div className="banner">
          {doctors && doctors.length > 0 ? (
            doctors.map((element) => (
              <div id="docCard" className="card" key={element._id}>
                <div className="docImg">
                  <img
                    src={element.docAvatar?.url}
                    alt="doctor avatar"
                  />
                  <h4 className="docName">{`${element.firstName} ${element.lastName}`}</h4>
                </div>
                <div className="details">
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Phone: <span>{element.phone}</span>
                  </p>
                  <p>
                    DOB: <span>{element.dob.substring(0, 10)}</span>
                  </p>
                  <p>
                    Department: <span>{element.doctorDepartment}</span>
                  </p>
                  <p>
                    NIC: <span>{element.nic}</span>
                  </p>
                  <p>
                    Gender: <span>{element.gender}</span>
                  </p>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(element._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h1>No Registered Doctors Found!</h1>
          )}
        </div>
      </section>
    </>
  );
};

export default Doctors;
