import { Link } from "react-router-dom";
import TestominolsSection from "../components/Home/TestominolsSection";
import TeamMembers from "../components/Home/TeamSection";
import { memo } from "react";

const stats = [
  { label: "Years in Business", value: "5+" },
  { label: "Successful Placements", value: "1000+" },
  { label: "Client Companies", value: "200+" },
  { label: "Industry Sectors", value: "15+" },
];

const subsidiaries = [
  {
    name: "Duty-free Shop -  Port City",
    description:
      "Premium duty-free wine shop located in Port City, offering a curated selection of international wines and spirits.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8 text-indigo-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.25 48.25 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
        />
      </svg>
    ),
  },
  {
    name: "VERITAS International Campus",
    description:
      "A leading educational institution offering international qualifications and professional development programs.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8 text-indigo-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
        />
      </svg>
    ),
  },
  {
    name: "Veritas International Ship Chandling",
    description:
      "A premier ship chandling company dedicated to providing exceptional services to the maritime industry. With its headquarters strategically located in Sri Lanka, Veritas International has grown to become a trusted partner for ship owners, operators, and managers across the globe.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8 text-indigo-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
        />
      </svg>
    ),
  },
];

function About() {
  return (
    <div className="bg-white">
      {/* Hero Section - Parallax Effect */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/90 z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/office-team.jpg')] bg-cover bg-center bg-no-repeat"></div>
        <div className="relative z-20 px-6 py-32 sm:py-40 lg:px-8 mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Connecting <span className="text-indigo-400">Talent</span> with{" "}
              <span className="text-indigo-400">Opportunity</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl">
              Gamage Recruiters has been bridging the gap between talented
              professionals and leading companies since 2019. Our deep
              understanding of the Sri Lankan job market and commitment to
              excellence has made us a trusted name in recruitment.
            </p>
            <div className="mt-10 flex gap-x-6">
              <Link
                to="/contact"
                className="rounded-md bg-indigo-600 px-5 py-3 text-lg font-semibold text-white shadow-lg hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Brief Introduction Section */}
      <div className="relative bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                Who We Are
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2019, Gamage Recruiters has grown to become one of
                Sri Lanka's most respected recruitment agencies. We specialize
                in connecting top-tier talent with leading organizations across
                multiple industries.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our experienced team of recruitment specialists combines
                industry knowledge, market insights, and a personal approach to
                deliver exceptional service to both candidates and employers.
              </p>
              <p className="text-lg text-gray-600">
                Beyond recruitment, we've expanded our portfolio to include
                educational services and retail ventures, unified under our
                sister company VERITAS INTERNATIONAL (PVT) LTD.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-indigo-50 rounded-lg p-4 shadow flex flex-col items-center">
                  <span className="text-indigo-600 font-bold text-xl mb-2">
                    Focus
                  </span>
                  <p className="text-gray-700 text-center">
                    Emerging markets, primarily Sri Lanka
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 shadow flex flex-col items-center">
                  <span className="text-indigo-600 font-bold text-xl mb-2">
                    Team
                  </span>
                  <p className="text-gray-700 text-center">
                    Grew to 11-50 employees
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 shadow flex flex-col items-center">
                  <span className="text-indigo-600 font-bold text-xl mb-2">
                    Headquarters
                  </span>
                  <p className="text-gray-700 text-center">Panadura</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://i.ibb.co/Q3vf45qc/gamage.png"
                alt="Gamage Recruiters Office"
                className="rounded-full shadow-2xl object-cover w-4/5 ml-auto"
              />
              <div className="absolute -bottom-8 left-8 bg-indigo-600 rounded-xl p-6 shadow-xl">
                <p className="text-xl font-bold text-white">Established 2019</p>
                <p className="text-white/80 mt-1">Galle road, Panadura</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Video Section */}
      <div className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              OUR STORY
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Meet Gamage Recruiters
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Discover our journey, values, and the passionate team behind Sri Lanka's leading recruitment agency.
            </p>
          </div>
          
          {/* Video Container */}
          <div className="relative mx-auto max-w-4xl">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                preload="metadata"
                disablePictureInPicture
                muted
              >
                <source src="/videos/company-intro.mp4" type="video/mp4" />
                <source src="/videos/company-intro.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Decorative elements for video */}
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Mission Vision Section */}
      <div className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              OUR PURPOSE
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Mission & Vision
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-indigo-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-lg text-gray-600">
                Our aim is to become the go-to organization for all human
                resource and business needs. We are committed to providing
                exceptional service, expertise, professionalism, honesty, and
                integrity to all our clients and community members.
              </p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-indigo-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-lg text-gray-600">
                To showcase emerging market talent globally to provide a
                genuinely local solution to organizational needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose GAMAGE RECRUITERS Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-indigo-700 sm:text-4xl mb-6">
              WHY CHOOSE GAMAGE RECRUITERS?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-indigo-50 rounded-xl p-8 shadow text-center flex flex-col items-center">
              <span className="text-4xl mb-4">🏅</span>
              <h3 className="font-semibold text-indigo-600 mb-2 text-xl">
                Industry Experts
              </h3>
              <p className="text-gray-600">
                Deep understanding of the recruitment landscape.
              </p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-8 shadow text-center flex flex-col items-center">
              <span className="text-4xl mb-4">🌐</span>
              <h3 className="font-semibold text-indigo-600 mb-2 text-xl">
                Extensive Network
              </h3>
              <p className="text-gray-600">
                Access to a wide pool of qualified candidates.
              </p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-8 shadow text-center flex flex-col items-center">
              <span className="text-4xl mb-4">🤝</span>
              <h3 className="font-semibold text-indigo-600 mb-2 text-xl">
                Diversity & Inclusion
              </h3>
              <p className="text-gray-600">
                Commitment to equal opportunities for all.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-indigo-700 sm:text-4xl mb-6">
              Our Values
            </h2>
            <p className="text-lg text-gray-600">
              At Gamage Recruiters, our core values guide every decision we make
              and every relationship we build.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow text-center hover:shadow-lg transition">
              <span className="text-4xl mb-4 block">🤝</span>
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                Integrity
              </h3>
              <p className="text-gray-600">
                We uphold the highest standards of honesty and accountability in
                all our actions.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow text-center hover:shadow-lg transition">
              <span className="text-4xl mb-4 block">🤝</span>
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                Collaboration
              </h3>
              <p className="text-gray-600">
                We believe in teamwork and strong partnerships to achieve shared
                success.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow text-center hover:shadow-lg transition">
              <span className="text-4xl mb-4 block">💡</span>
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                Innovation
              </h3>
              <p className="text-gray-600">
                We embrace change and continuously seek creative solutions to
                challenges.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow text-center hover:shadow-lg transition">
              <span className="text-4xl mb-4 block">🎯</span>
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                Client-Centric
              </h3>
              <p className="text-gray-600">
                We prioritize our clients' needs and deliver tailored solutions
                that exceed expectations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Strengths Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-indigo-700 sm:text-4xl mb-6">
              Our Strengths
            </h2>
            <p className="text-lg text-gray-600">
              We deliver exceptional recruitment services through our proven track record and comprehensive approach.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Proven Track Record</h3>
              </div>
              <p className="text-gray-600">
                Successfully placed candidates across various industries, consistently meeting client expectations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Customized Solutions</h3>
              </div>
              <p className="text-gray-600">
                Tailored strategies for each client's unique hiring needs and organizational culture.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Extensive Talent Pool</h3>
              </div>
              <p className="text-gray-600">
                Access to a wide and diverse database of pre-screened, qualified candidates.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Speed and Efficiency</h3>
              </div>
              <p className="text-gray-600">
                Rapid turnaround times without compromising quality, ensuring timely hiring.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">End-to-End Services</h3>
              </div>
              <p className="text-gray-600">
                Comprehensive solutions from job advertising, screening, interviewing, and onboarding support.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Expert Industry Knowledge</h3>
              </div>
              <p className="text-gray-600">
                In-depth understanding of market trends and sector-specific hiring demands, especially within the Sri Lankan and international context.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Dedicated Account Managers</h3>
              </div>
              <p className="text-gray-600">
                Personalized service with a single point of contact for streamlined communication.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Transparent Practices</h3>
              </div>
              <p className="text-gray-600">
                Honest communication, fair pricing, and a commitment to confidentiality and compliance.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Proven Internship Programs</h3>
              </div>
              <p className="text-gray-600">
                Actively developing future talent through structured internship programs, allowing clients access to groomed candidates.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12h6m-6 4h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Employer Branding Support</h3>
              </div>
              <p className="text-gray-600">
                Helps clients position themselves attractively in the talent market through branding and marketing support.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Post-Placement Follow-up</h3>
              </div>
              <p className="text-gray-600">
                Continual support even after placement to ensure successful integration and performance of hires.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section with Animation */}
      <div className="bg-indigo-900 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Our Impact in Numbers
              </h2>
              <p className="mt-4 text-lg text-indigo-100">
                A decade of excellence in recruitment and business growth
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-indigo-800/50 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg transition-all duration-300 hover:bg-indigo-800"
                >
                  <dt className="text-lg font-medium text-indigo-200">
                    {stat.label}
                  </dt>
                  <dd className="mt-4 text-5xl font-extrabold tracking-tight text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Subsidiaries Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              OUR VENTURES
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Our Subsidiaries
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Under VERITAS INTERNATIONAL (PVT) LTD, we've expanded our
              portfolio to offer diverse services and products.
            </p>
          </div>
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {subsidiaries.map((subsidiary, index) => (
              <div
                key={index}
                className="flex flex-col bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 mb-6">
                  {subsidiary.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {subsidiary.name}
                </h3>
                <p className="text-lg text-gray-600 mb-8 flex-grow">
                  {subsidiary.description}
                </p>
                <div className="mt-auto">
                  <Link
                    to="/subsidiaries"
                    className="text-indigo-600 font-medium flex items-center hover:text-indigo-800 transition-colors"
                  >
                    Learn more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 ml-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link
              to="/subsidiaries"
              className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-5 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300"
            >
              Explore Our Subsidiaries
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <TeamMembers />

      {/* Testimonials Section */}
      <TestominolsSection />

      {/* CTA Section */}
      <div className="relative isolate overflow-hidden bg-gray-900">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your career?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join thousands of professionals who've found their perfect career
              match through Gamage Recruiters.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/jobs"
                className="rounded-md bg-indigo-600 px-5 py-3 text-lg font-semibold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300"
              >
                View Open Positions
              </Link>
              <Link
                to="/contact"
                className="text-lg font-semibold leading-6 text-white flex items-center group"
              >
                Contact Us
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <svg
          viewBox="0 0 1024 1024"
          className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
          aria-hidden="true"
        >
          <circle
            cx={512}
            cy={512}
            r={512}
            fill="url(#gradient)"
            fillOpacity="0.7"
          />
          <defs>
            <radialGradient id="gradient">
              <stop stopColor="#4f46e5" />
              <stop offset={1} stopColor="#4338ca" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export default memo(About);
