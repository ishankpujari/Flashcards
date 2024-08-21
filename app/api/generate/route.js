import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    console.log('API route hit');
    try {
        const body = await req.json();
        console.log('Received request body:', body);

        if (!body.text || typeof body.text !== 'string' || body.text.trim() === '') {
            console.error('Invalid or missing text in request body');
            return NextResponse.json({ error: 'Invalid or missing text' }, { status: 400 });
        }

        console.log('Text to process:', body.text);

        // Set up the model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Generate content
        const result = await model.generateContent(body.text);

        // Get the response
        const response = await result.response;
        let responseText = response.text();
        console.log('AI Response:', responseText);

        // Remove markdown syntax if present (both with and without 'json' identifier)
        responseText = responseText.replace(/```(?:json)?\n|\n```|""/g, '');

        // Parse the response
        try {
            const flashcards = JSON.parse(responseText);
            if (!Array.isArray(flashcards)) {
                throw new Error('Response is not an array');
            }
            return NextResponse.json(flashcards);
        } catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            return NextResponse.json({ error: 'Invalid response from AI', details: responseText }, { status: 500 });
        }
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}