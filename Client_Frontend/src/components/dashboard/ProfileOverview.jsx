import { Edit3, User, ExternalLink, Pointer } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
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
  const [showImageModal, setShowImageModal] = useState(false);
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  useEffect(() => {
    if(user.cv) {
      const cvURL = `${baseURL}/uploads/cvs/${user.cv}`;
      setCVLink(cvURL);
    } else {
      setCVLink('');
    }

    if(user.photo) {
      console.log("Photo starts with http:", user.photo.startsWith('http'));
      
      if(user.photo.startsWith('http')) {
        console.log("Setting Google image URL:", user.photo);
        setImageLink(user.photo);
      } else {
        // Local uploaded image
        const photoURL = `${baseURL}/uploads/users/images/${user.photo}`;
        console.log("Setting local image URL:", photoURL);
        setImageLink(photoURL);
      }
    } else {
      setImageLink('');
      console.log("No photo available");
    }
  }, [user])

  const handleOpenImageModal = () => setShowImageModal(true);
  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
    setImage(null);
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setSelectedImage(selectedFile);
      setImage(URL.createObjectURL(selectedFile)); // Create preview URL
    }
  } 

  const handleCVChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setCV(selectedFile); 
      setCVSelected(true);
    }
  }, [cv, cvSelected]);

  const handleUploadImage = useCallback(async () => {
  if (!selectedImage) {
    toast.error('Please select an image to proceed');
    return;
  }

  const formData = new FormData();
  formData.append('id', user.userId);
  formData.append('photo', selectedImage);

  try {
    const updateUserImageResponse = await axios.put(`${baseURL}/user/upload-user-image`, formData, {
      withCredentials: true
    });
    if (updateUserImageResponse.status === 200) {
      toast.success('User Image Uploaded Successfully');
      window.location.reload();
    } else {
      toast.error('User Image Upload Failed');
    }
  } catch (error) {
    toast.error('User Image Upload Failed');
  } finally {
    handleCloseImageModal();
  }
}, [selectedImage, user.userId]);

  const handleCVUpdate = useCallback(async () => {
    if(!cv) {
      toast.error('Please select a CV to proceed');
      return;
    }

    if(!useCheckValidCVFile(cv)) {
      toast.error('Invalid File Type');
      return;
    }

    const formData = new FormData();
    formData.append('id', user.userId);
    formData.append('cv', cv);

    try {
      setIsUpdating(true);
      const updateUserCVResponse = await axios.put(`${baseURL}/user/update-user-cv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      if(updateUserCVResponse.status === 200) {
        toast.success('CV uploaded successfully!');
        // Update CV link
        const newCVURL = `${baseURL}/uploads/cvs/${updateUserCVResponse.data.cv}`;
        setCVLink(newCVURL);
        setCVSelected(false); // Reset selection
        setCV(null); // Reset CV
        
        // Show success message and stay on the same page
        Swal.fire({
          icon: 'success',
          title: 'CV Updated Successfully!',
          text: 'Your CV has been updated successfully.',
          confirmButtonColor: '#3085d6',
        });
      } else {
        toast.error('CV upload failed');
      }
    } catch (error) {
      console.error('CV upload error:', error);
      toast.error(error.response?.data?.message || 'CV upload failed');
    } finally {
      setIsUpdating(false);
    }
  }, [cv, user.userId]);

  const handleLogout = useCallback(async () => {
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
            const logoutResponse = await axios.get(`${baseURL}/auth/logout`, {
              withCredentials: true
            });
            // console.log(logoutResponse);
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
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition-all">
      <ToastContainer/>
      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-80 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={handleCloseImageModal}
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4">Update Profile Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-3"
            />
            {image && (
              <img
                src={image}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
              />
            )}
            <button
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
              onClick={handleUploadImage}
              disabled={!selectedImage}
            >
              Done
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Profile Image */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-indigo-100 group-hover:border-indigo-300 transition-all">
            <img
              src={image ? image : imageLink || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E"}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
              }}
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-indigo-500 p-1 rounded-full text-white">
            <Edit3 size={14} onClick={handleOpenImageModal} style={{ cursor: "pointer" }}/>
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{user.firstName && user.lastName ? useConCatName(user.firstName, user.lastName) : ''}</h2>
          <p className="text-gray-600 mt-1">{user.profileDescription}</p>
          {/* <input type="file" name="image" onChange={handleImageChange} className="cursor-pointer"/> */}
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
      <div className="flex items-start gap-2 mt-4">
        <div className="flex-1">
          <input 
            type="file" 
            name="cv" 
            accept=".pdf,.doc,.docx"
            onChange={handleCVChange}
            className="cursor-pointer w-full" 
          />
          {cvSelected && cv && (
            <p className="text-sm text-green-600 mt-1">
              Selected file: {cv.name}
            </p>
          )}
        </div>
        <button 
          className={`
            px-7 py-2 rounded-md text-sm transition-all duration-200
            ${cvSelected 
              ? 'bg-purple-500 hover:bg-purple-600 text-white cursor-pointer' 
              : 'bg-purple-300 text-white cursor-not-allowed opacity-50'
            }
          `} 
          disabled={!cvSelected || isUpdating}
          onClick={handleCVUpdate}
        >
          {isUpdating ? 'Updating...' : 'Update CV'}
        </button>
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

export default memo(ProfileOverview);