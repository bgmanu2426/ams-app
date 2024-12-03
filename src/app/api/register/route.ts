import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, email, password, usn, role } = await request.json();

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { usn }],
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User already exists with this email or USN",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        usn,
        role,
      });

      await newUser.save();
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User registered successfully",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error registering user",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
