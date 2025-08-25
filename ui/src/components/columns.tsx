import type { LogRequest } from '../../../src/types/request.types.ts';
import type { ColumnDef } from "@tanstack/react-table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export const logTableColumns: ColumnDef<LogRequest>[] = [
  {
    accessorKey: "path",
    header: "Path",
    cell: info => info.getValue() || 'N/A'
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: info => info.getValue() || 'N/A'
  },
  {
    accessorKey: "start_time",
    header: "Timestamp",
    cell: info => info.getValue() || 'N/A'
  },
  {
    accessorKey: "status_code",
    header: "Status",
    cell: info => info.getValue() || 'N/A',

  },
  {
    accessorKey: "error",
    header: "Error Message",
    cell: (info) => {
      const errorMsg = info.getValue() as string || 'N/A';
      return (
        <HoverCard>
          <HoverCardTrigger>
            <div className="max-w-xs truncate">
              {errorMsg}
            </div>
          </HoverCardTrigger>
          {errorMsg !== 'N/A' && (
            <HoverCardContent className="w-fit">
              <pre className="whitespace-pre-wrap">{errorMsg}</pre>
            </HoverCardContent>
          )}
        </HoverCard>
      );
    }
  },
  {
    accessorKey: "error_stack",
    header: "Error Stack",
    cell: (info) => {
      const errorStack = info.getValue() as string || 'N/A';
      return (
        <HoverCard>
          <HoverCardTrigger>
            <div className="max-w-xs truncate">
              {errorStack}
            </div>
          </HoverCardTrigger>
          {errorStack !== 'N/A' && (
            <HoverCardContent className="w-fit">
              <pre className="whitespace-pre-wrap">{errorStack}</pre>
            </HoverCardContent>
          )}
        </HoverCard>
      );
    }
  },
]