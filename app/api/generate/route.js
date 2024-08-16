route.js in Generate
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ReadableStream } from 'web-streams-polyfill';

// Define the system prompt to initialize the chat context
const systemPrompt = `Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:

1. Create clear concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications. 
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help the user's specified preferences. 
8. Tailor the difficulty level of the flashcards to the user's specified preferences.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.

Remember, the goal is to facilitate learning and retention of information through these flashcards.

Return in the following JSON format:

{
    "flashcards": {
        "front": "string",
        "back": "string"
    }
}
`;

// Initialize GoogleGenerativeAI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const data = await req.json();

  // Validate the incoming request
  if (!data || !Array.isArray(data.messages)) {
    return new NextResponse('Bad Request: Missing or invalid data', { status: 400 });
  }

  const userMessage = data.messages.length > 0 ? data.messages[data.messages.length - 1].content : '';

  try {
    // Generate the AI response
    const result = await genAI.generateMessage({
      model: "gemini-1.5-flash",  // Use the appropriate model
      prompt: {
        role: "system",
        content: systemPrompt,
      },
      messages: [
        { role: "user", content: userMessage },
      ],
    });

    // Generate the AI response as a stream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          let content = '';
          for await (const chunk of result.stream) {
            if (typeof chunk === 'string') {
              content += chunk;
            } else if (chunk && typeof chunk === 'object' && 'text' in chunk) {
              content += chunk.text;
            } else {
              console.error('Unexpected chunk format:', chunk);
            }
            // Flush the content to the stream as it becomes available
            controller.enqueue(encoder.encode(content));
          }
        } catch (err) {
          console.error('Error processing stream:', err);
          controller.error(err);
        } finally {
          controller.close();
        }
      }
    });

    return new NextResponse(stream);

  } catch (error) {
    console.error('Error during API call:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

