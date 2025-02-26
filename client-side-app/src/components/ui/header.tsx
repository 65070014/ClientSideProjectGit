import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UserCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect} from "next/navigation";
    

export default function Header() {
    const { data: session} = useSession();

    return (
        <header className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow-md z-50 flex justify-between items-center p-4">
            <div className="text-xl font-bold flex items-center gap-2">
                🌤️ Thailand Weather & PM2.5 Forecast
            </div>
            <div>
                {session && session.user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <UserCircle size={24} />
                                <span>{session.user.name}</span>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => redirect("/profile")}>Profile</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => ""}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex gap-2">
                        <Button className="bg-white text-blue-600 hover:bg-blue-200 cursor-pointer" onClick={() => redirect("/login")}>Login</Button>
                        <Button className="bg-white text-blue-600 hover:bg-blue-200 cursor-pointer" onClick={() => redirect("/register")}>Register</Button>
                    </div>
                )}
            </div>
        </header>
    );
}
