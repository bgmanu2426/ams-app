import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Import your database connection function
import UserModel from '@/models/user.model';

export async function POST(request: NextRequest) {
    try {
        // Establish database connection
        await dbConnect();

        // Parse the request body
        const body = await request.json();
        const { uid, role } = body;

        if (!uid) {
            return NextResponse.json(
                { success: false, message: 'UID is required' },
                { status: 400 }
            );
        }

        let attendanceData;
        // Fetch the attendance data from the database
        if (role === 'user') {
            const user = await UserModel.findOne({ uid }).select('attendanceData');
            if (user) {
                attendanceData = user.attendanceData;
            }
        } else if (role === 'admin') {
            const users = await UserModel.find({}).select('attendanceData');
            attendanceData = users.flatMap((user) => user.attendanceData);
        }

        if (!attendanceData) {
            return NextResponse.json(
                { success: false, message: 'No attendance data found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, attendanceData },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}