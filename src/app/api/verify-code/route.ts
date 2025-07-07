import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })

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

        const isCodeValid = user.verifyCode === code && user.verifyCodeExpiry > new Date()
        const isCodeNotExpired = user.verifyCodeExpiry > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json(
                {
                    success: true,
                    message: "User has been verified successfully."
                },
                {
                    status: 200
                }
            )
        }
        else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired. Signup again to get a new code."
                },
                {
                    status: 400
                }
            )
        }
        else if (!isCodeValid) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid verification code."
                },
                {
                    status: 400
                }
            )
        }

    } catch (error) {
        console.log("Error while verifying user code: ", error)
        return Response.json(
            {
                message: "Error while verifying user code"
            },
            {
                status: 500
            }
        )
    }
}