import type { Database } from "@/integrations/supabase/types";

export type TableName = keyof Database["public"]["Tables"];
export type TableRow<T extends TableName> = Database["public"]["Tables"][T]["Row"];

export type DashboardData = {
  guards: TableRow<"guards">[];
  sites: TableRow<"sites">[];
  clients: TableRow<"clients">[];
  contracts: TableRow<"contracts">[];
  shifts: TableRow<"shifts">[];
  assignments: TableRow<"shift_assignments">[];
  attendance: TableRow<"attendance_records">[];
  documents: TableRow<"guard_documents">[];
  audit: TableRow<"audit_logs">[];
};

export const emptyDashboardData: DashboardData = {
  guards: [], sites: [], clients: [], contracts: [], shifts: [], assignments: [], attendance: [], documents: [], audit: [],
};