# RUMMI CRM \- Technical Requirements Document Planning

### **Dashboard P2**

**Main dashboard with role-based widgets showing key metrics, pending actions, and alerts.**

Superadmin/HO sees: total sales across franchises, pending approvals count, overdue cash deposits, expiring rent agreements, system health. Franchise Owner sees: their franchise sales, staff performance, inventory levels, pending requests. Salesperson sees: their leads by stage, pending follow-ups, commission earned this month.

---

## **Sales & Customers**

### **My Sales (Salesperson View) P1**

**Personal workspace for salespeople to manage their assigned leads and deals.**

Salesperson sees only their leads across all stages in a simple list view with stage badges. Create new lead (name, phone, address, source), log follow-up notes with next action date, mark lead as interested. Upload customer documents (PAN, photo, bank details) when customer is ready. Select loan option from Finance-assigned choices if customer chooses for a loan, confirm downpayment terms with customer. After the invoice is generated, upload a cash deposit slip. Shows personal stats at top: total leads, conversion rate, this month's sales, commission earned, target progress.

**Key Actions:**

* Create new lead  
* Edit lead details  
* Log follow-up notes  
* Mark as Interested  
* Upload customer documents (PAN, photo, bank details)  
* Select vehicle (engine/chassis from available inventory)  
* Select loan option (from 3 options assigned by Finance)  
* Upload cash deposit slip (after invoice generated)  
* View deposit timer countdown

**Visible Stages:** Lead → Interested → Documents Submitted → Loan in Progress → Approved → Sold

---

### **Sales Management (Management View) P1**

**Pipeline overview for HR, Franchise Owner, Finance, and Accounts to monitor and act on deals.**

table view showing all deals. Each role sees contextual actions based on the deal stage. Powerful filters: by stage, salesperson, franchise, date range, financer. Bulk actions for reassignment. Click any deal card to see full details, timeline, documents, and audit trail.

**Role-Specific Behaviors:**

| Role | Default View | Primary Actions |
| ----- | ----- | ----- |
| **HR** | All deals, all franchises | Reassign leads to different salesperson, view performance patterns |
| **Franchise Owner** | Own franchise deals only | Reassign leads within franchise, monitor staff performance |
| **Finance** | Filtered to "Documents Submitted" | Assign 3 loan options, attach due letter after selection |
| **Accounts** | Filtered to "Approved" | Generate invoice (redirects to Invoice Queue) |

**Key Actions:**

* View deal details and timeline  
* Reassign lead to different salesperson (HR/Owner only)  
* Filter and search deals  
* Export deal list  
* View linked documents  
* Access audit trail per deal

---

### **Customers (Converted) P1**

**List of all successfully converted customers with their purchase details and vehicle information.**

Shows customer name, vehicle purchased (model, engine/chassis number), purchase date, financer used, franchise, salesperson who converted. View/download invoice PDF, see linked documents (PAN, photo, due letter). Used for customer service reference, warranty tracking, and reporting. Search by customer name, phone, vehicle number.

**Key Actions:**

* Search customers  
* View customer profile with all documents  
* Download invoice PDF  
* View vehicle details  
* Filter by franchise, date range, salesperson

---

### **Cash Deposits P1**

**Dedicated page for cash deposit slip upload (salesperson) and verification (accounts).**

**Salesperson View:**

* List of their sales pending cash deposit  
* Shows invoice date, amount, timer countdown (12-hour deadline)  
* Upload deposit slip (photo/scan of bank deposit receipt)  
* Status: Pending Upload → Uploaded → Verified  
* Alert banner if any deposit is overdue

**Accounts View:**

* Queue of all uploaded deposit slips pending verification  
* Shows salesperson name, amount, upload time, invoice reference  
* Mark as Verified (after external bank confirmation) or Flag Issue  
* List of overdue deposits (past 12-hour deadline)  
* List of currently blocked salespersons (those with overdue unverified deposits)  
* Unblock happens automatically when overdue deposit is verified

**Key Actions:**

* Upload deposit slip (Salesperson)  
* Verify deposit (Accounts)  
* Flag deposit issue (Accounts)  
* View blocked salespersons list (Accounts)  
* Filter by status, salesperson, date

---

## **HO Sales – Franchise Sales Lifecycle (FDM) — P0**

This module manages the **complete franchise sales journey** from prospecting to payment verification and franchise activation. It is used by **FDM** for selling franchises and by **Accounts** for financial validation.

### **Flow**

**Franchise Lead → Franchise Deal → Payment → Verification → Active Franchise**

### **What the system does**

