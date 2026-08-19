export const ROLES = {
  ADMIN: 'Admin',
  SUPERVISOR: 'Supervisor',
  USER: 'User',
}

export const ROLE_META = {
  [ROLES.ADMIN]: { color: 'var(--gold)', icon: 'Crown', perms: ['dashboard','customers','leads','tasks','employees','reports','ai','settings'] },
  [ROLES.SUPERVISOR]: { color: 'var(--ember)', icon: 'ShieldCheck', perms: ['dashboard','customers','leads','tasks','reports'] },
  [ROLES.USER]: { color: 'var(--emerald)', icon: 'User', perms: ['dashboard','leads','tasks'] },
}

export const DEMO_USERS = [
  { id: 'u1', name: 'Admin', role: ROLES.ADMIN, email: 'admin@trishulcrm.com' },
  { id: 'u2', name: 'Supervisor', role: ROLES.SUPERVISOR, email: 'supervisor@trishulcrm.com' },
  { id: 'u3', name: 'User', role: ROLES.USER, email: 'user@trishulcrm.com' },
]

export const SEED_CUSTOMERS = [
  { id: 'c1', name: 'Rahul Verma', company: 'TechNova Pvt Ltd', phone: '+91 98765 43210', email: 'rahul@technova.com', address: 'Bengaluru, KA', status: 'Active', notes: 'Renewed annual plan.' },
  { id: 'c2', name: 'Ankit Sharma', company: 'Bright Solutions', phone: '+91 91234 56780', email: 'ankit@brightsol.com', address: 'Pune, MH', status: 'Active', notes: 'Interested in add-ons.' },
  { id: 'c3', name: 'Priya Singh', company: 'NextGen Corp', phone: '+91 99887 66554', email: 'priya@nextgen.com', address: 'Delhi, DL', status: 'Prospect', notes: 'Needs a demo.' },
  { id: 'c4', name: 'Meera Iyer', company: 'CloudPeak Systems', phone: '+91 90000 11122', email: 'meera@cloudpeak.io', address: 'Chennai, TN', status: 'Active', notes: '' },
  { id: 'c5', name: 'Vikram Rao', company: 'Orbit Retail', phone: '+91 93456 78901', email: 'vikram@orbitretail.com', address: 'Hyderabad, TS', status: 'Inactive', notes: 'Paused subscription.' },
]

export const SEED_LEADS = [
  { id: 'l1', name: 'Sanjay Gupta', phone: '+91 98123 45670', email: 'sanjay@leadco.com', source: 'Website', assignedTo: 'u2', status: 'New' },
  { id: 'l2', name: 'Neha Kapoor', phone: '+91 99234 56781', email: 'neha@leadco.com', source: 'Referral', assignedTo: 'u3', status: 'Contacted' },
  { id: 'l3', name: 'Arjun Mehta', phone: '+91 97345 67892', email: 'arjun@leadco.com', source: 'Advertisement', assignedTo: 'u2', status: 'Interested' },
  { id: 'l4', name: 'Divya Nair', phone: '+91 96456 78903', email: 'divya@leadco.com', source: 'Website', assignedTo: 'u3', status: 'Won' },
  { id: 'l5', name: 'Kabir Malhotra', phone: '+91 95567 89014', email: 'kabir@leadco.com', source: 'Cold Call', assignedTo: 'u2', status: 'Lost' },
  { id: 'l6', name: 'Ishita Rao', phone: '+91 94678 90125', email: 'ishita@leadco.com', source: 'Referral', assignedTo: 'u3', status: 'New' },
]

export const SEED_TASKS = [
  { id: 't1', title: 'Follow up with TechNova renewal', assignedTo: 'u2', dueDate: '2026-08-20', priority: 'High', status: 'Pending' },
  { id: 't2', title: 'Send proposal to Bright Solutions', assignedTo: 'u3', dueDate: '2026-08-18', priority: 'Medium', status: 'Pending' },
  { id: 't3', title: 'Demo call with NextGen Corp', assignedTo: 'u2', dueDate: '2026-08-19', priority: 'High', status: 'Completed' },
  { id: 't4', title: 'Update CloudPeak contact details', assignedTo: 'u3', dueDate: '2026-08-22', priority: 'Low', status: 'Pending' },
]

export const SEED_EMPLOYEES = [
  { id: 'e1', name: 'Supervisor', role: ROLES.SUPERVISOR, supervisorId: null, email: 'supervisor@trishulcrm.com' },
  { id: 'e2', name: 'User', role: ROLES.USER, supervisorId: 'e1', email: 'user@trishulcrm.com' },
]

export const MONTHLY_LEADS = [
  { month: 'Jan', leads: 180 }, { month: 'Feb', leads: 220 }, { month: 'Mar', leads: 260 },
  { month: 'Apr', leads: 210 }, { month: 'May', leads: 300 }, { month: 'Jun', leads: 340 },
  { month: 'Jul', leads: 290 }, { month: 'Aug', leads: 359 },
]

export const CUSTOMER_GROWTH = [
  { month: 'Jan', customers: 620 }, { month: 'Feb', customers: 680 }, { month: 'Mar', customers: 740 },
  { month: 'Apr', customers: 790 }, { month: 'May', customers: 860 }, { month: 'Jun', customers: 950 },
  { month: 'Jul', customers: 1080 }, { month: 'Aug', customers: 1245 },
]
