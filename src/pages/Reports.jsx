import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { FileText, Sheet } from 'lucide-react'
import { useData } from '../context/DataContext'
import { Card, PrimaryButton, GhostButton } from '../components/ui'

const STATUS_COLORS = { New: 'var(--azure)', Contacted: 'var(--gold)', Interested: 'var(--ember)', Won: 'var(--emerald)', Lost: 'var(--crimson)' }

function toCSV(rows) {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const lines = [headers.join(',')]
  rows.forEach((r) => lines.push(headers.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`).join(',')))
  return lines.join('\n')
}

function download(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

export default function Reports() {
  const { customers, leads, tasks } = useData()

  const leadStatusData = Object.keys(STATUS_COLORS).map((status) => ({
    name: status, value: leads.filter((l) => l.status === status).length,
  }))

  const taskStatusData = [
    { name: 'Pending', value: tasks.filter((t) => t.status === 'Pending').length },
    { name: 'Completed', value: tasks.filter((t) => t.status === 'Completed').length },
  ]

  const exportCustomersCSV = () => download('customers-report.csv', toCSV(customers), 'text/csv')
  const exportLeadsCSV = () => download('leads-report.csv', toCSV(leads), 'text/csv')
  const exportPDF = () => window.print()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-end">
        <GhostButton onClick={exportPDF} className="flex items-center gap-1.5"><FileText size={14} /> Export PDF</GhostButton>
        <PrimaryButton onClick={exportLeadsCSV} className="flex items-center gap-1.5"><Sheet size={14} /> Export Excel</PrimaryButton>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-display font-bold mb-4">Leads by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={leadStatusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {leadStatusData.map((entry) => <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0d1322', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-display font-bold mb-4">Tasks Completed</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={taskStatusData} layout="vertical">
              <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" stroke="var(--muted-2)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" stroke="var(--muted-2)" fontSize={12} tickLine={false} axisLine={false} width={80} />
              <Tooltip contentStyle={{ background: '#0d1322', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" fill="var(--gold)" radius={[0, 5, 5, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-display font-bold">Customer Records</h3>
          <button onClick={exportCustomersCSV} className="text-xs text-[var(--gold)] hover:underline">Export CSV</button>
        </div>
        <p className="text-xs text-[var(--muted)]">{customers.length} customers · {leads.length} leads · {tasks.length} tasks tracked this period.</p>
      </Card>
    </div>
  )
}
