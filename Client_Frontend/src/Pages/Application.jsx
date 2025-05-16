import axios from "axios";
import { memo, useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from 'sweetalert2';
import baseURL from "../config/axiosPortConfig";
import SessionTimeout from "../protected/SessionTimeout";

function Application() {
  // const [applications, setApplications] = useState([
  //   {
  //     id: 1,
  //     jobTitle: "Software Engineer",
  //     company: "Tech Solutions Ltd",
  //     status: "Pending",
  //   },
  //   {
  //     id: 2,
  //     jobTitle: "Marketing Specialist",
  //     company: "Digital Marketing Pro",
  //     status: "Accepted",
  //   },
  // ]); 

  const [applications, setApplications] = useState([]);
  const [currentViewedJobApplication, setCurrentViewedJobApplication] = useState({});
  const [systemUserId, setSystemUserId] = useState('');
  const {jobApplicationId} = useParams();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [resume, setResume] = useState(null);
  const [currentCV, setCurrentCV] = useState('');

  const navigate = useNavigate();
  
  useEffect(() => {
    console.log(jobApplicationId);

    if(jobApplicationId) {
      fetchJobApplicationData(jobApplicationId);

      if(systemUserId) {
        fetchAllJobApplicationsRelatedToUser(systemUserId);
      }
    } 

  }, [jobApplicationId, systemUserId]);

  const fetchJobApplicationData = useCallback(async (id) => {
    try {
      const fetchJobApplicationData = await axios.get(`${baseURL}/api/jobapplications/application/${id}`);
      console.log(fetchJobApplicationData.data);
      if(fetchJobApplicationData.status == 200) {
        console.log(fetchJobApplicationData.data.data);
        console.log(fetchJobApplicationData.data.data[0].userId);
        setCurrentViewedJobApplication(fetchJobApplicationData.data.data[0]);
        setSystemUserId(fetchJobApplicationData.data.data[0].userId);
        setCurrentCV(fetchJobApplicationData.data.data[0].resume);
        // set state for application data ...
        setFirstName(fetchJobApplicationData.data.data[0].firstName);
        setLastName(fetchJobApplicationData.data.data[0].lastName);
        setEmail(fetchJobApplicationData.data.data[0].email);
        setPhoneNumber(fetchJobApplicationData.data.data[0].phoneNumber);
      } else {
        toast.error('Applied Jobs Loading Failed');
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }, [currentViewedJobApplication, systemUserId, currentCV, firstName, lastName, email, phoneNumber]); 

  const viewCurrentCV = useCallback(() => {
    console.log(currentCV);
    let cvLink
    const patternRelatedToPath = 'uploads\\appliedJobs\\resumes\\';
    if(currentCV.includes(patternRelatedToPath)) {
      cvLink = `${baseURL}/${currentCV}`;
    } else {
      cvLink = `${baseURL}/uploads/appliedJobs/resumes/${currentCV}`;
    }
    console.log(cvLink);
    window.open(cvLink, '_blank');
  }, [currentCV]);

  const fetchAllJobApplicationsRelatedToUser = useCallback(async (id) => {
    try {
      const fetchUserJobApplicationsData = await axios.get(`${baseURL}/api/jobapplications/applications/user/${id}`);
      console.log(fetchUserJobApplicationsData.data);
      if(fetchUserJobApplicationsData.status == 200) {
        console.log(fetchUserJobApplicationsData.data.data);
        setApplications(fetchUserJobApplicationsData.data.data);
      } else {
        toast.error('Applied Jobs Loading Failed');
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }, [applications]);

  const handleResume = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setResume(selectedFile); 
      // setCVSelected(true);
    }
  }, [resume]);

  const updateJobApplication = useCallback(async () => {
    if(!jobApplicationId) {
      toast.error('Error Occured While Updating Job Application');
      return;
    }
    
    if(!firstName || !lastName || !email || !phoneNumber) {
      toast.error('Please fill all the fields');
      return;
    } 

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('resume', resume);

    Swal.fire({
      title: 'Confirmation About Updating Job Application Data',
      text: 'Are you sure you want to update your job application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Update Application Data'
    }).then(async (result) => {
      if(result.isConfirmed) {
        try {
          const updateApplicationResponse = await axios.put(`${baseURL}/api/jobapplications/update/${jobApplicationId}`, formData);
          console.log(updateApplicationResponse.data);
          if(updateApplicationResponse.status == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Application Updated!',
              text: 'Job application updated successfully!',
              confirmButtonColor: '#3085d6',
            }).then((result) => {
              if (result.isConfirmed) {
                // window.location.reload();
                navigate('/dashboard');
              }
            });
          } else {
            toast.error('Error Updating Job Application');
            return;
          }
        } catch (error) {
          console.error();
          return;
        }
      }
    });
  }, [firstName, lastName, email, phoneNumber, resume]); 

  const removeJobApplication = useCallback(() => {
    if(!jobApplicationId) {
      toast.error('Error Occured While Updating Job Application');
      return;
    }

    Swal.fire({
      title: 'Confirmation About Removing Job Application Data',
      text: 'Are you sure you want to remove your job application?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Remove Application'
    }).then(async (result) => {
      if(result.isConfirmed) {
        try {
          const removeApplicationResponse = await axios.delete(`${baseURL}/api/jobapplications/delete/${jobApplicationId}`);
          console.log(removeApplicationResponse.data);
          if(removeApplicationResponse.status == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Application Removed!',
              text: 'Job application removed successfully!',
              confirmButtonColor: '#3085d6',
            }).then((result) => {
              if (result.isConfirmed) {
                // window.location.reload();
                navigate('/dashboard');
              }
            });
          } else {
            toast.error('Error Removing Job Application');
            return;
          }
        } catch (error) {
          console.error();
          return;
        }
      }
    });
  }, [jobApplicationId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer/>
      {/* Session timeout logic will run in background */}
      <SessionTimeout />
      {/* Header */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800">My Applications</h2>
        <p className="text-gray-500 mt-2">Manage your job applications here.</p>
      </div>

      {/* Application Form */}
      <div className="max-w-5xl mx-auto mt-6 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800">Update Job Application</h3>
        <form className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Job Title"
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled
            value={ currentViewedJobApplication.jobName ? currentViewedJobApplication.jobName : '' }
          />
          <input
            type="text"
            placeholder="Company Name"
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled
            value={ currentViewedJobApplication.company ? currentViewedJobApplication.company : '' }
          />
          <input
            type="text"
            placeholder="First Name"
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={ firstName ? firstName : '' }
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={ lastName ? lastName : '' }
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={ email ? email : '' }
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={ phoneNumber ? phoneNumber : '' }
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <input
            type="file"
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={handleResume}
          />
          <button className="bg-green-600 hover:bg-green-700 rounded-md text-white font-bold" onClick={viewCurrentCV}>
            View Previously Uploaded CV
          </button>
          <button
            type="button"
            className="col-span-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            onClick={updateJobApplication}
          >
            Update Application
          </button>
          <button
            type="button"
            className="col-span-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
            onClick={removeJobApplication}
          >
            Remove Application
          </button>
        </form>
      </div>

      {/* Submitted Applications List */}
      <div className="max-w-5xl mx-auto mt-6 bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800">Submitted Applications</h3>
        <ul className="mt-4 space-y-4">
          {applications ? applications.map((app) => (
            <li
              key={app.applicationId}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{app.jobName}</h4>
                <p className="text-gray-500">{app.company}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  app.status === "Accepted"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {app.status}
              </span>
            </li>
          )) : (
            <p className="text-center">No submitted Applications</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default memo(Application);
