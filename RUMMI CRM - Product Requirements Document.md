# **RUMMI CRM \- Product Requirements Document**

 **Version:** 1.2  
 **Date:** December 2024  
 **Status:** Draft

---

## **1\. Executive Summary**

RUMMI CRM is a franchise management platform for an e-rickshaw distribution business. It manages the complete sales lifecycle from lead capture to vehicle delivery, inventory across multiple locations, staff performance and commissions, loan documentation workflows, and inter-department approvals.

The platform serves head office departments (Finance, Accounts, HR, Inventory, Transport, Marketing) and franchise locations (Owner, Staff Sales, Mechanics, Godown). It emphasizes workflow automation, configurable commission structures, and hierarchical reporting.

---

## **2\. Objectives**

1. Centralize sales pipeline management across all franchises  
2. Automate commission calculations with configurable tier-based rules  
3. Track inventory at unit level (engine/chassis number) across locations  
4. Enforce business rules (cash deposit deadlines, approval sequences)  
5. Provide hierarchical reporting for decision-making

---

## **3\. User Roles & Permissions**

## **3.1 Superadmin**

**Role Overview**  
System owner with unrestricted access and configuration authority across RUMMI CRM.

**Permissions & Responsibilities**

* Full read/write access to **all modules, pages, and data** across all franchises  
* Configure system-wide parameters:  
  * Cash deposit deadlines  
  * Incentive tiers and slabs (staff, franchise owner, FDM)  
  * Monthly targets and penalties  
  * Transport lead times  
  * Inventory transfer commission rates  
* Manage global settings and system configurations  
* View and export **all reports** across departments  
* Access complete **audit logs** (who did what, when)  
* Override or correct system records if required  
* No operational restrictions

## **3.2 Head Office – Finance**

**Role Overview**  
 Handles loan processing, financer coordination, and due-letter management.

**Permissions & Responsibilities**

* Create, update, and manage **financer master data**  
* Maintain loan option configurations:  
  * Interest rates  
  * Tenure  
  * Processing fees  
  * Required documents  
* Assign loan options to customer sales when documents are submitted  
* Upload and manage **due letters** for selected loan options  
* Track due letter status linked to each sale  
* View overdue and pending due letter records  
* View finance-specific reports (loan conversion, due letters)  
* No permission to generate invoices or handle cash verification

## **3.3 Head Office – Accounts**

**Role Overview**  
 Responsible for financial verification, invoicing, expense approvals, and payouts.

**Permissions & Responsibilities**

* Verify salesperson compliance before allowing invoice generation  
* Manually record **income transactions** for all sales  
* Generate and manage invoices (PDF)  
* Verify cash deposit transactions using external bank confirmation  
* Block or unblock invoice creation based on cash deposit compliance  
* Review and approve expense requests from:  
  * Inventory  
  * Marketing  
  * Franchise operations  
* Process salaries, commissions, and incentives **externally**  
* Mark payouts as completed in CRM (manual confirmation)  
* View finance and accounts reports  
* Cannot modify inventory or sales pipeline stages

## 

## **3.4 Head Office – Inventory**

**Role Overview**  
 Central authority for inventory control and stock movement.

**Permissions & Responsibilities**

* View inventory across **all locations** (HO and franchises)  
* Approve inventory transfer requests (HO → Franchise)  
* Add cost details to transfer requests  
* Create purchase orders to manufacturers  
* Coordinate with Accounts for payment approvals  
* Update inventory records on:  
  * Incoming stock  
  * Dispatch  
  * Transfers  
* Maintain accuracy of stock levels  
* No access to salary, commissions, or cash handling

**3.5 Head Office – Salesperson (HO Sales)**

**Role Overview**  
 Handles **franchise sales and onboarding coordination**, not customer sales.

**Permissions & Responsibilities**

* Create and update **franchise purchase records**  
* Record franchise fee payment details (bank transfer reference only)  
* Upload signed franchise Terms & Conditions  
* Upload scanned **rent agreement documents**  
* Coordinate onboarding with:  
  * Accounts (payment verification)  
  * HR (franchise & staff creation)  
  * Transport (initial vehicle allocation)  
  * Inventory (stock allocation)  
* Track franchise lifecycle until activation  
* No access to customer sales, inventor edits, or financial approvals

**3.6 Head Office – Transport**

**Role Overview**  
 Executes physical movement of vehicles and inventory.

**Permissions & Responsibilities**

* View all transport and transfer requests  
* Create trips for:  
  * Inventory transfers  
  * Franchise activation  
  * Customer delivery  
* Assign driver and transport vehicle  
* Log estimated and actual kilometers and cost  
* Update trip status (Scheduled / In Progress / Completed)  
* Cannot approve inventory requests or commissions

**3.7 Head Office – HR**

**Role Overview**  
 Manages people, incentives, salaries, franchises, and support tickets.

**Permissions & Responsibilities**

* Create and manage all users and employees  
* Assign roles and locations  
* Manage biometric enrollment mapping  
* Create franchise entities after purchase  
* Assign franchise staff (sales, godown, mechanic)  
* Configure incentive tiers and monthly targets  
* Calculate salaries and commissions  
* Apply penalties for missed targets  
* Manage freelancer creation and EmpIDs  
* Manage rent agreement records and alerts  
* Own and resolve all support tickets  
* Cannot verify payments or generate invoices

**3.8 Head Office – Marketing**

**Role Overview**  
 Handles marketing expenses and campaigns.

**Permissions & Responsibilities**

* Create marketing expense requests  
* Upload vendor invoices and supporting documents  
* Track approval status  
* View marketing expense reports  
* No access to inventory, payroll, or sales pipeline

**3.9 Franchise Owner**

**Role Overview**  
 Business owner of an individual franchise.

**Permissions & Responsibilities**

* View all sales data for own franchise  
* View inventory levels and transfers for own franchise  
* View staff performance and commissions  
* View rent agreements and notifications  
* Reassign leads within own franchisedeals  
* View franchise-level reports  
* View monthly incentive summary  
* Eligible for **slab-based franchise incentives**  
* No access to other franchises or HO data

