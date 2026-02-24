import { NextResponse } from 'next/server';
import fs from 'fs';

// Queue File Location (Must match the one in parent route)
const QUEUE_FILE = '/tmp/signup-queue.json';

// Helper to read queue
function readQueue() {
    try {
        if (!fs.existsSync(QUEUE_FILE)) {
            return [];
        }
        const data = fs.readFileSync(QUEUE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// Helper to write queue
function writeQueue(data: any[]) {
    try {
        fs.writeFileSync(QUEUE_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Failed to write queue", e);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { timestamp } = body;

        if (!timestamp) {
            return NextResponse.json({ error: "Timestamp required" }, { status: 400 });
        }

        let queue = readQueue();

        // Remove the processed item (filter out match)
        // We use loose comparison just in case, but strict should work if types align
        const initialLength = queue.length;
        queue = queue.filter((s: any) => s.timestamp !== timestamp);

        if (queue.length !== initialLength) {
            writeQueue(queue);
            return NextResponse.json({ success: true, message: "Item removed" });
        } else {
            return NextResponse.json({ success: false, message: "Item not found" });
        }

    } catch (e) {
        console.error("Mark processed error", e);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
