import { useParams } from "react-router-dom";
import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { Briefcase, MapPin, Clock, DollarSign, Calendar, ArrowLeft } from "lucide-react";
import { verifyEmail, verifyPhoneNumber } from "../scripts/verifyData";
import { useChangeDateFormat } from "../hooks/customHooks";
import baseURL from "../config/axiosPortConfig";
import SessionTimeout from "../protected/SessionTimeout";

// const jobData = [
//   {
//     id: 1,
//     title: "Senior Software Engineer",
//     company: "Tech Solutions Ltd",
//     location: "Colombo",
//     jobType: "Full-time",
//     salaryRange: "$3000-$5000",
//     postedDate: "March 5, 2025",
//     description:
//       "Looking for an experienced software engineer to lead our development team. Join our innovative company to create cutting-edge solutions that transform the way businesses operate in the digital space.",
//     responsibilities: [
//       "Develop and maintain software applications",
//       "Lead a team of junior developers",
//       "Ensure best coding practices are followed",
//       "Collaborate with product managers to define feature requirements",
//       "Participate in code reviews and architectural decisions"
//     ],
//     requirements: [
//       "5+ years of experience in software development",
//       "Proficiency in React, Node.js, and TypeScript",
//       "Strong problem-solving skills",
//       "Experience with cloud platforms (AWS/Azure/GCP)",
//       "Bachelor's degree in Computer Science or related field"
//     ],
//     benefits: [
//       "Competitive salary and performance bonuses",
//       "Flexible work arrangements",
//       "Health insurance and wellness programs",
//       "Professional development opportunities",
//       "Modern office with great facilities"
//     ],
//     companyDescription: "Tech Solutions Ltd is a leading software development company specializing in enterprise solutions. With over 10 years in the industry, we've helped hundreds of businesses transform their digital presence."
//   },
//   // Add more job listings as needed
// ];

function JobDetails() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  // const job = jobs.find((job) => job.id === parseInt(jobId));
  const [isApplying, setIsApplying] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cv, setCV] = useState(null);
  const navigate = useNavigate();

  useEffect (() => {
    if(!jobId) {
      toast.error('Error Loading Job .. Id is missing.');
    } 

    fetchJobData(jobId);
  }, [jobId])

  const fetchJobData = useCallback(async (id) => {

    if(!id) {
      toast.error('Error Occured');
      return;
    }

    try {
      const fetchDataByIdResponse = await axios.get(`${baseURL}/api/jobs/${id}`);
      // console.log(fetchDataByIdResponse.data);
      if(fetchDataByIdResponse.status == 200) {
        setJob(fetchDataByIdResponse.data.data);
      } else {
        toast.error('Error Loading Job');
        console.log(fetchDataByIdResponse.statusText);
        return;
      }
    } catch (error) {
      console.log(error.message);
      return;
    }
  }, []);

  const handleCVChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log("Selected CV:", selectedFile);
      setCV(selectedFile);
    }
  }, []); 
  
  const handleApplyJob = useCallback(async (e) => {
    e.preventDefault();

    if(!firstName || !lastName || !email || !phoneNumber) {
      toast.error('Please All the required fields');
      return;
    }

    if(!verifyEmail(email)) {
      toast.error('Please Enter a valid Email Address');
      return;
    }

    if(!verifyPhoneNumber(phoneNumber)) {
      toast.error('Please Enter a valid Phone Number');
      return;
    }

    if(!cv) {
      toast.error('Please Upload your CV');
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phoneNumber", phoneNumber);
    formData.append("job", job.jobName);
    formData.append("company", job.company);
    formData.append("resume", cv);

    console.log(formData);

    try {
      const submitApplicationResponse = await axios.post(`${baseURL}/api/jobapplications/apply`, formData);
      console.log(submitApplicationResponse);
      if(submitApplicationResponse.status == 200) {
        toast.success('Job Application Submitted Successfully');
        setIsApplying(false);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setCV(null);
        navigate('/jobs');
      } else if(submitApplicationResponse.status == 401) {
        Swal.fire({
          icon: 'error',
          title: 'Login Required',
          text: 'To apply job, You must login first',
          confirmButtonColor: '#3085d6',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
      } else {
        toast.error('Job Application Submitted Error');
        // console.log(submitApplicationResponse.statusText);
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }, [navigate, firstName, lastName, email, phoneNumber, cv, job]);

  const moveBack = useCallback(() => {
    navigate('/jobs');
  }, [navigate]);

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        {/* Session timeout logic will run in background */}
        <SessionTimeout />
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job listing you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={moveBack} 
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-300"
          >
            <ArrowLeft size={16} />
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <ToastContainer />
      {/* Session timeout logic will run in background */}
      <SessionTimeout />
      {/* Header Section */}
      <div className="bg-gradient-to-r from-black to-indigo-800 text-white py-12">
        <div className="mx-auto max-w-4xl  px-6 pt-10">
          <h1 className="text-4xl font-bold">{job.jobName}</h1>
          <div className="mt-4 flex flex-wrap gap-y-3 gap-x-6 text-sm md:text-base">
            <div className="flex items-center">
              <Briefcase className="mr-2" size={18} />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2" size={18} />
              <span>{job.jobLocation}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2" size={18} />
              <span>{job.jobType}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="mr-2" size={18} />
              <span>{job.salaryRange}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2" size={18} />
              <span>Posted: {useChangeDateFormat(job.postedDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About The Role</h2>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="bg-blue-600 h-6 w-1 rounded-full mr-3"></span>
              Key Responsibilities
            </h3>
            <p>{job.responsibilities}</p>
            {/* <ul className="mt-4 space-y-2">
              {job.responsibilities.map((resp, index) => (
                <li key={index} className="flex">
                  <span className="bg-blue-100 text-blue-800 rounded-full flex items-center justify-center h-6 w-6 mr-3 flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{resp}</span>
                </li>
              ))}
            </ul> */}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="bg-green-600 h-6 w-1 rounded-full mr-3"></span>
              Requirements
            </h3>
            <p>{job.requirements}</p>
            {/* <ul className="mt-4 space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex">
                  <span className="bg-green-100 text-green-800 rounded-full flex items-center justify-center h-6 w-6 mr-3 flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul> */}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="bg-purple-600 h-6 w-1 rounded-full mr-3"></span>
              Benefits & Perks
            </h3>
            <p>{job.benefits}</p>
            {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {job.benefits.map((benefit, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-gray-700">{benefit}</div>
                </div>
              ))}
            </div> */}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About The Company</h2>
          <p className="text-gray-700 leading-relaxed">{job.companyDescription}</p>
        </div>

        {isApplying ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Apply for this Position</h2>
            <form className="space-y-6" onSubmit={handleApplyJob}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="Phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  type="Phone" 
                  id="Phone" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">Upload Resume</label>
                <div className="border border-dashed border-gray-300 rounded-md p-8 text-center">
                  <p className="text-gray-500 mb-2">Drag and drop your resume here, or click to browse</p>
                  <input type="file" className="text-blue-600 hover:text-blue-800 cursor-pointer" onChange={handleCVChange}/>
                  {/* <button type="button" className="text-blue-600 hover:text-blue-800">Browse Files</button> */}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setIsApplying(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setIsApplying(true)}
              className="px-8 py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-lg font-semibold shadow-lg flex items-center justify-center gap-2"
            >
              Apply for this Position
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(JobDetails);