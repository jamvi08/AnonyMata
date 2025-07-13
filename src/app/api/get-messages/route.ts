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
    if (!session || !session.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "User is not authenticated"
            }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" }
            }
        )
    }

    const user: User = session.user as User
    const userId = new mongoose.Types.ObjectId(user._id);

    console.log('User ID:', userId)

    // aggregation pipelines to get all messages
    try {
        const userMessages = await UserModel.aggregate([
            {
                $match: { _id: userId }
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

        if (!userMessages || userMessages.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User has no messages.",
                    user: userMessages
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                }
            )
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: userMessages[0].messages,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        )
    } catch (error) {
        console.log("Failed to get messages: ", error)

        return new Response(
            JSON.stringify({
                success: false,
                message: "Failed to get messages"
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        )
    }
}