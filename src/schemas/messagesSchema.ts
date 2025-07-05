import { z } from "zod";

export const messagesSchema = z.object({
    content: z
        .string()
        .min(10, { message: "Message must be at least 10 characters long." })
        .max(300, { message: "Message can be at most 300 characters long." })
});