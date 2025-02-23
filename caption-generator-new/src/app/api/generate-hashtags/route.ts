import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { keyword } = await request.json();

    const prompt = `Generate 10 relevant and trending hashtags for ${keyword}. 
    Include both popular and niche hashtags. 
    Return only the hashtags separated by spaces, with the # symbol.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const hashtagString = completion.choices[0].message.content || '';
    const hashtags = hashtagString
      .split(' ')
      .filter(tag => tag.startsWith('#'))
      .slice(0, 10);

    return NextResponse.json({ hashtags });
  } catch (error) {
    console.error('Error generating hashtags:', error);
    return NextResponse.json(
      { error: 'Failed to generate hashtags' },
      { status: 500 }
    );
  }
}