## **3.10 Franchise Development Manager (FDM)**

**Role Overview**  
 Responsible for acquiring new franchise partners and onboarding them.

**Permissions & Responsibilities**

* Create and manage franchise leads and deals  
* Pitch and sell **any of the 3 franchise deal types**  
* Explain commission slabs, benefits, and responsibilities  
* Record franchise payment details (bank transfer only)  
* Upload franchise documents and signed T\&C  
* Upload rent agreement documents  
* Coordinate with:  
  * Accounts (payment verification)  
  * HR (franchise creation and staffing)  
  * Transport (initial vehicle allocation)  
  * Inventory (stock allocation)  
* Track franchise lifecycle:  
  * Prospect → Purchased → Active  
* View own targets, incentives, and performance  
* No permission to:  
  * Modify inventory  
  * Approve payments  
  * Generate invoices

## **3.11 Franchise Godown (Inventory Handler)**

**Role Overview**  
 Manages physical inventory at franchise locations.

**Permissions & Responsibilities**

* View local godown inventory  
* Raise inventory requests to Head Office  
* Raise transfer requests from other franchises  
* Approve spare part usage for mechanics  
* Update local stock records  
* No access to sales, accounts, or incentives

## **3.12 Franchise Mechanic**

**Role Overview**  
 Handles repair and maintenance work.

**Permissions & Responsibilities**

* Raise spare part requests  
* Log repair and maintenance activities  
* View own repair history  
* No access to inventory approval or sales data

## **3.13 Freelancer (No Login)**

**Role Overview**  
 External sales associate tracked by HR.

**Permissions & Responsibilities**

* No CRM login  
* Sales linked via EmpID by staff salesperson  
* Commission auto-calculated  
* Payout tracked manually by HR

## **3.14 Other Seller (No Login)**

**Role Overview**  
 External seller organization or individual.

**Permissions & Responsibilities**

* No CRM login  
* Sales linked manually

---

## **4\. Core Modules**

### **4.1 Sales Pipeline Management**

#### **4.1.1 Customer Status**

| Status | Description | Triggered By | Next Actions |
| ----- | ----- | ----- | ----- |
| **1\. Lead** | Potential customer identified | Salesperson creates entry | Follow-up, qualify interest |
| **2\. Interested** | Customer shows buying intent | Salesperson updates after follow-up | Collect documents |
| **3\. Documents Submitted** | PAN, bank details, photo collected | Salesperson uploads documents | Send to Finance for loan options |
| **4\. Loan in Progress** | Finance working on loan options | Finance adds 3 options, salesperson selects 1 | Confirm downpayment terms, attach due letter |
| **5\. Approved** | Due letter attached, ready for invoice | Finance attaches due letter | Accounts raises invoice |
| **6\. Sold** | Accounts generate invoice, mark as sold | Account Team | End |

#### **4.1.2 Lead Management**

**Data Captured at Lead Stage:**

* Customer name, phone, address  
* Source (walk-in, referral, campaign)  
* Assigned salesperson  
* Follow-up notes and dates  
* Lead creation timestamp

**Data Captured at Documents Submitted:**

* PAN card (photo upload)  
* Bank account details  
* Customer photo  
* Vehicle preference (model)  
* Engine number (selected from available inventory)  
* Chassis number (selected from available inventory)

#### **4.1.3 Cash Deposit Rules**

| Condition | Deadline | Consequence |
| ----- | ----- | ----- |
| After invoice created | 12 hours | Accounts team blocked from raising new invoices |

**Block Behavior:**

* **Salesperson is NOT blocked**  
* **Accounts team** cannot **create new invoices** for the same **salesperson** until transaction older than 12hr is verified  
* Salesperson uploads cash deposit slip  
* Accounts verifies with bank (external) and updates CRM  
* Once verified, Accounts unblocked for new invoices

#### **4.1.4 Lead Reassignment**

* HR or Franchise Owner can reassign leads to different salespeople  
* Reassignment logged with timestamp and reason  
* Original salesperson loses access to lead data

---

### **4.2 Inventory Management**

#### **4.2.1 Inventory Hierarchy**

┌─────────────────┐  
│  MANUFACTURER   	│ External \- not in system  
└────────┬────────┘  
         		│ Purchase  
         		▼  
┌─────────────────┐  
│  HEAD OFFICE   		│ Central inventory  
└────────┬────────┘  
         		│ Transfer (10% commission to franchise owner)  
         		▼  
┌─────────────────┐  
│ FRANCHISE       		│ Local godown  
│ GODOWN          		│  
└────────┬────────┘  
         		│ Internal use / Sale  
         		▼  
┌─────────────────┐  
│ SOLD / USED     		│  
└─────────────────┘

#### **4.2.2 Inventory Units**

Title, Image, Quantity, Selling Price

#### **4.2.3 Inventory Transfer Request (HO → Franchise)**

**Request Creation:**

* Franchise (Owner / Salesperson / Godown) raises request  
* Specifies: quantity, item type (e-rickshaw/spare parts)

**Dashboard Notifications:**

* HR: Visibility only  
* Accounts: Visibility only  
* Inventory request Transport  
* Transport: **Action required**

**Transport Action:**

* Transport HO creates trip with:  
  * Source address (HO location)  
  * Destination address (Franchise location)  
  * Vehicle details (transport vehicle)  
  * Driver name  
  * Estimated cost  
  * Estimated kilometers

**Post-Transfer:**

* 10% commission calculated for franchise owner after the part is sold  
* Inventory location updated  
* Stock moved

#### **4.2.4 Inventory Operations**

| Operation | Initiated By | Action By | Commission |
| ----- | ----- | ----- | ----- |
| HO → Franchise transfer | Franchise (Owner/Sales/Godown) | Transport HO | 10% to franchise owner |
| Franchise → Franchise transfer | Requesting Godown | Transport HO | N/A |
| Manufacturer → HO purchase | HO Inventory | Accounts (payment) | N/A |
| Sale (auto-deduct) | System (on Sold) | N/A | N/A |
| Mechanic consumption | Mechanic | Franchise Godown | N/A |

