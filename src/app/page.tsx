"use client";

import { AttendanceTableComponent } from "@/components/attendance-table";

export default function Home() {
  return (
    <>
      <div className="flex flex-col md:mt-10 md:mx-20 mt-3 mx-5">
        <AttendanceTableComponent />
      </div>
    </>
  );
}