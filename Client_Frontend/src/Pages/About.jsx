import { Link } from 'react-router-dom';
import TestominolsSection from '../components/Home/TestominolsSection';
import TeamMembers from '../components/Home/TeamSection';
import { memo } from 'react';

const stats = [
  { label: 'Years in Business', value: '10+' },
  { label: 'Successful Placements', value: '5000+' },
  { label: 'Client Companies', value: '200+' },
  { label: 'Industry Sectors', value: '15+' }
];

const subsidiaries = [
  {
    name: 'Duty-free Shop -  Port City',
    description: 'Premium duty-free wine shop located in Port City, offering a curated selection of international wines and spirits.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.25 48.25 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    name: 'VERITAS Campus International',
    description: 'A leading educational institution offering international qualifications and professional development programs.',
    icon: (
      <svg xmlns="https://blog.unemployedprofessors.com/wp-content/uploads/2025/03/DALL%C2%B7E-2025-03-12-20.28.34-A-prestigious-university-library-setting-with-two-contrasting-study-areas.-One-side-shows-students-passively-using-AI-generated-text-on-their-laptops.webp" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
  }
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
              Connecting <span className="text-indigo-400">Talent</span> with <span className="text-indigo-400">Opportunity</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl">
              Gamage Recruiters has been bridging the gap between talented professionals and leading companies since 2013.
              Our deep understanding of the Sri Lankan job market and commitment to excellence has made us a trusted name in recruitment.
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
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">Who We Are</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2019, Gamage Recruiters has grown to become one of Sri Lanka's most respected recruitment agencies. We specialize in connecting top-tier talent with leading organizations across multiple industries.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our experienced team of recruitment specialists combines industry knowledge, market insights, and a personal approach to deliver exceptional service to both candidates and employers.
              </p>
              <p className="text-lg text-gray-600">
                Beyond recruitment, we've expanded our portfolio to include educational services and retail ventures, unified under our parent company VERITAS INTERNATIONAL (PVT) LTD.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://i.ibb.co/PvCfxjd9/gamage.png" 
                alt="Gamage Recruiters Office" 
                className="rounded-xl shadow-2xl object-cover"
              />
              <div className="absolute -bottom-8 -left-8 bg-indigo-600 rounded-xl p-6 shadow-xl">
                <p className="text-xl font-bold text-white">Established 2019</p>
                <p className="text-white/80 mt-1">Colombo, Sri Lanka</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Vision Section */}
      <div className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">OUR PURPOSE</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Mission & Vision
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-lg text-gray-600">
                To revolutionize the recruitment industry in Sri Lanka by providing innovative solutions that connect the right talent
                with the right opportunities, while fostering growth and success for both candidates and employers.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-lg text-gray-600">
                To be recognized as the premier recruitment partner in Sri Lanka, known for our integrity, expertise, and 
                commitment to excellence, while expanding our impact through diversified business ventures.
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
                <div key={stat.label} className="bg-indigo-800/50 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg transition-all duration-300 hover:bg-indigo-800">
                  <dt className="text-lg font-medium text-indigo-200">{stat.label}</dt>
                  <dd className="mt-4 text-5xl font-extrabold tracking-tight text-white">{stat.value}</dd>
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
            <h2 className="text-base font-semibold leading-7 text-indigo-600">OUR VENTURES</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Our Subsidiaries
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Under VERITAS INTERNATIONAL (PVT) LTD, we've expanded our portfolio to offer diverse services and products.
            </p>
          </div>
          
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {subsidiaries.map((subsidiary, index) => (
              <div key={index} className="flex flex-col bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 mb-6">
                  {subsidiary.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{subsidiary.name}</h3>
                <p className="text-lg text-gray-600 mb-8 flex-grow">{subsidiary.description}</p>
                <div className="mt-auto">
                  <Link
                    to="/subsidiaries"
                    className="text-indigo-600 font-medium flex items-center hover:text-indigo-800 transition-colors"
                  >
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
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
              Join thousands of professionals who've found their perfect career match through Gamage Recruiters.
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
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
          <circle cx={512} cy={512} r={512} fill="url(#gradient)" fillOpacity="0.7" />
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