---

### **4.3 Finance Module**

#### **4.3.1 Loan Options Management**

**Loan Option Entry (Manual):**

* Financer company name  
* Interest rate (%)  
* Loan tenure options  
* Processing fee  
* Required documents  
* Contact details

**Workflow:**

1. Finance team maintains master list of financers  
2. When customer reaches "Documents Submitted", Finance provides 3 loan options  
3. Salesperson selects 1 option and confirms downpayment terms  
4. Finance attaches due letter for selected option

#### **4.3.2 Due Letter Management**

**Due Letter Record:**

* Sale reference  
* Emp id of sales person  
* Financer name  
* Due letter number  
* Amount  
* Upload timestamp  
* Linked to selected loan option

---

### **4.4 Accounts & Billing Module**

#### **4.4.1 Invoice Generation**

**Invoice Trigger:** Finance attaches due letter, sale moves to "Approved"

**Accounts Actions:**

1. Reviews customer and vehicle details  
2. Reviews Salesperson details \- last transaction verified  
3. Raises invoice  
4. Marks sale as "Sold" automatically  
5. Salesperson receives notification

**Output:** PDF generation with configurable template

#### **4.4.2 Cash Deposit Tracking**

**Flow:**

1. Invoice created → 12-hour timer starts  
2. Salesperson deposits cash to bank (external)  
3. Salesperson uploads deposit slip to CRM  
4. Bank confirms deposit to Accounts (external)  
5. Accounts updates transaction status in CRM \-\> cash deposit is now verified

**Blocking Rule:**

* If cash deposit not verified within deadline  
* Accounts team blocked from raising new invoices for that sales person  
* Block lifted once transaction verified

#### **4.4.3 Expense Management**

**Expense Types:**

* Franchise misc expenses  
* Spare parts purchase (from manufacturer)  
* Loss reporting  
* Marketing expenses  
* Salary disbursement

**Expense Request Flow:**

Requester → Department Head → Accounts (if needed) → Approved/Rejected

#### **4.4.4 Salary Processing**

**Components:**

* Base salary (set by HR)  
* Incentives (auto-calculated)  
* Deductions (50% if target not met)  
* Accounts, HR, superadmin will get notification on 25th day of month.  
* Accounts head will **approve** and settle it.

**Calculation Frequency:** Monthly

---

### **4.5 HR Module**

#### **4.5.1 User Management**

**User Creation:**

* Name, phone, email  
* Role assignment  
* Location assignment (HO / specific franchise)  
* Biometric enrollment ID  
* Salary details

#### **4.5.2 Freelancer ID Creation**

**Request Flow:**

1. Staff salesperson creates request for new freelancer  
2. Request includes:  
   * Name  
   * Aadhaar number  
   * PAN number  
   * Phone  
   * Address  
   * Email  
   * Bank account details  
3. HR reviews request  
4. HR creates freelancer record with system-generated EmpID  
5. Freelancer has no login access  
6. Sales linked to EmpID, commission auto-calculated and paid externally  
     
   

#### **4.5.4 Incentive Configuration (Superadmin)**

**Franchise Owner Tiers:**

| Sales Count | Commission per Sale | Configurable |
| :---- | ----- | ----- |
| 1-10 | ₹7,000 | Yes |
| 11-15 | ₹6,000 | Yes |
| 16-20 | ₹5,000 | Yes |
| 20+ | Configurable | Yes |

**Staff Salesperson Tiers:**

| Sales Count | Commission per Sale | Configurable |
| ----- | ----- | ----- |
| 1-10 | ₹3,000 | Yes |
| 11-15 | ₹3,500 | Yes |
| 16-20 | ₹4,000 | Yes |
| 20+ | Configurable | Yes |

**Target & Penalty:**

* Monthly target: Configurable (default: 2 e-rickshaws)  
* Penalty for missing target: 50% salary deduction

**Freelancer Commission:**

* Flat rate per sale: ₹5,000 (configurable)  
* Tracked via EmpID, no system login

#### **4.5.5 Support Ticket Management**

**Ticket Fields:**

* Title  
* Department (dropdown)  
* Message

**Assignment:** All tickets assigned to HR. **Status**  \- Open/Closed

---

### **4.6 Transport Module**

#### **4.6.1 Transfer Request Dashboard**

* View all incoming inventory transfer requests from franchises  
* Notification when new request arrives  
* **Transport is primary action owner** for transfers

#### **4.6.2 Trip Creation (for Transfers)**

**Trip Data:**

* Source address (HO/franchise location)  
* Destination address (franchise/customer)  
* E-rickshaw/spare parts details  
* Driver name  
* Vehicle number (transport vehicle)  
* cost  
* kilometers

---

### **4.7 Marketing Module**

#### **4.7.1 Expense Logging**

**Expense Record:**

* Campaign/purpose description  
* Amount requested  
* Amount approved  
* Vendor/payee details  
* Invoice upload  
* Approval trail

---

### **4.8 Rent Management**

#### **4.8.1 Rent Agreement Tracking**

**Agreement Data:**

* Franchise location  
* Landlord details  
* Monthly rent amount  
* Agreement start date  
* Agreement end date (typically 11 months)  
* Renewal terms  
* Annual increment %

#### **4.8.2 Notifications**

| Trigger | Notification To | Advance Notice |
| ----- | ----- | ----- |
| Rent due date | Franchise Owner, Admin | 7 days |
| Agreement expiry | Franchise Owner, Admin, HR | 30 days |
| Increment due | Franchise Owner, Finance | 30 days |

---

### **4.9 Support Ticket System**

#### **4.9.1 Ticket Creation**

**Who can create:** All franchise users (Owner, Salesperson, Mechanic, Godown)

**Ticket Fields:**

* Title  
* Department (dropdown)  
* Message

#### **4.9.2 Ticket Management**

* All tickets assigned to HR  
* HR updates status  
* Status: Open / Closed

