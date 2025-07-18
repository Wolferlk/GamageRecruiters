import React, { useState, useEffect, memo, useCallback } from 'react';
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ArrowRight } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import baseURL from '../config/axiosPortConfig';

const VerifyEmail = ({ email, dummyEmail }) => {

    const [otp, setOTP] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [dummy, setDummy] = useState(''); 
    const navigate = useNavigate();

    useEffect(() => {
        // Set values ...
        setUserEmail(email);
        setDummy(dummyEmail);
    }, [email, dummyEmail]);

    const resendOTP = useCallback(async (e) => {
    e.preventDefault();
    if(!userEmail) {
        toast.error('Email is required');
        return;
    }

    try {
        // Change from /user/sendOTP to /auth/sendOTP
        const sendOTPResponse = await axios.post(`${baseURL}/auth/sendOTP`, { 
            email: userEmail 
        });
        
        if(sendOTPResponse.status === 200) {
            toast.success('An OTP has been sent to your email');
        } else {
            toast.error('OTP Sending Failed');
        }
    } catch (error) {
        console.error('Send OTP error:', error);
        toast.error('Failed to send OTP');
    }
}, [userEmail]);

   const verifyOTP = useCallback(async (e) => {
    e.preventDefault(); 

    if(!otp) {
        toast.error('OTP Must be entered');
        return;
    }

    if(!userEmail || !dummy) {
        toast.error('Email information is missing');
        return;
    }

    try {
        // console.log("Sending verification request:", {
        //     otp: otp.toString(),
        //     oldEmail: dummy,
        //     email: userEmail
        // });
        
        const verifyOTPResponse = await axios.post(`${baseURL}/auth/verifyOTP`, {
            otp: otp.toString(),
            oldEmail: dummy,
            email: userEmail
        });

        if(verifyOTPResponse.data.success) {
            toast.success('Email verification successful');
            // Add a small delay before navigation
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } else {
            toast.error(verifyOTPResponse.data.message || 'Verification failed');
        }
    } catch (error) {
        console.error('Verification error:', error);
        
        // Handle different error scenarios
        if (error.response?.data?.message) {
            toast.error(error.response.data.message);
        } else {
            toast.error('OTP verification failed. Please try again.');
        }
        
        // Reset OTP field on error
        setOTP('');
    }
}, [otp, userEmail, dummy, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-indigo-800 to-purple-200">
            <ToastContainer/>
            <div className="relative w-full max-w-md p-10 overflow-hidden bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl">
            
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-500 rounded-full -translate-x-16 -translate-y-16 opacity-20"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-600 rounded-full translate-x-10 translate-y-10 opacity-20"></div>
                
                {/* Email Verification header */}
                <div className="relative mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Email Verification</h2>
                <p className="mt-2 text-gray-500">Verify Your Email To Proceed</p>
                </div>
                
                {/* Email Verification form */}
                <form className="relative z-10 space-y-6">
                    <div className="group">
                        <div className="flex items-center border-b-2 border-gray-300 group-focus-within:border-indigo-600 transition-colors pb-2">
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="w-full px-3 py-2 focus:outline-none bg-transparent"
                            value={otp}
                            onChange={(e) => setOTP(e.target.value)}
                            required
                        />
                        </div>
                    </div>
                    <div className='flex items-center justify-center gap-2'>
                        <button
                            type="submit"
                            className="flex items-center justify-center w-full px-6 py-3 text-white transition-all bg-gradient-to-r from-indigo-700 to-purple-700 rounded-lg hover:shadow-lg hover:shadow-indigo-900/20 transform hover:-translate-y-1 test-sm"
                        onClick={resendOTP}>
                            <span>Send OTP Again</span>
                        </button>
                        <button
                            type="submit"
                            className="flex items-center justify-center w-full px-6 py-3 text-white transition-all bg-gradient-to-r from-indigo-700 to-purple-700 rounded-lg hover:shadow-lg hover:shadow-indigo-900/20 transform hover:-translate-y-1"
                            onClick={verifyOTP}>
                            <span>Verify OTP</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default memo(VerifyEmail);