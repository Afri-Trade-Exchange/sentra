import { memo } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import Footer from './Footer';
import { useLoginForm } from '../hooks/useLoginForm';
import { LoginForm } from './LoginForm';
import HeroSection from './HeroSection';

const TraderLogin = () => {
  const {
    formState,
    uiState,
    handleInputChange,
    handleSubmit,
    handleGoogleSignIn,
    setUiState
  } = useLoginForm();

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex bg-gray-100">
          <HeroSection />
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white shadow-2xl rounded-[15px] p-10">
              <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
                Login to Your Account
              </h2>
              <p className="text-gray-600 mb-8 text-center">
                Welcome Back. Please enter your details.
              </p>
              
              <LoginForm
                formState={formState}
                uiState={uiState}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onGoogleSignIn={handleGoogleSignIn}
                setUiState={setUiState}
              />

              <p className="mt-8 text-center text-gray-600">
                Don't have an account?{' '}
                <Link to="/tradersignup" className="text-teal-500 hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Layout>
  );
};

export default memo(TraderLogin);
