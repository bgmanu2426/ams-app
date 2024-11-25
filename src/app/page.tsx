"use client";

import { AttendanceTableComponent } from "@/components/attendance-table";

export default function Home() {
  return (
    <>
      <div className="flex flex-col mt-10 mx-20">
        <AttendanceTableComponent />
      </div>
    </>
  );
}