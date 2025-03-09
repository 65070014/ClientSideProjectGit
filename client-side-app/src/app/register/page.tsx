"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { provinces } from "@/data/province";
// รายชื่อจังหวัดตัวอย่าง สามารถเพิ่มหรือแก้ไขได้

const FormSchema = z.object({
  username: z.string().min(1, 'Username is required').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must have at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm Password is required'),
  province: z.string().min(1, 'Province is required')
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
      province: "", // ค่า default สำหรับจังหวัด
    }
  });

  const [errors, setErrors] = useState<{ api?: string }>({});

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
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
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 text-center">
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

          {/* Dropdown สำหรับเลือกจังหวัด */}
          <select
            {...register("province")}
            required
            className="w-full px-3 py-2 border rounded-lg mb-3 bg-white"
          >
            <option value="">Select your province</option>
            {provinces.map((province) => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
          {formErrors.province && <p className="text-red-500 text-sm">{formErrors.province.message}</p>}

          {errors.api && <p className="text-red-500 text-sm">{errors.api}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
          >
            Sign Up
          </button>
        </form>
      </div>
      <p className="text-gray-500 text-sm">
        Have an account already?{" "}
        <a href="/login" className="text-gray-400 hover:text-gray-600">Login</a>
      </p>
    </div>
  );
}
