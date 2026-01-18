
import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";


async function seedAdmin() {
    try {
        const adminData = {
            name: "admin Saheb",
            email: "admin@gmail.com",
            role: UserRole.ADMIN,
            password: "admin1234"

        }
        //check user in database
        console.log("*****checking user in database**********"); 
        const existsUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })

        console.log("loading................users",existsUser);
        if(existsUser){
    
            throw new Error("User already exists in database")
        }
        // save data in database 
        const signUpAdmin = await fetch("http://localhost:3000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                 "Origin": "http://localhost:3000"

            },
            body: JSON.stringify(adminData)
        })
        console.log(signUpAdmin);
        if(signUpAdmin.ok){
            // updateing data email verificaiton data 
            console.log("updating email verification fields*****************");
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            })
        }
        
        console.log("***************Success**********");
    } catch (error) {
        console.log('error happen in seedAdmin function', error);
    }
}
seedAdmin()