FDM creates and manages **franchise prospects** with name, contact, location interest, source and interest level. All interactions and follow-ups are logged. When a prospect is ready, it is converted into a **Franchise Deal**.

While creating a deal, FDM selects **Type A, B or C**. The system automatically loads the **fee, number of e-rickshaws and commission structure** based on the selected type.

| Type | E-ricksaw | Fee | Commission |
| :---- | :---- | :---- | :---- |
| A | 3 | ₹6,83,000 | ₹7000 / 6000 / 5000 |
| B | 1 | ₹3,83,000 | ₹9000 flat |
| C | 2 | ₹5,83,000 | ₹6500 / 5000 / 4000 |

Each franchise deal moves through fixed stages:  
**Payment Pending → Payment Entered → Verified → Documents Uploaded → HR Setup → Inventory Allocated → Active**

FDM uploads the **signed T\&C** and **rent agreement** and enters **bank transfer reference and amount** after the franchise buyer pays.

The **Accounts team** sees all pending franchise payments, verifies them against bank statements, and either **marks as Verified** or **flags a discrepancy**. The system shows a full **payment breakup** (e-rickshaw fee, charging point, GPS/spares).

Only when payment is verified and documents are uploaded does the franchise become **Active** and eligible to receive inventory and start operations.

### **Key Actions**

**FDM**

* Create and update franchise leads  
* Log follow-ups and interest level  
* Convert lead to franchise deal  
* Select deal type (A/B/C)  
* View fee and commission structure  
* Enter payment reference and amount  
* Upload T\&C and rent agreement  
* Track deal stage and progress

**Accounts**

* View pending franchise payments  
* Verify or flag payments  
* View payment breakup  
* Track verification status

---

### **FDM Dashboard P2** 

**Performance dashboard for HO sales AND Franchise Owner**

Shows FDM's monthly target (10 franchises), actual achievement, incentive earned (₹5,000 per franchise \+ ₹250 per e-rickshaw sold by developed franchises). Monthly and cumulative views. 

Superadmin can go to any FDM’s dashboard. This will be readonly dashboard for everyone.

**Key Actions:**

* View own performance (FDM)  
* View all FDM comparison (HR/Superadmin)  
* View rent agreement  
* Filter by month/quarter/year

---

### **All Franchises P2**

**Master list of all franchise entities with their status and key details.**

Shows franchise name, location, owner, deal type (A/B/C), status (Prospect/Purchased/Active/Suspended), activation date, staff count, current month sales. Click to view full franchise profile including commission structure, allocated inventory, staff list, rent agreement details.

**Key Actions:**

* View franchise list  
* Search and filter  
* View franchise profile (click-through)  
* Activate franchise (HR, after all setup complete)  
* Suspend franchise (Superadmin)

---

### **Rent Agreements P0**

**Rent agreement tracking for all franchise locations.**

Shows landlord details, monthly rent, agreement start/end dates, annual increment percentage. Highlights agreements expiring within 30 days, rent due within 7 days. Upload renewed agreement documents. Tracks whether rent is paid by company or franchise owner.

**Key Actions:**

* Create rent agreement record  
* Upload agreement document  
* Upload renewed agreement  
* Set rent payment responsibility (company/owner)  
* View expiry alerts  
* Filter by status, franchise, expiry date

---

## **Inventory**

### **All Units P2**

Unit-level inventory list showing every e-rickshaw and spare part with unique identifiers.

Each e-rickshaw tracked by engine number and chassis number. Shows current location (HO/which franchise), status (Available/Reserved/Sold), model, selling price. Spare parts tracked by SKU with quantity at each location. HO Inventory can add new stock from manufacturer purchases.

**Key Actions:**

* Add new stock (HO Inventory)  
* Edit unit details  
* Filter by location, status, model  
* Search by engine/chassis number

---

### **Transfer Requests P2**

Inventory transfer request queue between HO and franchises.

Franchise users raise requests specifying items and quantity needed. HO Inventory reviews, adds cost details, approves/rejects. Approved requests auto-notify Transport for trip creation. Shows request status: Pending → Approved → In Transit → Delivered. Tracks 10% commission due to franchise owner on transferred items.

**Key Actions:**

* Create transfer request (Franchise)  
* Add cost details (HO Inventory)  
* Approve/Reject request (HO Inventory)  
* View request status  
* Filter by status, franchise, date

---

### **Stock by Location P2**

**Location-wise inventory summary showing stock levels at HO and each franchise.**

Dropdown to select location, see all available inventory there. Quick view of low stock alerts, items in transit to this location. Useful for HO to see overall distribution, for Franchise Owner to see their godown status.

**Key Actions:**