---

**4.10 Franchise Purchase Flow**

* Franchise development manager creates franchise sale record  
* Enters:  
  * Franchise purchaser details  
  * Payment amount  
  * Bank transfer reference  
* Accounts team verifies payment  
* System marks franchise as “Purchased”  
* Required documents and T\&C shared with purchaser

**Franchise Setup**

* HR creates franchise entity  
* HR assigns staff (sales, godown, mechanic)  
* Transport team allocates 3 e-rickshaws to franchise  
* Inventory updated (HO → Franchise)  
* Franchise Status Lifecycle: Prospect → Purchased → Active → Suspended (future)

---

**4.11 Franchise Development Manager – Targets & Incentives**

### **Target** \- 10 franchises per month

### **Compensation**

* **Fixed Salary:** ₹20,000 / month  
* **Incentive (per franchise):** ₹5,000  
* **Additional Incentive:** ₹250 per e-rickshaw sold under developed franchises

### **Payout Rules**

* Salary and incentives paid **monthly via bank transfer**  
* If target not achieved:  
  * Salary released **proportionally** based on number of franchises developed  
* All calculations tracked in CRM, payout handled externally by Accounts

---

## **4.12 Franchise Deal Types**

RUMMI offers **three franchise models**.  
Franchise Development Manager can sell **any of these**, and CRM must capture the **selected deal type** during franchise sale creation.

### **Franchise Type A – 3 E-Rickshaw \+ GPS \+ Charging Point**

**Franchise Fee (Refundable, No Interest)**

* ₹5,51,000 – E-Rickshaw (3 units)  
* ₹81,000 – Charging Point (1 unit)  
* ₹51,000 – GPS \+ Spare Parts (value ₹75,000)

  #### **Commission Structure (Franchise Owner)**

* 1–10 e-rickshaws sold → ₹7,000 per vehicle  
* 11–15 e-rickshaws sold → ₹6,000 per vehicle  
* 16–20 e-rickshaws sold → ₹5,000 per vehicle  
* **Additional:** 10% commission on GPS, spare parts & charging billing (excluding GST)

  #### **Company Provides**

* Salesperson  
* Marketing & advertisement  
* Mechanic  
* Showroom rent (20×10 sq ft)  
* Branding & signboard  
* Transport (loading & unloading)  
* In-house loan support

  #### **Franchise Owner Responsibilities**

* Showroom maintenance  
* Local management & security  
* Service responsibilities  
* Stock management & security  
* Electricity bills, repairs, misc expenses  
* Arrangement for new electricity connection (State Electricity Board)

---

### **Franchise Type B – 1 E-Rickshaw \+ GPS \+ Charging Point**

**Franchise Fee (Refundable, No Interest)**

* ₹2,51,000 – E-Rickshaw (1 unit)  
* ₹81,000 – Charging Point (1 unit)  
* ₹51,000 – GPS \+ Spare Parts (value ₹75,000)

  #### **Commission Structure**

* Flat ₹9,000 per e-rickshaw sold  
* 10% commission on GPS, spare parts & charging billing (excluding GST)

  #### **Company Provides**

* Salesperson  
* Fixed showroom rent support (₹5,000)  
* Branding & signboard  
* Transport (loading & unloading)  
* In-house loan support

  #### **Franchise Owner Responsibilities**

* Showroom maintenance  
* Local management & security  
* Service responsibilities  
* Stock security  
* Electricity & miscellaneous expenses  
* New electricity connection arrangement

---

### **Franchise Type C – 2 E-Rickshaw \+ GPS \+ Charging Point**

**Franchise Fee (Refundable, No Interest)**

* ₹4,51,000 – E-Rickshaw (2 units)  
* ₹81,000 – Charging Point (1 unit)  
* ₹51,000 – GPS \+ Spare Parts (value ₹75,000)

  #### **Commission Structure**

* 1–10 e-rickshaws sold → ₹6,500 per vehicle  
* 11–15 e-rickshaws sold → ₹5,000 per vehicle  
* 16–20 e-rickshaws sold → ₹4,000 per vehicle  
* 10% commission on GPS, spare parts & charging billing (excluding GST)

  #### **Company Provides**

* Salesperson  
* Marketing & advertisement  
* Mechanic  
* Showroom rent (20×10 sq ft)  
* Branding & signboard  
* Transport (loading & unloading)  
* In-house loan support

  #### **Franchise Owner Responsibilities**

* Same as Type A (maintenance, security, service, electricity, stock safety)

---

## **4.13 Franchise Sale Record (DATA MODEL ADDITION)**

When **FDM creates franchise sale**, CRM must capture:

* Franchise Deal Type (A / B / C)  
* Franchise fee breakup  
* Commission structure applicable  
* Included assets (e-rickshaws, GPS, charging point)  
* Responsibilities acknowledgement (checkbox)

---

## **5\. Core Modules / Pages**

### **5.1 Dashboard & Overview**

| \# | Page | Description |
| ----- | ----- | ----- |
| 1 | **Dashboard** | Key metrics, alerts, pending approvals summary |

### **5.2 Sales & Customers**

| \# | Page | Description |
| ----- | ----- | ----- |
| 2 | **Leads** | All leads across franchises, filters by stage/salesperson/location |
| 3 | **Customers** | Converted/sold customers with documents |
| 4 | **Sales Pipeline** | Kanban or list view of all deals by 6 stages |
| 5 | **Transactions** | Deposit slips, verification status, pending verifications |

### **5.3 Inventory**

| \# | Page | Description |
| ----- | ----- | ----- |
| 6 | **Units** | Unit-wise list (engine/chassis), location, status |
| 7 | **Transfer Requests** | Requests from franchises, status, dashboard for HR/Accounts/Transport |

### **5.4 Finance**

| \# | Page | Description |
| ----- | ----- | ----- |
| 8 | **All Sales** | Details of customer, need to assign loan options available |

### **5.5 HR & Users**

