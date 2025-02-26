import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UserCircle } from "lucide-react";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("John Doe");

    return (
        <header className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow-md z-50 flex justify-between items-center p-4">
            <div className="text-xl font-bold flex items-center gap-2">
                🌤️ Thailand Weather & PM2.5 Forecast
            </div>
            <div>
                {isLoggedIn ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <UserCircle size={24} />
                                <span>{userName}</span>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => alert("Profile clicked")}>Profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex gap-2">
                        <Button className="bg-white text-blue-600 hover:bg-blue-200 cursor-pointer" onClick={() => alert("Login")}>Login</Button>
                        <Button className="bg-white text-blue-600 hover:bg-blue-200 cursor-pointer" onClick={() => alert("Register")}>Register</Button>
                    </div>
                )}
            </div>
        </header>
    );
}
