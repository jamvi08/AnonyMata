import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";


export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid
    await dbConnect()

    // get currently logged in user
    const session = await getServerSession(authOptions)
    console.log('Session: ', session)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "User is not authenticated"
            },
            {
                status: 401
            }
        )
    }

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        )

        if (updatedResult.modifiedCount === 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message deleted successfully"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error deleting message: ", error)
        return Response.json(
            {
                success: false,
                message: "Error deleting message"
            },
            {
                status: 500

            }
        )
    }



}