| \# | Page | Description |
| ----- | ----- | ----- |
| 9 | **Users** | All users, roles, locations, status  |
| 10 | **Franchises** | Franchise list with owner mapping |
| 11 | **Salespeople** | Staff/freelancer/other with deals and commission summary |
| 12 | **Customers** | Customer data \- pan card etc |
| 13 | **Deals** | Deals whole cycle |
| 14 | **Freelancer ID Requests** | Requests from salespersons, create freelancer IDs |
| 15 | **Incentive Rules** | Configurable tiers and targets |

### **5.6 Transport**

| \# | Page | Description |
| ----- | ----- | ----- |
| 16 | **Transfer Request Dashboard** | Incoming inventory requests, create trips |
| 17 | **Trips** | Active/completed trips, driver/vehicle/cost details |

### **5.7 Marketing**

| \# | Page | Description |
| ----- | ----- | ----- |
| 18 | **Marketing Expenses** | Requests, approvals, logs |

### **5.8 Franchise Operations**

| \# | Page | Description |
| ----- | ----- | ----- |
| 19 | **Rent Agreements** | All agreements, expiry alerts |
| 20 | **Repairs Log** | Mechanic repair entries across franchises |
| 21 | **Spare Parts Requests** | Mechanic requests to godown |

### **5.9 Support**

| \# | Page | Description |
| ----- | ----- | ----- |
| 22 | **Support Tickets** | Title, dept, message, status (Open/Closed), managed by HR |

### **5.10 Settings (Superadmin only)**

| \# | Page | Description |
| ----- | ----- | ----- |
| 23 | **System Configuration** | Deposit deadlines, transport lead time, session timeout |
| 24 | **Audit Logs** | Who did what, when |

### **5.11 Franchise Development**

| \# | Page | Description |
| ----- | ----- | ----- |
| 25 | Franchise Leads | Prospective franchise buyers handled by FDM |
| 26 | Franchise Deals | Create and manage franchise sale records (Type A/B/C) |
| 27 | Franchise Payments | Bank transfer details, verification status |
| 28 | Franchise Documents | Rent agreement, T\&C, approvals |
| 29 | Franchise Activation | Status tracking: Prospect → Purchased → Active |
| 30 | FDM Performance | Targets, franchises sold, incentives |
| 31 | Franchise Incentives | Commission & slab summary for franchise owners |

---

## **6\. Core Flows**

### **6.1 Lead-to-Delivery Flow (Primary)**

Salesperson creates Lead  
    	│  
    	▼  
┌─────────────────────────────────────────────────────┐  
│ STAGE 1: LEAD                                        						        │  
│ • Follow-ups & qualification                         					        │  
│ • Notes and next action logged                       					        │  
└──────┬──────────────────────────────────────────────┘  
       	      │ Customer shows buying intent  
       	      ▼  
┌─────────────────────────────────────────────────────┐  
│ STAGE 2: INTERESTED                                 					        │  
│ • Salesperson confirms intent                                                                                        │  
│ • Prepares document collection                       					        │  
└──────┬──────────────────────────────────────────────┘  
       	      │ Documents collected  
      ▼  
┌─────────────────────────────────────────────────────┐  
│ STAGE 3: DOCUMENTS SUBMITTED                         			                    │  
│ • PAN, bank details, photo uploaded                  					        │  
│ • Vehicle selected (engine/chassis reserved)         				        │  
│ • Sent to Finance                                    						        │  
└──────┬──────────────────────────────────────────────┘  
       	       │ Finance processes  
       	      ▼  
┌─────────────────────────────────────────────────────┐  
│ STAGE 4: LOAN IN PROGRESS                        					        │  
│ • Finance provides 3 loan options                    					        │  
│ • Salesperson shows options to customer              				        │  
│ • Salesperson selects 1 option                       					        │  
│ • Salesperson confirms downpayment terms             				        │  
│ • Finance attaches due letter for selected option    				         │  
└──────┬──────────────────────────────────────────────┘  
       	       │ Due letter attached  
       	      ▼  
┌─────────────────────────────────────────────────────┐  
│ STAGE 5: APPROVED                                    					        │  
│ • Due letter available                               						        │  
│ • Sent to Accounts for invoice                       					         │  
└──────┬──────────────────────────────────────────────┘  
       	       │ Accounts processes  
        	      ▼  
┌─────────────────────────────────────────────────────┐  
│ STAGE 6: SOLD                                        						        │  
│ • Accounts checks details                            					        │  
│ • Accounts raises invoice                            					        │  
│ • Accounts marks as SOLD                             					        │  
│ • Salesperson notified                               						        │  
│ • 12-hour cash deposit timer starts                  					        │  
│ • Salesperson deposits cash to bank                  					        │  
│ • Salesperson uploads deposit slip                   	     				        │  
│ • Accounts verifies and updates transaction          					        │  
│ • Salesperson requests transport                     					        │  
└──────┬──────────────────────────────────────────────┘  
       │ Transport assigned and dispatched  
       ▼  
┌─────────────────────────────────────────────────────┐  
│ STAGE 7: DELIVERED                                   					        	│  
│ • Driver and vehicle assigned                        						│  
│ • Transport completes delivery                       						│  
│ • Inventory auto-deducts (engine/chassis)            						│  
│ • Sale closed                                        							│	  
└─────────────────────────────────────────────────────┘

---

### **6.2 Cash Deposit & Accounts Blocking Flow**

Sale marked as SOLD (Invoice created)  
       		│  
       		▼  
┌─────────────────────────────────────────────────────┐  
│ 12-HOUR TIMER STARTS                                 						│  
│ • Salesperson must deposit cash to bank              						│  
│ • Salesperson uploads deposit slip to CRM            					│  
└──────┬──────────────────────────────────────────────┘  
       		│  
       		├─────────────────────┐  
       		│                       		         │  
       		▼                     		        ▼  
