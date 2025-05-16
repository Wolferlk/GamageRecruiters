import { useState, useEffect, useCallback, memo } from "react";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { useChangeDateFormat } from "../../hooks/customHooks";
import baseURL from "../../config/axiosPortConfig";
import { useNavigate } from "react-router-dom";

const EditProfileForm = ({ user, setUser }) => {
  const [formData, setFormData] = useState({ ...user });
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({ ...user });
  }, [user]); // Update form data if user prop changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log(formData);
    Swal.fire({
          title: 'Confirmation About Changing User Password',
          text: 'Are you sure you want to change the password ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Update'
        }).then(async (result) => {
          if(result.isConfirmed) {
            try {
              const updateResponse = await axios.put(`${baseURL}/user/update-user-data/${formData.userId}`, { 
                firstName: formData.firstName, 
                lastName: formData.lastName, 
                gender: formData.gender, 
                birthDate: useChangeDateFormat(formData.birthDate), 
                address: formData.address, 
                address2: formData.address2, 
                phoneNumber1: formData.phoneNumber1, 
                phoneNumber2: formData.phoneNumber2, 
                photo: formData.photo, 
                cv: formData.cv, 
                linkedInLink: formData.linkedInLink, 
                facebookLink: formData.facebookLink, 
                portfolioLink: formData.portfolioLink, 
                profileDescription: formData.profileDescription
              });
              console.log(updateResponse);
              console.log(updateResponse.data.message);
              if(updateResponse.status == 200) {
                Swal.fire({
                  icon: 'success',
                  title: 'User Data Updated!',
                  text: 'User Password Updated Successfully!',
                  confirmButtonColor: '#3085d6',
                });
              } else {
                toast.error('Update Failed');
                return;
              }
            } catch (error) {
              toast.error('Update Failed');
              console.log(error);
              return;
            }
          }
        });
    // alert("Profile updated successfully!");
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <ToastContainer/>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile Information</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              placeholder="Enter Your First Name"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              placeholder="Enter Your Last Name"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter Your Email"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Phone Number 1 */}
          <div>
            <label htmlFor="phoneNumber1" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              id="phoneNumber1"
              type="tel"
              name="phoneNumber1"
              placeholder="Enter Your Phone Number"
              value={formData.phoneNumber1}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Phone Number 2 */}
          <div>
            <label htmlFor="phoneNumber2" className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone</label>
            <input
              id="phoneNumber2"
              type="tel"
              name="phoneNumber2"
              value={formData.phoneNumber2}
              placeholder="Enter Your Secondary Phone Number"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
            <input
              id="birthDate"
              type="date"
              name="birthDate"
              value={useChangeDateFormat(formData.birthDate)}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              placeholder="Enter Your Gender"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              placeholder="Enter Your Address"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
            <input
              id="address2"
              type="text"
              name="address2"
              placeholder="Enter Your Secondary Address"
              value={formData.address2}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Profile Description */}
        <div>
          <label htmlFor="profileDescription" className="block text-sm font-medium text-gray-700 mb-1">Profile Description</label>
          <textarea
            id="profileDescription"
            name="profileDescription"
            value={formData.profileDescription}
            placeholder="Enter Your Profile Description"
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["portfolioLink", "linkedInLink", "facebookLink"].map((field, index) => (
            <div key={index}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                {field.replace("Link", " Profile")}
              </label>
              <input
                id={field}
                type="url"
                name={field}
                value={formData[field]}
                placeholder="Enter Your Profile Link"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          {/* <button
            type="button"
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button> */}
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default  memo(EditProfileForm);
