import { Edit3, User, ExternalLink, Pointer } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import { useCalculateAge, useChangeDateFormat, useCheckValidCVFile, useCheckValidImageFile, useConCatName } from "../../hooks/customHooks";
import baseURL from "../../config/axiosPortConfig";

const ProfileOverview = ({ user }) => {
  const [cvLink, setCVLink] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [image, setImage] = useState(null);
  const [cv, setCV] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cvSelected, setCVSelected] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if(user.cv) {
      const cvURL = `${baseURL}/uploads/cvs/${user.cv}`;
      setCVLink(cvURL);
    } else {
      setCVLink('');
    }

    if(user.photo) {
      const photoURL = `${baseURL}/uploads/images/${user.photo}`;
      setImageLink(photoURL);
    } else {
      setImageLink('');
    }
  }, [user])

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setSelectedImage(selectedFile);
      setImage(URL.createObjectURL(selectedFile)); // Create preview URL
    }
  } 

  const handleCVChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setCV(selectedFile); 
      setCVSelected(true);
    }
  }

  const handleUploadImage = async () => {

    if(!image) {
      toast.error('Please select an image to proceed');
      return;
    }

    // if(!useCheckValidImageFile(image)) {
    //   toast.error('Invalid File Type');
    //   return;
    // }

    const formData = new FormData();

    formData.append('id', user.userId);

    if(image) {
      formData.append('photo', selectedImage);
    }

    console.log(formData);

    try {
      const updateUserImageResponse = await axios.put(`${baseURL}/user/upload-user-image`, formData);
      console.log(updateUserImageResponse.data);
      if(updateUserImageResponse.status == 200) {
        toast.success('User Image Uploaded Successfully');
        console.log(updateUserImageResponse.data.image);
        window.location.reload();
      } else {
        toast.error('User Image Upload Failed');
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  const handleCVUpdate = async () => {
    if(!cv) {
      toast.error('Please select an cv to proceed');
      return;
    }

    if(!useCheckValidCVFile(cv)) {
      toast.error('Invalid File Type');
      return;
    }

    const formData = new FormData();

    formData.append('id', user.userId);

    if(cv) {
      formData.append('cv', cv);
    }

    try {
      const updateUserCVResponse = await axios.put(`${baseURL}/user/update-user-cv`, formData);
      console.log(updateUserCVResponse);
      if(updateUserCVResponse.status == 200) {
        toast.success('User CV Uploaded Successfully');
        console.log(updateUserCVResponse.data.cv);
        const userImageLink = `${baseURL}/uploads/images/${updateUserCVResponse.data.cv}`;
        setImageLink(userImageLink);
        window.location.reload();
      } else {
        toast.error('User Image Upload Failed');
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  } 

  const handleLogout = async () => {
    Swal.fire({
      title: 'Confirmation About Logout',
      text: 'Are you sure you want to Logout from the system ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Logout'
    }).then(async (result) => {
        if(result.isConfirmed) {
          try {
            const logoutResponse = await axios.get(`${baseURL}/auth/logout`);
            console.log(logoutResponse);
            if(logoutResponse.status == 200) {
              Swal.fire({
                icon: 'success',
                title: 'Logout Successful!',
                text: 'You have been logged out successfully!',
                confirmButtonColor: '#3085d6',
              });
              localStorage.clear();
              navigate('/');
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Logout Failed!',
                text: 'Your Logout attempt has failed to proceed!',
                confirmButtonColor: '#d63030',
              });
              console.log('Logout attempt failed with status:', logoutResponse.status);
              return;
            }
          } catch (error) {
            console.log(error);
            return;
          }
        }});
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all">
      <ToastContainer/>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Profile Image */}
        <div className="relative group">
          <img
            src={ image ? image : imageLink || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 group-hover:border-indigo-300 transition-all"
          />
          <div className="absolute bottom-0 right-0 bg-indigo-500 p-1 rounded-full text-white">
            <Edit3 size={14} onClick={handleUploadImage} style={{ cursor: "pointer" }}/>
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{user.firstName && user.lastName ? useConCatName(user.firstName, user.lastName) : ''}</h2>
          <p className="text-gray-600 mt-1">{user.profileDescription}</p>
          <input type="file" name="image" onChange={handleImageChange} className="cursor-pointer"/>
          {/* Social Links */}
          <div className="flex flex-wrap gap-3 mt-3">
            {user.portfolioLink && (
              <a
                href={user.portfolioLink || 'Not Provided'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
              >
                <ExternalLink size={14} /> Portfolio
              </a>
            )}
            {user.linkedInLink && (
              <a
                href={user.linkedInLink || 'Not Provided'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-700 transition-colors"
              >
                <ExternalLink size={14} /> LinkedIn
              </a>
            )}
            {user.facebookLink && (
              <a
                href={user.facebookLink || 'Not Provided'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-indigo-100 hover:bg-indigo-200 rounded-full text-indigo-700 transition-colors"
              >
                <ExternalLink size={14} /> Facebook
              </a>
            )}
          </div>
          <button className="bg-red-500 text-white rounded-md pl-2 pr-2 pt-1 pb-1 mt-2" onClick={handleLogout}>Logout</button>
        </div>

        {/* User Meta Info */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <div className="inline-flex gap-2 items-center px-4 py-2 text-sm font-medium rounded-lg bg-gray-50 text-gray-700">
            <User size={18} />
            User ID: {user.userId}
          </div>
          {user.cv && (
            <a
              href={cvLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex gap-2 items-center px-4 py-2 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              View Resume
            </a>
          )}
        </div>
      </div>
      <div className="flex items-start gap-2">
        <input type="file" name="image" onChange={handleCVChange} className="cursor-pointer ml-auto mt-2"/>
        <button className={`bg-purple-400 rounded-md text-white pl-7 pr-7 pt-2 pb-2 text-sm ${cvSelected ? 'cursor-pointer' : ''} ${!cvSelected ? 'opacity-50' : '' }`} disabled={!cvSelected} onClick={handleCVUpdate}>Update CV</button>
      </div>

      {/* Contact & Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Contact Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            Contact Information
          </h3>
          <div className="space-y-2 text-gray-700">
            <p className="flex items-center gap-2">
              <span className="font-medium">Email:</span> {user.email || 'Not Provided'}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Primary Phone:</span> {user.phoneNumber1 || 'Not Provided'}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Secondary:</span> {user.phoneNumber2 || 'Not Provided'}
            </p>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            Personal Details
          </h3>
          <div className="space-y-2 text-gray-700">
            <p className="flex items-center gap-2">
              <span className="font-medium">Address:</span> {user.address || 'Not Provided'}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Birth Date:</span> {useChangeDateFormat(user.birthDate) || 'Not Provided'}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Age:</span> {user.birthDate ? useCalculateAge(useChangeDateFormat(user.birthDate)) : 'Not Provided'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
