"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useCallback, useEffect, useState } from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form"
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from 'axios'
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const [variant,setVariant] = useState<Variant>("LOGIN");
  const [isLoading,setIsLoading] = useState<boolean >(false);
  
  const session = useSession();
  const router = useRouter();

  useEffect(()=>{
    if(session.status === 'authenticated'){
        router.push("/users");
    }
  },[session.status,router])

  const togglerVariant = useCallback(()=>{
    if(variant === "LOGIN") {
        setVariant("REGISTER");
    }
    else{
        setVariant("LOGIN");
    }
  },[variant]);

  const {
    register,
    handleSubmit,
    formState:{
        errors
    }
  } = useForm<FieldValues>({
    defaultValues:{
        name:"",
        email:"",
        password:""
    }
  });

//   register or login via credentails
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);

        if (variant === "REGISTER") {
            axios.post("/api/register", data)
            .then(() => {
                toast.success("Registered!");
                setIsLoading(false);
            })
            .catch(() => {
                toast.error("Something went wrong");
                setIsLoading(false);
            })
        }

        if (variant === "LOGIN") {
            signIn("credentials", {
                ...data,
                redirect: false
            }).then((callback) => {
                if (callback?.error) {
                    toast.error("Invalid credentials");
                } else {
                    toast.success("Logged in!");
                }
            }).catch(error => {
                console.error("Sign-in error:", error);
                toast.error("Something went wrong");
            }).finally(()=>{
                setIsLoading(false);
            })
        }
    };


  // register or login via social 
  const socialAction = async (action: string) => {
    setIsLoading(true);

    signIn(action,{ redirect:false })
    .then((callback)=>{
        if(callback?.error){
            toast.error("Invalid Credentials");
        }
        else if(callback?.ok){
            toast.success("Logged In");
        }
    }).finally(()=>{
        setIsLoading(false);
    })
    
  }


  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">

            {/* login & singup from */}
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {
                    variant === "REGISTER" &&
                    <Input id="name" label="Name" register={register} errors={errors} disabled={isLoading}/>
                }
                <Input id="email" label="Email Address" register={register} errors={errors} disabled={isLoading}/>
                <Input id="password" label="Password" register={register} errors={errors} disabled={isLoading}/>

                <div>
                    <Button
                    disabled={isLoading}
                    fullWidth
                    type="submit"
                    >
                        {variant === "LOGIN" ? "Sign In" : "Register"}
                    </Button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        {/* self closing div for border */}
                        <div className="w-full border-t bg-gray-300"/>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* social icon for auth */}
                <div className="mt-6 flex gap-2">
                    <AuthSocialButton icon={BsGithub}
                    onClick={()=> socialAction("github")}/>
                    <AuthSocialButton icon={BsGoogle}
                    onClick={()=> socialAction("google")}/>
                </div>
            </div>

                {/* user guidance if they haven't account or already have an account */}
            <div className="flex gap-2 justify-center text-sm mt-6 py-2 text-gray-500">
                <div>
                    {variant === "LOGIN" ? "New to Messenger?" : "Already have an account?"}
                </div>
                <div
                onClick={togglerVariant}
                className="underline cursor-pointer"
                >
                    {variant === 'LOGIN' ? "Create an account" : "Login"}
                </div>
            </div>
        </div>
    </div>
  )
}

export default AuthForm