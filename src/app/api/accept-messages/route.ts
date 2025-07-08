import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(request: Request) {
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

    const userId = user._id;
    const { acceptMessages } = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessages: acceptMessages
            },
            {
                new: true
            }
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user status",
                    updatedUser
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User status updated successfully"
            }
        )

    } catch (error) {
        console.log("Failed to update user status: ", error)

        return Response.json(
            {
                success: false,
                message: "Failed to update user status"
            },
            {
                status: 500
            }
        )
    }

}

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

    const userId = user._id;

    try {
        const user = await UserModel.findById(userId)

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User found",
                isAcceptingMessages: user.isAcceptingMessage,
                user
            }
        )

    } catch (error) {
        console.log("Error while getting update messqages status: ", error)

        return Response.json(
            {
                success: false,
                message: "Failed to get user"
            },
            {
                status: 500
            }
        )
    }
}