import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    // Locate the JSON file in the public/data directory
    const jsonDirectory = path.join(process.cwd(), 'public/data');
    const fileContents = await fs.readFile(jsonDirectory + '/resources.json', 'utf8');
    
    // Parse and return the data
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading resources.json:", error);
    return NextResponse.json(
      { error: 'Failed to load resources' },
      { status: 500 }
    );
  }
}