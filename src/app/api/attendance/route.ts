import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");
  const role = searchParams.get("role");

  if (!uid || !role) {
    return new Response("UID and role are required", { status: 400 });
  }

  // Set SSE headers
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const stream = new ReadableStream({
    async start(controller) {
      // Connect to the database
      await dbConnect();

      // Function to fetch and send attendance data
      const sendAttendanceData = async () => {
        let attendanceData;

        try {
          if (role === "user") {
            const user = await UserModel.findOne({ uid }).select(
              "attendanceData"
            );
            if (user) {
              attendanceData = user.attendanceData;
            }
          } else if (role === "admin") {
            const users = await UserModel.find({}).select("attendanceData");
            attendanceData = users.flatMap((user) => user.attendanceData);
          }

          if (attendanceData) {
            const data = JSON.stringify({ attendanceData });
            controller.enqueue(`data: ${data}\n\n`);
          }
        } catch (error) {
          console.error("Error fetching attendance data:", error);
          const errorData = JSON.stringify({
            error: "Error fetching attendance data",
          });
          controller.enqueue(`data: ${errorData}\n\n`);
        }
      };

      // Initial data send
      await sendAttendanceData();

      // Set up MongoDB change stream to listen for database updates
      const pipeline = [{ $match: { operationType: "update" } }];
      const changeStream = UserModel.watch(pipeline);

      changeStream.on("change", async () => {
        // When a change occurs, send updated data
        await sendAttendanceData();
      });

      // Clean up when the connection is closed
      request.signal.addEventListener("abort", () => {
        changeStream.close();
        controller.close();
      });
    },
  });

  return new Response(stream, { headers });
}
