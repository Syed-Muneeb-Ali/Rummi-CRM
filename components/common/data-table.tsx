 "use client"

 import * as React from "react"
 import {
   flexRender,
   type ColumnDef,
   type ColumnFiltersState,
   getCoreRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
   getSortedRowModel,
   type SortingState,
   useReactTable,
 } from "@tanstack/react-table"

 import { cn } from "@/lib/utils"
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table"
 import { Button } from "@/components/ui/button"

 function DataTable<TData, TValue>({
   columns,
   data,
   initialSorting,
   initialPageSize = 10,
   className,
 }: DataTableProps<TData, TValue>) {
   const [sorting, setSorting] = React.useState<SortingState>(
     initialSorting ?? [],
   )
   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
     [],
   )

   const table = useReactTable({
     data,
     columns,
     state: {
       sorting,
       columnFilters,
     },
     enableSortingRemoval: false,
     onSortingChange: setSorting,
     onColumnFiltersChange: setColumnFilters,
     getCoreRowModel: getCoreRowModel(),
     getSortedRowModel: getSortedRowModel(),
     getFilteredRowModel: getFilteredRowModel(),
     getPaginationRowModel: getPaginationRowModel(),
     initialState: {
       pagination: {
         pageSize: initialPageSize,
       },
     },
   })

   return (
     <div className={cn("space-y-3", className)}>
       <div className="border rounded-md">
         <Table>
           <TableHeader>
             {table.getHeaderGroups().map(headerGroup => (
               <TableRow key={headerGroup.id}>
                 {headerGroup.headers.map(header => (
                   <TableHead key={header.id}>
                     {header.isPlaceholder
                       ? null
                       : flexRender(
                           header.column.columnDef.header,
                           header.getContext(),
                         )}
                   </TableHead>
                 ))}
               </TableRow>
             ))}
           </TableHeader>
           <TableBody>
             {table.getRowModel().rows?.length ? (
               table.getRowModel().rows.map(row => (
                 <TableRow
                   key={row.id}
                   data-state={row.getIsSelected() ? "selected" : undefined}
                 >
                   {row.getVisibleCells().map(cell => (
                     <TableCell key={cell.id}>
                       {flexRender(
                         cell.column.columnDef.cell,
                         cell.getContext(),
                       )}
                     </TableCell>
                   ))}
                 </TableRow>
               ))
             ) : (
               <TableRow>
                 <TableCell
                   colSpan={columns.length}
                   className="text-center h-24"
                 >
                   No results
                 </TableCell>
               </TableRow>
             )}
           </TableBody>
         </Table>
       </div>

       <div className="flex items-center justify-between gap-2">
         <div className="text-muted-foreground text-sm">
           Page {table.getState().pagination.pageIndex + 1} of{" "}
           {table.getPageCount() || 1}
         </div>
         <div className="flex items-center gap-2">
           <Button
             variant="outline"
             size="sm"
             onClick={() => table.previousPage()}
             disabled={!table.getCanPreviousPage()}
           >
             Previous
           </Button>
           <Button
             variant="outline"
             size="sm"
             onClick={() => table.nextPage()}
             disabled={!table.getCanNextPage()}
           >
             Next
           </Button>
         </div>
       </div>
     </div>
   )
 }

 export { DataTable }

 interface DataTableProps<TData, TValue> {
   columns: ColumnDef<TData, TValue>[]
   data: TData[]
   initialSorting?: SortingState
   initialPageSize?: number
   className?: string
 }


