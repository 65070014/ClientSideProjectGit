"use client"; 
import { useState } from "react";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";


export default function LoginPage() {
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.ok) {
      router.push("/"); 
    } else {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full px-3 py-2 border rounded-lg mb-3"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-3 py-2 border rounded-lg mb-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => signIn("google",{callbackUrl:'http://localhost:3000/'})}
            className="w-full bg-red-500 text-white py-2 rounded-lg mb-2"
          >
            Login with Google
          </button>
          <button
            onClick={() => redirect("/register")}
            className="w-full bg-black text-white py-2 rounded-lg mt-2"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
