import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request) {
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

    const userId = new mongoose.Types.ObjectId(user._id);

    // aggregation pipelines to get all messages

    try {
        const user = await UserModel.aggregate([
            {
                $match: { id: userId }
            },
            {
                $unwind: "$messages"
            },
            {
                $sort: { "messages.createdAt": -1 }
            },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" }
                }
            }
        ])

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found, hence no messages.",
                    user
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: user[0].messages,
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Failed to get messages: ", error)

        return Response.json(
            {
                success: false,
                message: "Failed to get messages"
            },
            {
                status: 500
            }
        )
    }

}