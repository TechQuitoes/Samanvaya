"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   ETABLE                                   */
/* -------------------------------------------------------------------------- */

export interface ETableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
}

export const ETable = forwardRef<HTMLTableElement, ETableProps>(
  ({ className, containerClassName, children, ...props }, ref) => (
    <div
      className={cn(
        "w-full overflow-x-auto relative z-10",
        containerClassName
      )}
    >
      <table
        ref={ref}
        className={cn("w-full text-left border-collapse text-xs", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
);
ETable.displayName = "ETable";

/* -------------------------------------------------------------------------- */
/*                                ETABLEHEADER                                */
/* -------------------------------------------------------------------------- */

export interface ETableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const ETableHeader = forwardRef<
  HTMLTableSectionElement,
  ETableHeaderProps
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "border-b border-[#e5d9c3] bg-[#faf4e8]/80 text-[#5a4836] font-bold text-xs uppercase tracking-wider",
      className
    )}
    {...props}
  />
));
ETableHeader.displayName = "ETableHeader";

/* -------------------------------------------------------------------------- */
/*                                 ETABLEBODY                                 */
/* -------------------------------------------------------------------------- */

export interface ETableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const ETableBody = forwardRef<HTMLTableSectionElement, ETableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn("divide-y divide-[#e5d9c3]/50", className)}
      {...props}
    />
  )
);
ETableBody.displayName = "ETableBody";

/* -------------------------------------------------------------------------- */
/*                                  ETABLEROW                                 */
/* -------------------------------------------------------------------------- */

export interface ETableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  clickable?: boolean;
}

export const ETableRow = forwardRef<HTMLTableRowElement, ETableRowProps>(
  ({ className, clickable = false, onClick, ...props }, ref) => (
    <tr
      ref={ref}
      onClick={onClick}
      className={cn(
        "transition-colors",
        (clickable || onClick) && "hover:bg-[#fcfaf5] cursor-pointer group",
        className
      )}
      {...props}
    />
  )
);
ETableRow.displayName = "ETableRow";

/* -------------------------------------------------------------------------- */
/*                                 ETABLEHEAD                                 */
/* -------------------------------------------------------------------------- */

export interface ETableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  alignRight?: boolean;
}

export const ETableHead = forwardRef<HTMLTableCellElement, ETableHeadProps>(
  ({ className, alignRight = false, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "py-3.5 px-3 font-bold text-[#5a4836] select-none",
        alignRight && "text-right",
        className
      )}
      {...props}
    />
  )
);
ETableHead.displayName = "ETableHead";

/* -------------------------------------------------------------------------- */
/*                                 ETABLECELL                                 */
/* -------------------------------------------------------------------------- */

export interface ETableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  alignRight?: boolean;
  nowrap?: boolean;
}

export const ETableCell = forwardRef<HTMLTableCellElement, ETableCellProps>(
  ({ className, alignRight = false, nowrap = false, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "py-4 px-3 align-middle text-[#2c221e]",
        nowrap && "whitespace-nowrap",
        alignRight && "text-right",
        className
      )}
      {...props}
    />
  )
);
ETableCell.displayName = "ETableCell";

export default ETable;
