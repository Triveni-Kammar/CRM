import { createContext, useContext, useEffect, useState } from 'react'
import {
  SEED_CUSTOMERS, SEED_LEADS, SEED_TASKS, SEED_EMPLOYEES,
  MONTHLY_LEADS, CUSTOMER_GROWTH,
} from '../data/seed'

const DataContext = createContext(null)

function usePersistedState(key, seed) {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : seed
  })
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])
  return [state, setState]
}

function uid(prefix) {
  return `${prefix}${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`
}

export function DataProvider({ children }) {
  const [customers, setCustomers] = usePersistedState('trishul_customers', SEED_CUSTOMERS)
  const [leads, setLeads] = usePersistedState('trishul_leads', SEED_LEADS)
  const [tasks, setTasks] = usePersistedState('trishul_tasks', SEED_TASKS)
  const [employees, setEmployees] = usePersistedState('trishul_employees', SEED_EMPLOYEES)
  const [activity, setActivity] = usePersistedState('trishul_activity', [])

  const logActivity = (entityType, entityId, text) => {
    setActivity((p) => [
      { id: uid('a'), entityType, entityId, text, at: new Date().toISOString() },
      ...p,
    ].slice(0, 200))
  }

  const addCustomer = (c) => {
    const record = { ...c, id: uid('c') }
    setCustomers((p) => [record, ...p])
    logActivity('customer', record.id, `Customer "${record.name}" was added.`)
    return record
  }
  const updateCustomer = (id, patch) => {
    setCustomers((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c)))
    logActivity('customer', id, `Customer details were updated.`)
  }
  const deleteCustomer = (id) => setCustomers((p) => p.filter((c) => c.id !== id))
  const restoreCustomer = (record) => setCustomers((p) => [record, ...p])

  const addLead = (l) => setLeads((p) => [{ ...l, id: uid('l') }, ...p])
  const updateLead = (id, patch) => setLeads((p) => p.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  const deleteLead = (id) => setLeads((p) => p.filter((l) => l.id !== id))
  const restoreLead = (record) => setLeads((p) => [record, ...p])

  const convertLeadToCustomer = (lead) => {
    const customer = addCustomer({
      name: lead.name,
      company: lead.company || '',
      phone: lead.phone,
      email: lead.email,
      address: '',
      status: 'Prospect',
      notes: `Converted from a "${lead.source}" lead.`,
    })
    updateLead(lead.id, { status: 'Won', convertedCustomerId: customer.id })
    logActivity('customer', customer.id, `Converted from lead "${lead.name}".`)
    return customer
  }

  const addTask = (t) => setTasks((p) => [{ ...t, id: uid('t') }, ...p])
  const updateTask = (id, patch) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  const deleteTask = (id) => setTasks((p) => p.filter((t) => t.id !== id))
  const restoreTask = (record) => setTasks((p) => [record, ...p])

  const addEmployee = (e) => setEmployees((p) => [{ ...e, id: uid('e') }, ...p])
  const updateEmployee = (id, patch) => setEmployees((p) => p.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  const deleteEmployee = (id) => setEmployees((p) => p.filter((e) => e.id !== id))
  const restoreEmployee = (record) => setEmployees((p) => [record, ...p])

  const activityForCustomer = (customerId) => activity.filter((a) => a.entityId === customerId)

  const resetDemoData = () => {
    setCustomers(SEED_CUSTOMERS)
    setLeads(SEED_LEADS)
    setTasks(SEED_TASKS)
    setEmployees(SEED_EMPLOYEES)
    setActivity([])
  }

  const value = {
    customers, addCustomer, updateCustomer, deleteCustomer, restoreCustomer,
    leads, addLead, updateLead, deleteLead, restoreLead, convertLeadToCustomer,
    tasks, addTask, updateTask, deleteTask, restoreTask,
    employees, addEmployee, updateEmployee, deleteEmployee, restoreEmployee,
    activity, activityForCustomer,
    monthlyLeads: MONTHLY_LEADS,
    customerGrowth: CUSTOMER_GROWTH,
    resetDemoData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => useContext(DataContext)
