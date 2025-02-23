import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { keyword, tone } = await request.json();

    const prompt = `Generate a ${tone.toLowerCase()} social media caption about ${keyword}. 
    The caption should be engaging and include emojis where appropriate. 
    Keep it under 200 characters.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const caption = completion.choices[0].message.content;

    return NextResponse.json({ caption });
  } catch (error) {
    console.error('Error generating caption:', error);
    return NextResponse.json(
      { error: 'Failed to generate caption' },
      { status: 500 }
    );
  }
}
