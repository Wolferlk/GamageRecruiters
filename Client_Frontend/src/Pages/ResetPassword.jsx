import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
import { Lock, ArrowRight } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { verifyPassword } from '../scripts/verifyData';
import baseURL from '../config/axiosPortConfig';

const ResetPassword = ({ email }) => {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log(email);
        setUserEmail(email);
    }, [email]);

    const handlePasswordReset = useCallback(async (e) => {
        e.preventDefault();

        if(!password || !confirmPassword) {
            toast.error('Please enter password and Confirm it');
            return;
        }

        if(password.length <= 5 || password.length >= 10) {
            toast.error('Password Length must be in between 5 and 10');
            return;
        }

        if(password != confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if(!verifyPassword(password)) {
            toast.error('Password must contain atleast one uppercase, one lowercase, one number and one special character');
            return;
        }

        try {
            const resetPasswordResponse = await axios.post(`${baseURL}/auth/reset-password`, { email: userEmail, newPassword: password });
            console.log(resetPasswordResponse);
            if(resetPasswordResponse.status == 200) {
                toast.success('Password Reset Successfull');
                navigate('/login');
            } else {
                toast.error('Password Reset Failed');
                return;
            }
        } catch (error) {
            toast.error('Password Reset Failed');
            console.log(error);
            return;
        }
    }, [password, confirmPassword]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-indigo-800 to-purple-200">
        <ToastContainer/>
        <div className="relative w-full max-w-md p-10 overflow-hidden bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl">
        
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-500 rounded-full -translate-x-16 -translate-y-16 opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-600 rounded-full translate-x-10 translate-y-10 opacity-20"></div>
            
            {/* Password Reset header */}
            <div className="relative mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Password Reset</h2>
                <p className="mt-2 text-gray-500">Enter Your New Password</p>
            </div>
            
            {/* Login form */}
            <form className="relative z-10 space-y-6">
                <div className="group">
                    <div className="flex items-center border-b-2 border-gray-300 group-focus-within:border-indigo-600 transition-colors pb-2">
                    <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600" />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-3 py-2 focus:outline-none bg-transparent"
                        required
                    />
                    </div>
                </div>
            
                <div className="group">
                    <div className="flex items-center border-b-2 border-gray-300 group-focus-within:border-indigo-600 transition-colors pb-2">
                    <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600" />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full px-3 py-2 focus:outline-none bg-transparent"
                        required
                    />
                    </div>
                </div>
            
                <button type="submit" className="flex items-center justify-center w-full px-6 py-3 text-white transition-all bg-gradient-to-r from-indigo-700 to-purple-700 rounded-lg hover:shadow-lg hover:shadow-indigo-900/20 transform hover:-translate-y-1"
                onClick={handlePasswordReset}>
                    <span>Reset Password</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                </button>
            </form>
        </div>
        </div>
    );
}

export default memo(ResetPassword);
