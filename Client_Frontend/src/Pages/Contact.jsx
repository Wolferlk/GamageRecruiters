import { memo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { af } from "date-fns/locale";

function Contact() {
  const [formData, setFormData] = useState({

    name: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",

  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    loading: false,
    error: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setFormStatus({ ...formStatus, loading: true });

    try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/contact/addinquiry`, formData).then((results) => {

        console.log(results);

        if (results.status === 201) {
          setFormStatus({ submitted: true, loading: false, error: null });

          // Reset form after successful submission
          setTimeout(() => {

            setFormData({
              name: "",
              email: "",
              phoneNumber: "",
              subject: "",
              message: "",
            });


            setFormStatus({ submitted: false, loading: false, error: null });


          }, 3000);

        }


      }).catch((error) => {

        // console.log(error.response.data.message);


        setFormStatus({ submitted: false, loading: false, error: error.response.data.message });

      });


    } catch (error) {
      setFormStatus({ submitted: false, loading: false, error: "Failed to submit form. Please try again." });
      console.log("error from try catch ", error);
    }
  }, [formStatus, formData]);

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-black py-16 px-4 sm:px-6 lg:px-8">

      <div className="max-w-7xl mx-auto">


        {/* Page Header */}
        <div className="text-center mb-16">

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-extrabold text-white tracking-tight"
          >
            Let's Connect
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-xl text-gray-500"
          >
            We're here to help and answer any questions you might have
          </motion.p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 lg:p-12 text-white">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                  <p className="max-w-sm text-blue-100 mb-12">
                    Reach out to us with any questions, inquiries, or collaboration ideas.
                    Our team is ready to assist you.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-base font-medium text-white">Our Office</p>
                        <p className="mt-1 text-sm text-blue-100">676/1 Galle - Colombo Rd, Panadura, Sri Lanka</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-base font-medium text-white">Phone</p>
                        <p className="mt-1 text-sm text-blue-100">+94 77 479 5371</p>
                        <p className="mt-1 text-sm text-blue-100">+94 76 201 4386</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-base font-medium text-white">Email</p>
                        <p className="mt-1 text-sm text-blue-100">gamagerecruiters@gmail.com</p>
                        <p className="mt-1 text-sm text-blue-100">hr.gamagecareer@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <div className="flex space-x-6">
                    <a href="https://x.com/GamageRecru?t=zaNDJqpjWEwAKXYbIM7xIg&s=09" target="_blank" className="text-blue-100 hover:text-white transition-colors">
                      <span className="sr-only">X</span>
                      <svg
                        className="h-6 w-6 text-white hover:text-gray-400 transition-colors duration-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717
           l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339
           l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z" />
                      </svg>

                    </a>
                    <a href="https://www.linkedin.com/company/gamage-recruiters/" target="_blank" className="text-blue-100 hover:text-white transition-colors">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="https://www.facebook.com/share/1AEbyXrDdh/" target="_blank" className="text-blue-100 hover:text-white transition-colors">
                      <span className="sr-only">Facebook</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>



            {/* Contact Form */}
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>

              {formStatus.submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border-l-4 border-green-500 p-4 rounded"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-800">Thank you! Your message has been received.</p>
                    </div>
                  </div>
                </motion.div>
              ) : (

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>



                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+94 76 123 4567"
                      />
                    </div>


                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="How can we help you?"
                      />
                    </div>
                  </div>


                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us how we can assist you..."
                    ></textarea>
                  </div>

                  {formStatus.error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-800">{formStatus.error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={formStatus.loading}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                    >
                      {formStatus.loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>












        {/* Map Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Office</h2>
            <div className="h-96 w-full rounded-lg overflow-hidden">
              <iframe
                title="Google Map"
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5603.914264009148!2d79.90912786290613!3d6.700575460934763!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae247aae3eee7af%3A0x7ca4758b2ae23b70!2sGamage%20Recruiters%20(Pvt)%20Ltd!5e0!3m2!1sen!2slk!4v1742484636058!5m2!1sen!2slk"
                allowFullScreen=""
                loading="lazy"
              ></iframe>


            </div>
          </div>
        </div>

        {/* Operating Hours Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-5">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Business Hours</h3>
            <div className="mt-4 space-y-2 text-gray-600">
              <p className="flex justify-between"><span>Monday - Friday:</span> <span>9:00 AM - 6:00 PM</span></p>
              <p className="flex justify-between"><span>Saturday:</span> <span>10:00 AM - 4:00 PM</span></p>
              <p className="flex justify-between"><span>Sunday:</span> <span>Closed</span></p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-5">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Get instant help from our customer service team through whatsapp chat.</p>
            <a href="https://wa.link/l1ewon" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Start Chat
              <svg className="ml-2 -mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>

          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-5">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">FAQs</h3>
            <p className="text-gray-600 mb-4">Find answers to commonly asked questions in our knowledge base.</p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              View FAQs
              <svg className="ml-2 -mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Contact);