import React, { useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { AtSign, ArrowRight } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from './ResetPassword';

const EmailCheck = () => {
    const [loadEmailCheck, setLoadEmailCheck] = useState(true);
    const [loadResetPassword, setLoadResetPassword] = useState(false);
    const [email, setEmail] = useState('');

    const handleEmailCheck = async (e) => {
        e.preventDefault();

        if(!email) {
            toast.error('Please Enter User Email');
        }

        try {
            const emailCheckResponse = await axios.post('http://localhost:5000/user/email-check', { email: email });
            console.log(emailCheckResponse);
            if(emailCheckResponse.status == 200) {
                toast.success('Email Noted');
                setLoadEmailCheck(false);
                setLoadResetPassword(true);
            } else {
                toast.error('Email Not Found or Invalid');
                return;
            }
        } catch (error) {
            console.log(error);
            return;
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-indigo-800 to-purple-200">
        <ToastContainer/>
        {loadEmailCheck && (
            <div className="relative w-full max-w-md p-10 overflow-hidden bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-500 rounded-full -translate-x-16 -translate-y-16 opacity-20"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-600 rounded-full translate-x-10 translate-y-10 opacity-20"></div>
                
                {/* Email Check header */}
                <div className="relative mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Enter Email</h2>
                    <p className="mt-2 text-gray-500">Please enter your user email to proceed</p>
                </div>
            
                {/* Email Check form */}
                <form className="relative z-10 space-y-6">
                    <div className="group">
                        <div className="flex items-center border-b-2 border-gray-300 group-focus-within:border-indigo-600 transition-colors pb-2">
                        <AtSign className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-600" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            className="w-full px-3 py-2 focus:outline-none bg-transparent"
                            required
                        />
                        </div>
                    </div>
                    <button type="submit" className="flex items-center justify-center w-full px-6 py-3 text-white transition-all bg-gradient-to-r from-indigo-700 to-purple-700 rounded-lg hover:shadow-lg hover:shadow-indigo-900/20 transform hover:-translate-y-1"
                    onClick={handleEmailCheck}>
                        <span>Proceed</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </form>
            </div>
        )}

        {!loadEmailCheck && loadResetPassword && (<ResetPassword email={email}/>)}
        </div>
    );
}

export default EmailCheck;