┌──────────────┐      ┌──────────────────────────────┐  
│ DEPOSITED &  	   │      │ DEADLINE MISSED /            			│  
│ VERIFIED     	│         │ NOT VERIFIED                				│  
│ IN TIME      		│         │                              					│  
│              		│         │ • Accounts team BLOCKED      			│  
│ • Clear      		│         │ • Cannot raise new invoices  			│  
│ • Accounts   		│         │ • Salesperson NOT blocked    			│  
│   unblocked  	│         │                              					│  
└──────────────┘      └──────┬───────────────────────┘  
                             			      │  
                              			     ▼  
                      ┌──────────────────────────────┐  
                      │ UNBLOCK PROCESS              			│  
                      │ • Salesperson uploads slip (optional)   		│  
                      │ • Bank confirms (external)   				│  
                      │ • Accounts verifies in CRM   			│  
                      │ • Accounts unblocked         				│  
                      └──────────────────────────────┘

---

### **6.3 Inventory Transfer Flow (HO → Franchise)**

┌─────────────────────────────────────────────────────┐  
│ FRANCHISE RAISES REQUEST                             					│  
│ • Franchise Owner / Salesperson / Godown             					│  
│ • Specifies quantity, item type                      						│  
└──────┬──────────────────────────────────────────────┘  
       	      │  
       	      ▼  
┌─────────────────────────────────────────────────────┐  
│ HO INVENTORY APPROVES REQUEST                        					│  
│ • Reviews request details                            						│  
│ • Adds cost of items                                 							│  
│ • Approves transfer                                  							│  
└──────┬──────────────────────────────────────────────┘  
      	      │  
                 ▼  
┌─────────────────────────────────────────────────────┐  
│ HO INVENTORY CREATES TRANSPORT REQUEST              	 			│  
│ • Raises request to Transport Department             					│  
│ • Includes item details and destination              						│  
└──────┬──────────────────────────────────────────────┘  
       	      │  
                 ▼  
┌─────────────────────────────────────────────────────┐  
│ TRANSFER COMPLETE                                    						│  
│ • Logged by Franchise Owner / Inventory              					│  
│ • 10% commission calculated for franchise owner      					│  
└─────────────────────────────────────────────────────┘

---

### **6.4 Spare Parts Request Flow (Mechanic)**

┌─────────────────────────────────────────────────────┐  
│ MECHANIC NEEDS SPARE PARTS                           					│  
│ • For repair/maintenance                             						│  
└──────┬──────────────────────────────────────────────┘  
       	       │  
       	      ▼  
┌─────────────────────────────────────────────────────┐  
│ CHECK LOCAL GODOWN                                   						│  
│ • Is item available locally?                         							│  
└──────┬──────────────────────────────────────────────┘  
       │  
       ├─── YES ──────────────────┐  
       │                          ▼  
       │                   ┌─────────────────────────┐  
       │                   │ FULFILL LOCALLY         		│  
       │                   │ • Godown approves       			│  
       │                   │ • Deduct from inventory 			│  
       │                   │ • Link to repair record 			│  
       │                   └─────────────────────────┘  
       │  
       ▼ NO  
┌─────────────────────────────────────────────────────┐  
│ REQUEST FROM HO                                      						│  
│ • Godown raises transfer request                     						│  
│ • Follows Inventory Transfer Flow (6.3)              						│  
└─────────────────────────────────────────────────────┘

---

### **6.5 Expense Approval Flow**

┌─────────────────────────────────────────────────────┐  
│ EXPENSE REQUEST RAISED                               					│  
│ • Marketing / Franchise / Any department             						│  
│ • Amount, purpose, vendor details entered            					│  
└──────┬──────────────────────────────────────────────┘  
       	      │  
       	     ▼  
┌─────────────────────────────────────────────────────┐  
│ IS THIS A MARKETING EXPENSE?                         					│  
└──────┬──────────────────────────────────────────────┘  
       │  
       ├─── YES (Marketing) ──────┐  
       │                          ▼  
       │                   ┌─────────────────────────┐  
       │                   │ HR REVIEW (Step 1\)      		│  
       │                   │ • HR reviews request    			│  
       │                   └──────┬──────────────────┘  
       │                          		│  
       │                   ┌──────┴──────┐  
       │                   │             	    	      │  
       │                   ▼             		      ▼  
       │              Approved      		 Rejected → END  
       │                   │  
       │                   ▼  
       │            ┌─────────────────────────┐  
       │            │ ACCOUNTS REVIEW (Step 2\)	      │  
       │            └──────┬──────────────────┘  
       │                   	    │  
       │            ┌──────┴──────┐  
       │            │             		│  
       │            ▼             		▼  
       │       Approved       	       Rejected → END  
       │             │  
       │            ▼  
       │       PROCESS PAYMENT  
       │  
      ▼ NO (Other departments)  
┌─────────────────────────────────────────────────────┐  
│ DIRECT TO ACCOUNTS                                   						│  
│ • Accounts reviews request                           						│  
└──────┬──────────────────────────────────────────────┘  
       │  
       ├─── Approved ────→ PROCESS PAYMENT  
       │  
       ▼ Rejected  
      END

---

### **6.6 Salary & Incentive Flow**

┌─────────────────────────────────────────────────────┐  
│ MONTH END TRIGGER                                    						│  
└──────┬──────────────────────────────────────────────┘  
       │  
       ▼  
┌─────────────────────────────────────────────────────┐  
│ • Counts total e-rickshaws sold by each franchise   					│  
│ • Applies slab-based incentive per e-rickshaw:      					│  
│     \- 1–10 sales   → ₹7,000 per e-rickshaw           						│  
│     \- 11–15 sales  → ₹6,000 per e-rickshaw           						│  
│     \- 16–20 sales  → ₹5,000 per e-rickshaw           						│  
│ • Calculates total monthly incentive                						│  
│ • Incentive summary visible to Franchise Owner      					│  
│ • Accounts processes payout externally              						│  
└─────────────────────────────────────────────────────┘  
│  
           ▼  
