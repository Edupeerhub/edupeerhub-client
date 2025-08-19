import React from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/ui/Button";
import AuthIntro from "../../components/auth/AuthIntro";
import Input from "../../components/ui/Input";

const SignupPage = () => {
  return (
    <AuthLayout>
     <div className="bg-[#FCFCFC]  flex flex-col justify-between w-[543px] h-[846px] pt-[36px] pr-[16px] pb-[36px] pl-[16px] ">
        
        {/* Top intro text */}
        <AuthIntro
          heading="Welcome To Edupeerhub"
          subText="Already have an account?"
          linkText="Log In"
          linkTo="/login"
        />

        {/* Form */}
        <form className="space-y-4 flex-1 flex flex-col justify-center">
          <Input label="First Name" name="firstName" />
          <Input label="Last Name" name="lastName" />
          <Input label="Email" name="email" />
          <Input label="Password" type="password" name="password" />
          <Button>Create Account</Button>
        </form>

        {/* Terms */}
       {/* Terms Section */}
       <div className="flex flex-col items-center gap-[4px] w-[328px] h-[52px] mx-auto mt-4">
         <p className="text-sm text-[#727C84] text-center">
            By creating an account, you agree to our
         </p>
         <div className="flex gap-2">
           <a href="/terms" className="text-sm text-blue-600 hover:underline">
             Terms of Service
           </a>
           <span className="text-sm text-[#727C84]">and</span>
           <a href="/privacy" className="text-sm text-blue-600 hover:underline">
              Privacy Policy
           </a>
         </div>
       </div>
     </div>
    </AuthLayout>
  );
};

export default SignupPage;