import dbConnect from '@/lib/dbConnect';
import { formattedDate, formattedTime } from '@/lib/utilities';
import UserModel from '@/models/user.model';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    if (!uid) {
        return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }
    await dbConnect();

    try {
        const getUserByUid = await UserModel.findOne({ uid });

        if (getUserByUid) {
            await UserModel.updateOne(
                { uid: uid },
                {
                    $push: {
                        attendanceData: {
                            name: getUserByUid.name,
                            email: getUserByUid.email,
                            usn: getUserByUid.usn,
                            uid,
                            entryDate: formattedDate,
                            entryTime: formattedTime,
                        }
                    }
                }
            );

            return Response.json(
                {
                    success: true,
                    message: 'User attendance registered successfully',
                },
                { status: 201 }
            );
        } else if (!getUserByUid) {
            const userWithEmptyUid = await UserModel.findOne({ uid: "" });

            if (userWithEmptyUid) {
                userWithEmptyUid.uid = uid;
                await userWithEmptyUid.save();

                return Response.json(
                    {
                        success: true,
                        message: 'User registered successfully',
                    },
                    { status: 201 }
                );
            } else {
                return Response.json(
                    {
                        success: false,
                        message: 'User not found',
                    },
                    { status: 404 }
                );
            }
        }
    } catch (error) {
        console.error('Error registering user:', error);
        return Response.json(
            {
                success: false,
                message: 'Error registering user',
            },
            { status: 500 }
        );
    }
}
