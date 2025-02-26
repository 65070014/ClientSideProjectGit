"use client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useWarningStore } from "../../store/warningStore";



export default function ProfilePage() {
    const { data: session, update } = useSession();
    const { register, handleSubmit } = useForm();
    const [message, setMessage] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [adminValue, setAdminValue] = useState("");
    const setWarningMessage = useWarningStore((state) => state.setWarningMessage);
    const warningMessage = useWarningStore((state) => state.warningMessage);


    const handleSetValue = () => {
        const newValue = `${selectedOption}: ${inputValue}`;
        setAdminValue(newValue);

        if (selectedOption === "ฝุ่น" && Number(inputValue) >= 80) {
            setWarningMessage("กรุณาใส่แมสก์ก่อนออกจากบ้านเนื่องจากค่าฝุ่นเกินค่ามาตรฐาน");
        } else {
            setWarningMessage("");
        }
    };




    async function onSubmit(data: any) {
        const res = await fetch("/api/change-profile/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            setMessage("Profile updated successfully!");
            update(); // Update session
        } else {
            setMessage("Update failed!");
        }
    }

    async function onSubmitPassword(data: any) {
        const res = await fetch("/api/change-password/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            setMessage("Password updated successfully!");
            update(); // Update session
        } else {
            setMessage("Update failed!");
        }
    }
    useEffect(() => {
        console.log("Session:", session);
    }, [session]);
    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center">Profile</h2>
            {session && session.user ? (
                session.user.role === 'USER' ? (
                    <>
                        <p className="text-center mb-4">Welcome, {session.user.name}!</p>
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                            <input
                                type="text"
                                {...register("username")}
                                defaultValue={session.user.name || ""}
                                placeholder="Username"
                                className="w-full px-3 py-2 border rounded-lg mb-3"
                            />
                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
                                Update Profile
                            </button>
                        </form>
                        <form onSubmit={handleSubmit(onSubmitPassword)} className="mt-4">
                            <input
                                type="password"
                                {...register("currentPassword")}
                                placeholder="Current Password"
                                className="w-full px-3 py-2 border rounded-lg mb-3"
                            />
                            <input
                                type="password"
                                {...register("newPassword")}
                                placeholder="New Password"
                                className="w-full px-3 py-2 border rounded-lg mb-3"
                            />
                            <button type="submit" className="w-full bg-red-800 text-white py-2 rounded-lg">
                                Change Password
                            </button>
                        </form>
                    </>
                ) : session.user.role === 'ADMIN' ? (
                    <>
                        <p className="text-center mb-4">Admin Panel: {session.user.name}</p>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h3 className="text-xl font-bold mb-3">Admin Controls</h3>

                            {/* Dropdown เลือกประเภท */}
                            <div className="flex items-center space-x-2 mb-3">
                                <select
                                    value={selectedOption}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="">-- เลือกข้อมูล --</option>
                                    <option value="สภาพอากาศ">สภาพอากาศ</option>
                                    <option value="ฝุ่น">ฝุ่น</option>
                                </select>
                            </div>

                            {/* Input Box กรอกค่าตามที่เลือก */}
                            {selectedOption && (
                                <div className="flex items-center space-x-2 mb-3">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={`กรอกค่า ${selectedOption}`}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                    <button
                                        onClick={handleSetValue}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                    >
                                        Set
                                    </button>
                                </div>
                            )}

                            {/* แสดงค่าที่ถูกตั้งค่า */}
                            {adminValue && (
                                <p className="mt-3 text-center text-lg font-semibold">
                                    {adminValue}
                                </p>
                            )}
                            {/* แสดงข้อความเตือนถ้าฝุ่นเกิน 80 */}
                            {warningMessage && (
                                <p className="mt-3 text-center text-yellow-600 text-sm">
                                    {warningMessage}
                                </p>
                            )}

                        </div>

                    </>

                ) : (
                    <p className="text-center">Unauthorized access.</p>
                )
            ) : (
                <p className="text-center">
                    Please <a href="/login" className="text-gray-400 hover:text-gray-600">Login</a> to update your profile.
                </p>
            )}
            {message && <p className="text-center mt-2">{message}</p>}
        </div>
    );
}
