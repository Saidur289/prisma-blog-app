import app from "./app";
import { prisma } from "./lib/prisma";
const PORT = process.env.POST || 3001
async function main() {
    try {
        await prisma.$connect()
        app.listen(PORT, () => {
            console.log("Database is connect", PORT);
        })

    } catch (error) {
        console.log("error happen in server.ts", error);
        await prisma.$disconnect()
        process.exit(1)
    }
}
main()