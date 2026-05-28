import { cn } from "@/lib/utils";

function DataTable({ className, children }) {
  return (
    <div
      className={cn(
        "neo-card overflow-hidden p-0",
        className
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function DataTableHeader({ children }) {
  return (
    <thead className="bg-secondary/50 border-b-4 border-[var(--neo-black)]">
      {children}
    </thead>
  );
}

function DataTableRow({ className, children, ...props }) {
  return (
    <tr
      className={cn(
        "border-b-2 border-[var(--neo-black)]/20 hover:bg-muted/50 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

function DataTableHead({ className, children, ...props }) {
  return (
    <th
      className={cn(
        "px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

function DataTableCell({ className, children, ...props }) {
  return (
    <td
      className={cn("px-5 py-4 text-sm font-medium align-middle", className)}
      {...props}
    >
      {children}
    </td>
  );
}

function DataTableBody({ children }) {
  return <tbody className="bg-card divide-y-2 divide-[var(--neo-black)]/10">{children}</tbody>;
}

export {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableHead,
  DataTableCell,
};
