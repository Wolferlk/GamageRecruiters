import { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import baseURL from "../config/axiosPortConfig";
import { verifyEmail } from "../scripts/verifyData";

const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Jobs", href: "/jobs" },
    { name: "Trusted Partners", href: "/trusted-partners" },
    { name: "Blog", href: "/blog" },
    { name: "Workshops", href: "/workshop" },
    { name: "Contact", href: "/contact" },
    { name: "Subsidiaries", href: "/subsidiaries" },
  ],
  support: [
    { name: "Login", href: "/login" },
    { name: "Sign Up", href: "/signup" },
    { name: "Dashboard", href: "/dashboard" },
    //{ name: 'Application', href: '/application' },
  ],
  social: [
    {
      name: "Facebook",
      href: "https://www.facebook.com/share/1AEbyXrDdh/",
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/gamage-recruiters/",
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: "X",
      href: "https://x.com/GamageRecru?t=zaNDJqpjWEwAKXYbIM7xIg&s=09",
      icon: (props) => (
        <svg
          className="h-6 w-6 text-white hover:text-gray-400 transition-colors duration-300"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717
l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339
l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z"
          />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/gamage__recruiters/",
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!verifyEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const subscribeToNewsLetterResponse = await axios.post(
        `${baseURL}/user/subscribe-newsletter`,
        { email: email },
        { withCredentials: true }
      );
      // console.log(subscribeToNewsLetterResponse.data);
      if (
        subscribeToNewsLetterResponse.data &&
        typeof subscribeToNewsLetterResponse.data === "string" &&
        subscribeToNewsLetterResponse.data.includes("already")
      ) {
        toast.info("You are already subscribed to our newsletter");
      } else {
        toast.success("Subscribed to Newsletter Successfully");
      }
      setEmail("");
    } catch (error) {
      console.log(error);
      // Handle specific error cases
      if (error.response) {
        if (error.response.status === 404) {
          toast.error("Email not registered. Please sign up first.");
        } else if (error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("Subscription failed. Please try again.");
        }
      } else {
        toast.error("Connection error. Please try again later.");
      }
    }
  };

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-indigo-900">
      <ToastContainer />
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Gamage Recruiters
            </h3>
            <address className="mt-4 not-italic text-gray-300 space-y-2">
              <p>Panadura, Western Province</p>
              <p>Sri Lanka</p>
              <div className="flex items-center mt-3">
                <svg
                  className="h-5 w-5 text-blue-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>077 479 5371</span>
                  <span>077 789 7901</span>
                </div>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-blue-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div className="flex flex-col">
                  <span>hr.gamagecareer@gmail.com</span>
                  <span>gamagerecruiters@gmail.com</span>
                </div>
              </div>
              <div className="flex items-center">
                {/* <svg
                  className="h-5 w-5 text-blue-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg> */}
                {/* <span>gamagerecruiters.com</span> */}
              </div>
            </address>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white">Navigation</h3>
              <ul className="mt-4 space-y-2">
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Account</h3>
              <ul className="mt-4 space-y-2">
                {navigation.support.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <p className="mt-4 text-gray-300">
              Subscribe to our newsletter for job alerts and career tips.
            </p>
            <form className="mt-4" onSubmit={handleSubscribe}>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-blue-800/50 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md px-4 py-2 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 border-t border-blue-800/50 pt-8">
          <div className="flex justify-center space-x-6">
            {navigation.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                className="text-gray-300 hover:text-white"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="mt-8 text-center text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} Gamage Recruiters. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
