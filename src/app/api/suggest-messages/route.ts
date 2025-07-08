import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');


export async function POST(req: Request) {

    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

        const geminiStream = await genAI
            .getGenerativeModel({ model: 'gemini-pro' })
            .generateContentStream(prompt);

        // Convert the response into a friendly text-stream
        const stream = GoogleGenerativeAIStream(geminiStream);
        console.log(stream)

        console.log(new StreamingTextResponse(stream))
        // Respond with the stream

        return new StreamingTextResponse(stream)
    } catch (error) {
        console.log("Error while geenrating propmts: ", error)
        return Response.json({
            error: "Error while geenrating propmts"
        })
    }
}