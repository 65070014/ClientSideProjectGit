'user client'

import { Button } from "@mui/material"
import exp from "constants"
import { signOut } from "next-auth/react"

const UserAccountnav = () => {
    return(
        <Button onClick={() => signOut()} className="cursor-pointer"> Sign Out</Button>
    )
 }

export default UserAccountnav