* Select location  
* View stock summary  
* View low stock alerts  
* View incoming transfers

---

## **Finance**

### **Finance Queue P1**

**Due letter records attached to approved sales.**

**Single action-oriented page for Finance team showing all deals requiring their input.**

Finance team has two types of actions on deals:

1. **Assign loan options** \- when deal is at "Documents Submitted" stage  
2. **Upload due letter** \- when salesperson has selected a loan option

**Key Actions:**

* View deals with status (Documents Submitted or Loan Selected)  
* View customer documents  
* Assign 3 loan options to a deal  
* View salesperson's selected option  
* Upload due letter document  
* Move deal to "Approved" stage (auto on due letter upload)  
* View completed deals history  
* Download due letter documents  
* Filter by franchise, salesperson, financer, date range  
* Search by customer name or sale ID

---

## **Accounts**

### **Invoice Queue P1**

**Queue of sales at "Approved" stage ready for invoice generation.**

Accounts sees sales where due letter is attached, ready for invoicing. Reviews customer details, vehicle details (engine/chassis), financer details, salesperson compliance (no overdue deposits). Generates invoice PDF. Invoice generation auto-moves sale to "Sold" and starts 12-hour cash deposit timer.

**Key Actions:**

* View deals ready for invoice  
* Review deal details  
* Check salesperson compliance (blocked status)  
* Generate invoice PDF  
* View generated invoice  
* Download invoice

**Blocking Logic:**

* If salesperson has an unverified deposit older than 12 hours, Accounts cannot generate new invoices for that salesperson  
* System shows warning with blocked reason  
* Unblock by verifying overdue deposit in Cash Verification page

---

### **Expense Approvals P3**

**Expense request approval workflow for all departments.**

View all expense requests from Marketing, Inventory, Franchises. Marketing expenses need HR approval first, then Accounts. Other expenses go directly to Accounts. Approve/reject with comments, track payment status. Upload vendor invoices and supporting documents.

**Key Actions:**

* View expense requests  
* Approve/Reject with comments  
* Mark as paid (after external payment)  
* View expense history  
* Filter by department, status, date  
* Export expense report

---

### **Salary Processing P3**

**Monthly salary and commission calculation and payout tracking.**

Triggered on 25th of month \- shows notification to HR, Accounts, Superadmin. Displays calculated salary for each employee: base salary \+ incentives \- deductions (50% if target missed). HR reviews and approves, Accounts processes external payout, marks as paid in system. Shows freelancer commission payouts separately.

**Key Actions:**

* View salary calculations  
* Review calculation breakdown  
* Approve salary batch (HR)  
* Mark as paid (Accounts)  
* View freelancer commissions  
* Export salary report  
* Filter by role, franchise, status

---

## **HR**

### **Users P0**

**User management for all CRM users across HO and franchises.**

Create new users with name, phone, email, role assignment, location assignment (HO or specific franchise), biometric ID, salary details. Edit user details, deactivate users, reset passwords. View user's current assignments, permissions inherited from role. Filter by role, location, status.

**Key Actions:**

* Create user   
* Edit user details  
* Assign role (among existing)  
* Assign location (HO/specific Franchise)  
* Set salary details  
* Deactivate user  
* Reset password/biometric  
* View user permissions  
* Filter by role, location, status  
* Attendance

---

### **Freelancer Requests P3**

**Freelancer ID creation requests from salespersons.**

Salesperson submits request with freelancer details (name, Aadhaar, PAN, phone, address, email, bank account). HR reviews for duplicates and validity, approves to create freelancer with system-generated EmpID, or rejects with reason. Freelancers have no login \- only used for sales attribution and commission tracking.

**Key Actions:**

* View pending requests  
* Review freelancer details  
* Check for duplicates  
* Approve (generates EmpID)  
* Reject with reason  
* View all freelancers  
* Edit freelancer details  
* Deactivate freelancer

---

### **Incentive Rules P2**

**Configuration of commission tiers, targets, and penalties.**

Superadmin/HR configures: Franchise Owner commission slabs (₹7000/6000/5000 per tier), Staff Salesperson slabs (₹3000/3500/4000 per tier), Freelancer flat rate (₹5000), FDM incentives (₹5000 per franchise \+ ₹250 per rickshaw), monthly targets (default 2), penalty percentage (50%). Changes apply from next month.

**Key Actions:**

* Edit Franchise Owner tiers  
* Edit Staff Salesperson tiers  
* Edit Freelancer commission  
* Edit FDM incentives  
* Set monthly targets  
* Set penalty percentage  
* View change history

---

### **Support Tickets P3**

**Support ticket queue managed by HR.**