┌─────────────────────────────────────────────────────┐  
│ STAFF SALESPERSON CALCULATION                        					│	  
│ • Count sales for each salesperson                   						│  
│ • Apply tier-based commission:                       						│  
│   \- 1-10 sales: ₹3,000/sale                          							│  
│   \- 11-15 sales: ₹3,500/sale                         						│  
│   \- 16-20 sales: ₹4,000/sale                         						│  
│   \- 20+ sales: Configurable                          						│  
│ • Check if monthly target met                        						│  
│ • If target missed: Apply 50% salary deduction       					│  
│ • Calculate: Base Salary \+ Incentive \- Deductions    					│  
└──────┬──────────────────────────────────────────────┘  
       │  
       ▼  
┌─────────────────────────────────────────────────────┐  
│ FREELANCER CALCULATION                               					│  
│ • System counts sales linked to each EmpID           					│  
│ • Calculates: ₹5,000 × number of sales               						│  
│ • Total commission calculated                        						│  
└──────┬──────────────────────────────────────────────┘  
       │  
       ▼  
┌─────────────────────────────────────────────────────┐  
│ OTHER SELLER CALCULATION                            					│  
│ • HR logs each sale under seller org name            					│  
  \- we need name, address, phone, email details from HR         					│  
└──────┬──────────────────────────────────────────────┘  
       │  
       ▼  
┌─────────────────────────────────────────────────────┐  
│ HR REVIEW                                            							│  
│ • Reviews all calculations                           							│  
│ • Makes adjustments if needed                        						│  
│ • Approves for payout                                							│  
└──────┬──────────────────────────────────────────────┘  
       │  
       ▼  
┌─────────────────────────────────────────────────────┐  
│ ACCOUNTS PROCESSING                                  						│  
│ • Processes salary payout (external)                 						│  
│ • Marks freelancer payouts as paid (manual)          					│  
│ • Salary/commission logged in system                 						│  
└─────────────────────────────────────────────────────┘

---

### **6.7 Freelancer ID Creation Flow**

┌─────────────────────────────────────────────────────┐  
│ STAFF SALESPERSON CREATES REQUEST                    				│  
│ • New freelancer needs to be registered              						│  
└──────┬──────────────────────────────────────────────┘  
       │  
       ▼  
┌─────────────────────────────────────────────────────┐  
│ REQUEST DETAILS                                      						│  
│ • Freelancer name                                    							│  
│ • Aadhaar number                                     							│  
│ • PAN number                                         							│  
│ • Phone                                              							│  
│ • Address                                            							│  
│ • Email                                              							│  
│ • Bank account details                               							│  
└──────┬──────────────────────────────────────────────┘  
       │  
       ▼  
┌─────────────────────────────────────────────────────┐  
│ HR REVIEWS REQUEST                                   						│  
│ • Verifies details                                   							│  
│ • Checks for duplicates                              							│  
└──────┬──────────────────────────────────────────────┘  
       │  
       ├─── Approved ─────────────┐  
       │                          ▼  
       │                   ┌─────────────────────────┐  
       │                   │ FREELANCER CREATED      		│  
       │                   │ • System generates EmpID		│  
       │                   │ • No login access       			│  
       │                   │ • Ready for sales link  			│  
       │                   └─────────────────────────┘  
       │  
       ▼ Rejected  
┌─────────────────────────────────────────────────────┐  
│ REQUEST REJECTED                                     						│  
│ • Salesperson notified with reason                   						│  
└─────────────────────────────────────────────────────┘

---

### **6.8 Rent Notification Flow**

┌─────────────────────────────────────────────────────┐  
│ SYSTEM DAILY CHECK                                   						│  
│ • Scans all rent agreements                          						│  
└──────┬──────────────────────────────────────────────┘  
       │  
       ▼  
┌──────────────────┐  
│ RENT DUE DATE    	│  
│ within 7 days?   		│  
└──────┬───────────┘  
       │ YES  
       ▼  
┌──────────────────┐  
│ NOTIFY:          		│  
│ • Franchise Owner		│  
│ • Admin          		│  
└──────────────────┘  
       │  
       ▼  
┌──────────────────┐  
│ AGREEMENT EXPIRY 	│  
│ within 30 days?  		│  
└──────┬───────────┘  
       │ YES  
       ▼  
┌──────────────────┐  
│ NOTIFY:          		│  
│ • Franchise Owner		│  
│ • Admin          		│  
│ • HR             		│  
└──────────────────┘  
       │  
       ▼  
┌──────────────────┐  
│ INCREMENT DUE    	│  
│ within 15 days?  		│  
└──────┬───────────┘  
       │ YES  
       ▼  
┌──────────────────┐  
│ NOTIFY:          		│  
│ • Franchise Owner		│  
│ • Finance        		│  
└──────────────────┘

---

### **6.9 Support Ticket Flow**

┌─────────────────────────────────────────────────────┐  
│ FRANCHISE USER CREATES TICKET                        					│  
│ • Owner / Salesperson / Mechanic / Godown            					│	  
│ • Enters: Title, Department, Message                 						│  
│ • Status: OPEN                                       							│  
└──────┬──────────────────────────────────────────────┘  
       │  
       ▼  
┌─────────────────────────────────────────────────────┐  
│ HR RECEIVES TICKET                                   						│  
│ • Reviews issue                                      							│  
│ • Coordinates with relevant department if needed						│  
└──────┬──────────────────────────────────────────────┘  
       │  
       ▼  
┌─────────────────────────────────────────────────────┐  
│ ISSUE RESOLVED                                       						│  
│ • HR updates status to CLOSED                       						│  
│ • Resolution logged                                  							│  
└─────────────────────────────────────────────────────┘

---

### **6.10 Invoice Generation Flow**

┌─────────────────────────────────────────────────────┐  
│ SALE IN "APPROVED" STAGE                             					│  
│ • Due letter attached by Finance                     						│  
│ • Ready for invoicing                                							│  
└──────┬──────────────────────────────────────────────┘  
       │  
       ▼  
┌─────────────────────────────────────────────────────┐  
│ ACCOUNTS REVIEWS                                     						│  
│ • Checks customer details and salesperson details                            			│  
│ • Checks vehicle details                             							│  
│ • Verifies due letter                                							│  
└──────┬──────────────────────────────────────────────┘  
       │  
       ▼  
