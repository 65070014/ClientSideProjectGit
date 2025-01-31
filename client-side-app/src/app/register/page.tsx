"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  api?: string;
}

const FormSchema = z.object({
  username: z.string().min(1, 'Username is required').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must have than 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm Password is required')
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match'
});

export default function SignupForm() {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors: formErrors } } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  });

  const [errors, setErrors] = useState<Errors>({});
  
  const onSubmit = async (formData: FormData) => {
    try {
      const response = await fetch("/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        router.push("/login");
      } else {
        setErrors({ api: data.error || "Registration failed" });
      }
    } catch (error) {
      setErrors({ api: "Something went wrong!" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <input
            type="text"
            {...register("username")}
            placeholder="Username"
            required
            className="w-full px-3 py-2 border rounded-lg mb-3"
          />
          {formErrors.username && <p className="text-red-500 text-sm">{formErrors.username.message}</p>}

          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            required
            className="w-full px-3 py-2 border rounded-lg mb-3"
          />
          {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email.message}</p>}

          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            required
            className="w-full px-3 py-2 border rounded-lg mb-3"
          />
          {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password.message}</p>}

          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            required
            className="w-full px-3 py-2 border rounded-lg mb-3"
          />
          {formErrors.confirmPassword && <p className="text-red-500 text-sm">{formErrors.confirmPassword.message}</p>}

          {errors.api && <p className="text-red-500 text-sm">{errors.api}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}