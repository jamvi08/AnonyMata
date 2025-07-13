import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    // Get currently logged-in user
    const session = await getServerSession(authOptions);
    console.log('Session: ', session);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessages: acceptMessages
            },
            {
                new: true
            }
        );

        if (!updatedUser) {
            // User not found
            return Response.json(
                {
                    success: false,
                    message: 'Unable to find user to update message acceptance status',
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'Message acceptance status updated successfully',
                updatedUser,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating message acceptance status:', error);
        return Response.json(
            {
                success: false, message: 'Error updating message acceptance status'
            },
            {
                status: 500
            }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();

    // Get currently logged-in user
    const session = await getServerSession(authOptions);
    console.log('Session: ', session);
    const user: User = session?.user as User;

    if (!session || !user) {
        return Response.json(
            {
                success: false, message: 'Not authenticated'
            },
            {
                status: 401
            }
        );
    }

    const userId = user._id;

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                },
                {
                    status: 404
                }
            );
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessages: user.isAcceptingMessage,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error retrieving message acceptance status:', error);
        return Response.json(
            {
                success: false,
                message: 'Error retrieving message acceptance status'
            },
            {
                status: 500
            }
        );
    }
}