import React, { useContext, useState, useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RecipeContext from '../context/recipeContext';
const backendUrl = import.meta.env.VITE_API_BASE_URL;

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pnum: "",
    location: ""
  });

  const navigate = useNavigate();
  const {infoGetter} = useContext(RecipeContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/profile/createuser`, formData);
      await infoGetter();
      navigate('/landing');
    } catch (error) {
      console.error("Some Error Occurred!!", error);
    }
  };

  useEffect(()=>{
    const checkUser = async ()=>{
      try {
        const {data} = await axios.get(`${backendUrl}/api/profile/getuser`);
        if(data && data.name){
          navigate('/landing');
        }
      } catch (error) {
        console.log('No user found, staying on register page.');
      }
    }
    checkUser();
  },[]);

  return (
    <div className="hero bg-base-200 min-h-screen p-5">
      <div className="hero-content flex-col lg:flex-col gap-9">
        <div className="text-center lg:text-center">
          <h1 className="text-5xl font-bold text-success drop-shadow-[0_0_10px_rgba(34,197,94,0.7)]">
            <Typewriter
              words={['Welcome!']}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={100}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </h1>
          <p className="py-6">
            Tell us a bit about yourself to personalize your recipe book. This helps us make your experience more delightful!
          </p>
        </div>

        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="fieldset gap-4 flex flex-col">

              {/* Full Name Input */}
              <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </g>
                </svg>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Username"
                  pattern="[A-Za-z][A-Za-z0-9\s\-]*"
                  minLength="3"
                  maxLength="30"
                  title="Only letters, numbers or dash"
                />
              </label>

              {/* Email Input */}
              <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </g>
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="mail@site.com"
                />
              </label>

              {/* Phone Number Input */}
              <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <g fill="none">
                    <path d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z" fill="currentColor" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z" fill="currentColor" />
                  </g>
                </svg>
                <input
                  type="tel"
                  name="pnum"
                  value={formData.pnum}
                  onChange={handleChange}
                  className="tabular-nums"
                  required
                  placeholder="Phone"
                  pattern="[0-9]{10}"
                  title="Must be 10 digits"
                />
              </label>

              {/* Location Input */}
              <label className="input validator">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </g>
                </svg>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="City, State"
                  pattern="[A-Za-z\s,]{2,50}"
                  title="Use only letters, commas, and spaces. (2–50 chars)"
                />
              </label>

              <button type="submit" className="btn btn-soft btn-default mt-4">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;