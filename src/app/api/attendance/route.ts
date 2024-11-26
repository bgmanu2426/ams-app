import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@/models/user.model';

export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const body = await request.json();
        const { uid } = body;

        if (!uid) {
            return NextResponse.json(
                { success: false, message: 'UID is required' },
                { status: 400 }
            );
        }

        // Fetch the attendance data from the database
        const attendanceData = await UserModel.findOne({ uid }, 'attendanceData');

        if (!attendanceData) {
            return NextResponse.json(
                { success: false, message: 'No attendance data found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, attendanceData: attendanceData.attendanceData },
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