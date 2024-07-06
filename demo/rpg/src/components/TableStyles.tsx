import { Sx } from "@tempots/ui";

export function TableStyles() {
  return <Sx sx={{
    width: 240,
    td: { borderTop: '1px solid #eee', padding: "2px 4px", whiteSpace: 'nowrap' },
    'tr:first-child > td': { borderTop: 'none' },
    'td:last-child': { textAlign: 'right' },
    th: { fontWeight: 'bold', fontSize: '0.8em' }
  }} />
}