Franchise users (Owner, Salesperson, Mechanic, Godown) create tickets with title, department dropdown, message. All tickets assigned to HR. HR views, coordinates with relevant department internally, updates status (Open/Closed), adds resolution notes. Filter by status, department, franchise, date.

**Key Actions:**

* Create ticket (Franchise users)  
* View tickets  
* Add internal notes  
* Close ticket with resolution  
* Reopen ticket  
* Filter by status, department, franchise

---

## **Transport**

### **Transport Requests P2**

Single page for transport team to handle incoming requests and track trip history.

Transport requests come from various sources: inventory transfers (HO → Franchise), franchise activation (initial vehicle allocation), customer delivery. Each request contains source location(s), destination location(s), and description of what needs to be transported.

**Key Actions:**

* View pending requests (with count badge)  
* Approve request (add driver, vehicle, cost, km)  
* Reject request (add reason)  
* Update trip status (Requested → Approved or Rejected)  
* View request/trip history  
* Filter by status, date range, destination, request type

### 

---

## **Marketing** 

### **Expenses P3**

**Marketing expense request and tracking.**

Marketing team creates expense requests: campaign/purpose description, amount, vendor details, payment details (bank acc ifsc code etc, uploads invoice or supporting docs. Request goes to HR for first approval, then Accounts for final approval and payment.. Track all requests with status, view approved/rejected history.

**Key Actions:**

* Create expense request  
* Upload vendor invoice  
* View request status  
* View approval trail  
* Filter by status, date  
* Export expense report

---

## **Reports**

### **Role-Based Reports P4**

TBD

---

## **Settings (Superadmin)**

### **Roles & Permissions P0**

**Dynamic role management with granular permission flags.**

View all roles (system default \+ custom created). Create new role with name, assign permission flags via checkbox grid. Edit existing custom roles (system roles like Superadmin are locked). View which users are assigned to each role. Delete unused custom roles (only if no users assigned).

**Key Actions:**

* View all roles  
* Create new role  
* Edit custom role permissions  
* View users in role  
* Delete unused custom role  
* Clone role (create copy with modifications)

---

### **System Configuration P4**

**Global system parameters and business rules.**

Configure: cash deposit deadline (default 12 hours), transport lead time (default 24 hours), base transport km allowance (default 200), session timeout (default 30 minutes), inventory transfer commission (default 10%). 

**Key Actions:**

* Edit configuration values  
* View current settings

---

### **Audit Logs P4**

**Action-level audit trail viewer.**

Shows: timestamp, user, action performed, module, record affected.. Filter by user, action type, module, date range. Actions logged: create, update, delete, approve, reject, login, logout, status change. Export filtered logs to Excel.

**Key Actions:**

* View audit logs  
* Filter by user, action, module, date  
* Search logs  
* Export to Excel

### **Users P0**

Key actions

* create/edit/delete users  
* Reset their biometric.  
* Login

\====================================================================================

P0  
Franchise Deals  
Franchise Payments  
Rent Agreement  
Users (HR & Superadmin)  
Authentication   
\- session management  
\- context me save krna hai role info \- har page pe karni hai? ek bar krni hai?  
\- user login \-\> getRoles \-\> get all the CanX  
\- save in context (useContext)  
\- useContext(getthisUserRoles) canX

P1  
My sales  
sales management  
customers (converted)  
Cash deposit  
Finance Queue  
Invoice Queue

P2  
Overall superadmin dashboard  
FDM Dashboard  
All Franchises  
Inventory Pages  
Incentive Rules  
Transport Requests

P3  
Expense approvals  
Salary processing  
Freelancer requests  
Support tickets  
Marketing Expense Requests

P4  
Role Based Reports  
\- dashboards \-\> additional subtraction logic \-\> PNL  
Audit Logs & Attendance  
Roles & Permissions  
System Configuration

1\) bhot cheeze rehjaegi \- keep adding comments on code or gdoc  
2\) common components figure out and create on priority 0 \- table (tanstack), upload (dummy), form  , shadcn color theme, download ALL shadcn components, file viewer  
3\) phases \- phase 1 \= P0, phase 2 \= P1+P2, phase3 \= P3+P4  
4\) database \- mongo \- tables???

## Immediate tasks

- Create app \+ shadcn color theme \- Muneeb  
- Figure out tables konse banane hai and rough schema \+ mongodb connection in nextapp \- Chaitanya  
- Authentication \+ Session management \- prefer \- get AI to think of multiple ways to do this \- finalise 3 possible/potential approaches and then we all 3, sit and finalise on one, then execute \- Wali  
- Common components \- Muneeb

