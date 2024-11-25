'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search } from 'lucide-react'

const attendanceRecords = [
  {
    id: 1,
    name: "John Doe",
    usn: "1MS21CS001",
    entryDate: "2023-10-19",
    entryTime: "09:15:00",
    uniqueId: "JD001",
  },
  {
    id: 2,
    name: "Jane Smith",
    usn: "1MS21CS002",
    entryDate: "2023-10-19",
    entryTime: "09:20:00",
    uniqueId: "JS002",
  },
  {
    id: 3,
    name: "Bob Johnson",
    usn: "1MS21CS003",
    entryDate: "2023-10-19",
    entryTime: "09:25:00",
    uniqueId: "BJ003",
  },
  {
    id: 4,
    name: "Alice Brown",
    usn: "1MS21CS004",
    entryDate: "2023-10-19",
    entryTime: "09:30:00",
    uniqueId: "AB004",
  },
  {
    id: 5,
    name: "Charlie Davis",
    usn: "1MS21CS005",
    entryDate: "2023-10-19",
    entryTime: "09:35:00",
    uniqueId: "CD005",
  },
  {
    id: 6,
    name: "Charlie Davis",
    usn: "1MS21CS005",
    entryDate: "2023-10-19",
    entryTime: "09:35:00",
    uniqueId: "CD005",
  },
  // Add more mock data as needed
]

export function AttendanceTableComponent() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [recordsPerPage, setRecordsPerPage] = useState(5)

  const filteredRecords = attendanceRecords.filter((record) =>
    Object.values(record).some(
      (value) =>
        typeof value === 'string' &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord)

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      )

      if (currentPage > 3) {
        items.push(<PaginationEllipsis key="ellipsis-start" />)
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      if (currentPage < totalPages - 2) {
        items.push(<PaginationEllipsis key="ellipsis-end" />)
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

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
            <TableRow key={record.id}>
              <TableCell>{indexOfFirstRecord + index + 1}</TableCell>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.usn}</TableCell>
              <TableCell>{record.entryDate}</TableCell>
              <TableCell>{record.entryTime}</TableCell>
              <TableCell>{record.uniqueId}</TableCell>
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
  )
}