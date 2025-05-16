import { Link } from "react-router-dom";
import { memo, useCallback, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaPhone, 
  FaBirthdayCake, 
  FaLinkedin, 
  FaFacebook, 
  FaLink, 
  FaPortrait,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCheck,
  FaFileUpload
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import VerifyEmail from "./VerifyEmail";
import { verifyEmail, verifyFacebookURL, verifyLinkedInURL, verifyPassword, verifyPhoneNumber, verifyURL } from "../scripts/verifyData";
import baseURL from "../config/axiosPortConfig";


function SignupPage() {

  const [loadUI, setLoadUI] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [phoneNumber1, setPhoneNumber1] = useState('');
  const [phoneNumber2, setPhoneNumber2] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [linkedInLink, setLinkedInLink] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [cv, setCV] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [profileDescription, setProfileDescription] = useState('');
  const [loadVerifyOTP, setLoadVerifyOTP] = useState(false);
  const [cvName, setCVName] = useState('');
  const [photoName, setPhotoName] = useState('');

  const emailValue = 'dummy@gmail.com';

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if(!firstName || !lastName || !email || !password || !confirmPassword || !birthDate || !gender || !profileDescription) {
      toast.error('Please fill the required fields');
      return;
    }

    if(!verifyEmail(email)) {
      toast.error('Invalid Email');
    }

    if(password.length <= 5 || password.length >= 10) {
      toast.error('Password Length must be in between 5 and 10');
      return;
    }

    if(!verifyPassword(password)) {
      toast.error('Password must contain atleast one uppercase, one lowercase, one number and one special character');
      return;
    }

    if(!verifyPhoneNumber(phoneNumber1)) {
      toast.error('Invalid Phone Number');
    } 

    if(linkedInLink) {
      if(!verifyLinkedInURL(linkedInLink)) {
        toast.error('Invalid LinkedIn URL');
        return;
      } 
    }

    if(facebookLink) {
      if(!verifyFacebookURL(facebookLink)) {
        toast.error('Invalid Facebook URL');
        return;
      }
    }

    if(phoneNumber2) {  
      if(!verifyPhoneNumber(phoneNumber2)) {
        toast.error('Invalid Phone Number');
      }
    }

    if(portfolioLink) {
      if(!verifyURL(portfolioLink)) {
        toast.error('Invalid Portfolio URL');
        return;
      }
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    } 

    const formData = new FormData();

    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', emailValue);
    formData.append('gender', gender);
    formData.append('birthDate', birthDate);
    formData.append('password', password);
    formData.append('address', address);
    formData.append('address2', address2);
    formData.append('phoneNumber1', phoneNumber1);
    formData.append('phoneNumber2', phoneNumber2);
    formData.append('portfolioLink', portfolioLink);
    formData.append('linkedInLink', linkedInLink);
    formData.append('facebookLink', facebookLink);
    formData.append('profileDescription', profileDescription);
    formData.append('cv', cv);
    formData.append('photo', photo);

    try {
      const signupResponse = await axios.post(`${baseURL}/auth/register`, formData);
      if(signupResponse.status == 201) {
        const sendOTPResponse = await axios.post(`${baseURL}/auth/sendOTP`, { email: email });
        if(sendOTPResponse.status == 200) {
          toast.success('An OTP has been sent to your email');
          localStorage.setItem('IsSignupAuthenticated', true);
          setLoadUI(false);
          setLoadVerifyOTP(true);
        } else {
          toast.error('Error Sending OTP');
          return;
        }
      } else {
        toast.error('User Registration Failed');
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }, [firstName, lastName, gender, email, password, confirmPassword, profileDescription]);

  // const handleFileChange = (e) => {
  //   console.log(e.target.files);
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.files[0]
  //   });
  // };

  const handleCVChange = useCallback((e) => {
    console.log(e.target.files[0]);
    setCV(e.target.files[0]);
    setCVName(e.target.files[0].name);
  }, [cv, cvName]);

  const handlePhotoChange = useCallback((e) => {
    console.log(e.target.files[0]);
    setPhoto(e.target.files[0]);
    setPhotoName(e.target.files[0].name);
  }, [photo, photoName]);

  const handleInputChange = (e) => {
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      setPasswordError('');
    }

    setConfirmPassword(e.target.value);
    
    // setFormData({
    //   ...formData,
    //   [e.target.name]: e.target.value
    // });
  }

  const nextStep = () => {
    if (currentStep === 4 && password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setCurrentStep(Math.min(currentStep + 1, totalSteps));
  }

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-indigo-800 to-purple-200">
      <ToastContainer/>
      { loadUI == true && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-6">
              Create Your Professional Profile
            </h1>
            
            <div className="flex justify-center mb-2">
              <div className="text-sm font-medium text-white">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
            
            <div className="flex justify-between items-center max-w-3xl mx-auto px-6">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-black text-sm font-medium 
                    ${i + 1 < currentStep ? 'bg-green-500' : i + 1 === currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    {i + 1 < currentStep ? <FaCheck /> : i + 1}
                  </div>
                  <div className="hidden md:block text-xs mt-1 font-medium text-gray-600">
                    {i === 0 ? 'Personal' : 
                     i === 1 ? 'Contact' : 
                     i === 2 ? 'Social' : 
                     i === 3 ? 'Security' : 'Documents'}
                  </div>
                </div>
              ))}
              <div className="absolute left-0 right-0 h-0.5 bg-gray-200" style={{ top: '1rem', zIndex: -1 }}>
                <div 
                  className="h-full bg-blue-600 transition-all duration-300" 
                  style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            {/* Step 1: Personal Information */}
            <div className={`transition-all duration-500 transform ${currentStep === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'}`}>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center mb-8 text-blue-700">
                  <FaUser size={24} className="mr-3" />
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <div className="group">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="John"
                        className="w-full outline-none border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <div className="group">
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        className="w-full outline-none border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                      required
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <FaBirthdayCake className="text-gray-400 mr-2" />
                      <input
                        type="date"
                        name="birthDate"
                        className="w-full outline-none"
                        required
                        onChange={(e) => setBirthDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center"
                >
                  Continue <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>

            {/* Step 2: Contact Information */}
            <div className={`transition-all duration-500 transform ${currentStep === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'}`}>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center mb-8 text-blue-700">
                  <FaMapMarkerAlt size={24} className="mr-3" />
                  <h2 className="text-2xl font-bold">Contact Information</h2>
                </div>

                <div className="space-y-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Address *
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <input
                        type="text"
                        name="address"
                        placeholder="Street Address"
                        className="w-full outline-none"
                        required
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Address
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <input
                        type="text"
                        name="address2"
                        placeholder="Apartment, Suite, etc."
                        className="w-full outline-none"
                        onChange={(e) => setAddress2(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Phone *
                      </label>
                      <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                        <FaPhone className="text-gray-400 mr-2" />
                        <input
                          type="tel"
                          name="phoneNumber1"
                          placeholder="+94 77 123 4567"
                          className="w-full outline-none"
                          required
                          onChange={(e) => setPhoneNumber1(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Phone
                      </label>
                      <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                        <FaPhone className="text-gray-400 mr-2" />
                        <input
                          type="tel"
                          name="phoneNumber2"
                          placeholder="+94 76 765 4321"
                          className="w-full outline-none"
                          onChange={(e) => setPhoneNumber2(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center"
                >
                  Continue <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>

            {/* Step 3: Social & Professional Links */}
            <div className={`transition-all duration-500 transform ${currentStep === 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'}`}>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center mb-8 text-blue-700">
                  <FaLink size={24} className="mr-3" />
                  <h2 className="text-2xl font-bold">Social & Professional Links</h2>
                </div>

                <div className="space-y-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <FaLinkedin className="text-blue-600 mr-2" />
                      <input
                        type="url"
                        name="linkedInLink"
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full outline-none"
                        onChange={(e) => setLinkedInLink(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook Profile
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <FaFacebook className="text-blue-700 mr-2" />
                      <input
                        type="url"
                        name="facebookLink"
                        placeholder="https://facebook.com/yourprofile"
                        className="w-full outline-none"
                        onChange={(e) => setFacebookLink(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio Website
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <FaLink className="text-gray-500 mr-2" />
                      <input
                        type="url"
                        name="portfolioLink"
                        placeholder="https://yourportfolio.com"
                        className="w-full outline-none"
                        onChange={(e) => setPortfolioLink(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center"
                >
                  Continue <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>

            {/* Step 4: Account Security */}
            <div className={`transition-all duration-500 transform ${currentStep === 4 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'}`}>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center mb-8 text-blue-700">
                  <FaLock size={24} className="mr-3" />
                  <h2 className="text-2xl font-bold">Account Security</h2>
                </div>

                <div className="space-y-6">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <FaEnvelope className="text-gray-400 mr-2" />
                      <input
                        type="email"
                        name="email"
                        placeholder="john.doe@example.com"
                        className="w-full outline-none"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <FaLock className="text-gray-400 mr-2" />
                      <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        className="w-full outline-none"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="flex items-center border border-gray-300 px-4 py-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                      <FaLock className="text-gray-400 mr-2" />
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        className="w-full outline-none"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                    {passwordError && (
                      <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Both passwords should be the same.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all flex items-center"
                >
                  Continue <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>

            {/* Step 5: Documents & Profile Description */}
            <div className={`transition-all duration-500 transform ${currentStep === 5 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'}`}>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
                <div className="flex items-center mb-8 text-blue-700">
                  <FaFileUpload size={24} className="mr-3" />
                  <h2 className="text-2xl font-bold">Documents & Media</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  

                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Profile Photo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-all cursor-pointer">
                      <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        className="hidden"
                        id="photo-upload"
                        onChange={handlePhotoChange}
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <FaPortrait className="mx-auto text-gray-400 text-3xl mb-2" />
                        { photo ? (
                          <p className="text-sm text-gray-500">
                            {photoName}
                          </p>
                        ): (
                          <p className="text-sm text-gray-500">
                            Drag and drop your photo here, or <span className="text-blue-600 font-medium">browse</span>
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF format</p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Description *
                  </label>
                  <textarea
                    name="profileDescription"
                    placeholder="Describe your professional background, skills, and career achievements..."
                    className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-40"
                    required
                    onChange={(e) => setProfileDescription(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This description will be visible to recruiters and helps them understand your qualifications.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between mb-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg 
                              hover:shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Complete Registration
                  </button>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    By creating an account, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      ) }

      { !loadUI && loadVerifyOTP && (<VerifyEmail email={email} dummyEmail={emailValue}/>) }
    </div>
  );
}

export default memo(SignupPage);