┌─────────────────────────────────────────────────────┐  
│ ACCOUNTS GENERATES INVOICE                           					│  
│ • Auto-generates invoice number                      						│  
│ • Populates template with:                           						│  
│   \- Customer details (name, address, PAN)            					│  
│   \- Vehicle details (model, engine, chassis)         						│  
│   \- Pricing (base, tax, total)                       							│  
│   \- Financer details                                 							│  
│   \- Franchise details                                							│  
│ • PDF generated                                      							│  
 |  • Sale status updated to "Sold" automatically                      				│  
│ • Invoice attached to sale record                    						│  
│ • Salesperson notified                               							│  
│ • 12-hour cash deposit timer starts                  						│  
└──────┬──────────────────────────────────────────────┘

---

### **6.11 Franchise Purchase & Activation Flow**

┌─────────────────────────────────────────────────────┐  
│ FRANCHISE LEAD CREATED                              						│  
│ • Created by Franchise Development Manager           					│  
│ • Prospect details captured                          						│  
└───────────────┬────────────────────────────────────┘  
                  │  
                 ▼  
┌─────────────────────────────────────────────────────┐  
│ FRANCHISE DEAL CREATED                              						│  
│ • Deal Type selected (A / B / C)                     						│  
│ • Fee structure & commissions applied                						│  
│ • Responsibilities acknowledged                     						│  
└───────────────┬────────────────────────────────────┘  
                │  
                ▼  
┌─────────────────────────────────────────────────────┐  
│ PAYMENT DETAILS ENTERED                             					│  
│ • Bank transfer reference recorded                   						│  
│ • Status: Pending Verification                      						│  
└───────────────┬────────────────────────────────────┘  
                │  
                ▼  
┌─────────────────────────────────────────────────────┐  
│ ACCOUNTS VERIFIES PAYMENT                           					│  
│ • Amount verified against company account            					│  
│ • Status updated to Verified                         						│  
└───────────────┬────────────────────────────────────┘  
                │  
                ▼  
┌─────────────────────────────────────────────────────┐  
│ FRANCHISE STATUS → PURCHASED                       	 				│  
│ • System updates lifecycle status                   						│  
│ • T\&C shared with franchise buyer                   						│  
└───────────────┬────────────────────────────────────┘  
                │  
                ▼  
┌─────────────────────────────────────────────────────┐  
│ RENT AGREEMENT UPLOADED                             					│  
│ • Uploaded by FDM                                   							│  
│ • HR & Admin notified                               							│  
└───────────────┬────────────────────────────────────┘  
                │  
                ▼  
┌─────────────────────────────────────────────────────┐  
│ HR CREATES FRANCHISE & STAFF                        					│  
│ • Franchise entity created                          							│  
│ • Salesperson, Godown, Mechanic assigned            					│  
└───────────────┬────────────────────────────────────┘  
                │  
                ▼  
┌─────────────────────────────────────────────────────┐  
│ TRANSPORT & INVENTORY ALLOCATION                    					│  
│ • 3 e-rickshaws allocated (as per deal)              						│  
│ • Inventory location updated                         						│	  
└───────────────┬────────────────────────────────────┘  
                │  
                ▼  
┌─────────────────────────────────────────────────────┐  
│ FRANCHISE STATUS → ACTIVE                           					│	  
│ • Ready for operations                              							│  
│ • Visible to Franchise Owner                        						│  
└─────────────────────────────────────────────────────┘

**Total: 11 Core Flows**

## **7\. Reporting**

### **7.1 Report Categories**

| Category | Reports |
| ----- | ----- |
| **Sales** | Pipeline status, conversion rates, salesperson performance, lead aging, stage-wise analysis |
| **Accounts** | income/expense summary, cash deposit status |
| **Inventory** | Stock levels by location, unit-wise status, transfer history, number of requests, commission summary |
| **HR** | Headcount, incentive calculations, salary processing, freelancer payouts |
| **Transport** | Trip logs, km usage, costs, overage tracking |
| **Marketing** | Expense summary, campaign-wise spend |
| **Franchise** | Sales vs target, staff performance, inventory levels, Franchise Owner incentive summary (monthly) |

### **7.2 Report Dimensions**

* **By Department:** Each department sees own reports  
* **By Area/Location:** Filter by franchise  
* **By Time:** Daily, weekly, monthly, quarterly, custom range

### **7.3 Export Options**

* PDF download  
* Excel export

---

## **8\. Authentication & Security**

### **8.1 Login Methods**

* **Primary:** Biometric device (wired to on-site laptop) for CRM login  
* **Fallback:** Username \+ password (for remote/emergency access)  
* **Freelancers:** No login (EmpID only for tracking)

### **8.2 Audit Trail**

* Basic logging: Who did what, when  
* Actions logged: Create, update, delete, status changes  
* Accessible to Superadmin

---

## **9\. Configuration (Superadmin)**

### **9.1 Configurable Parameters**

| Parameter | Default | Description |
| ----- | ----- | ----- |
| Incentive tiers | As defined | Sales count ranges and commission amounts |
| Monthly target | 2 | E-rickshaws per staff salesperson |
| Target miss penalty | 50% | Salary deduction percentage |
| Freelancer commission | ₹5,000 | Per sale |
| Cash deposit deadline | 12 hours | After invoice creation |
| Transport lead time | 24 hours | Minimum advance notice |
| Transfer commission | 10% | Inventory transfer to franchise |
| Transport base km | 200 | Monthly allowance |
| Session timeout | 30 minutes | Auto-logout |

---

## **10\. Out of Scope**

The following are explicitly excluded from this version:

1. Loan disbursement tracking (handled by financer)  
2. Customer EMI tracking (handled by financer)  
3. Mobile application  
4. Offline functionality  
5. Payment gateway integration  
6. Detailed payment method tracking  
7. Bank reconciliation  
8. SLA-based ticket management  
9. Automated report scheduling/email  
10. Attendance tracking

