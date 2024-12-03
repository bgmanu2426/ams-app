// src/components/attendance-table.tsx

'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { User } from "next-auth";

export function AttendanceTableComponent() {
  const { data: session } = useSession();
  const user: User = session?.user;

  interface AttendanceRecord {
    name: string;
    usn: string;
    entryDate: string;
    entryTime: string;
    uid: string;
  }

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  useEffect(() => {
    if (user?.uid && user?.role) {
      const eventSource = new EventSource(`/api/attendance?uid=${user.uid}&role=${user.role}`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.attendanceData) {
          setAttendanceRecords(data.attendanceData);
        } else if (data.error) {
          console.error(data.error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [user]);

  // Filter, pagination, and render logic...

  const filteredRecords = attendanceRecords.filter((record) =>
    Object.values(record).some(
      (value) =>
        typeof value === 'string' &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(<PaginationEllipsis key="ellipsis-start" />);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(<PaginationEllipsis key="ellipsis-end" />);
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-[200px]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Show:</span>
          <select
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(Number(e.target.value))}
            className="border rounded p-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span className="text-sm text-muted-foreground">entries</span>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Sl. No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>USN</TableHead>
            <TableHead>Entry Date</TableHead>
            <TableHead>Entry Time</TableHead>
            <TableHead>Unique ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentRecords.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{indexOfFirstRecord + index + 1}</TableCell>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.usn}</TableCell>
              <TableCell>{record.entryDate}</TableCell>
              <TableCell>{record.entryTime}</TableCell>
              <TableCell>{record.uid}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length} entries
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(Math.max(1, currentPage - 1))} />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}