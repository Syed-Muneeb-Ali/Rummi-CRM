"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileText,
  Home,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Wallet,
  Megaphone,
  HelpCircle,
  Gift,
  UserPlus,
  Shield,
  ScrollText,
  Calculator,
  CircleDollarSign,
  Warehouse,
  ArrowRightLeft,
  MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface NavItem {
  title: string
  href?: string
  icon: React.ElementType
  children?: NavItem[]
}

const navigationItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Sales & Customers",
    icon: ShoppingCart,
    href: "/dashboard/sales",
    children: [
      { title: "My Sales", href: "/dashboard/sales/my-sales", icon: Briefcase },
      { title: "Sales Management", href: "/dashboard/sales/management", icon: ClipboardList },
      { title: "Customers", href: "/dashboard/sales/customers", icon: Users },
      { title: "Cash Deposits", href: "/dashboard/sales/cash-deposits", icon: CreditCard },
    ],
  },
  {
    title: "HO Sales",
    icon: Building2,
    href: "/dashboard/ho-sales",
    children: [
      { title: "Franchise Leads", href: "/dashboard/ho-sales/leads", icon: UserPlus },
      { title: "Franchise Deals", href: "/dashboard/ho-sales/deals", icon: FileText },
      { title: "Franchise Payments", href: "/dashboard/ho-sales/payments", icon: Wallet },
      { title: "FDM Dashboard", href: "/dashboard/ho-sales/fdm-dashboard", icon: BarChart3 },
      { title: "All Franchises", href: "/dashboard/ho-sales/franchises", icon: Building2 },
      { title: "Rent Agreements", href: "/dashboard/ho-sales/rent-agreements", icon: ScrollText },
    ],
  },
  {
    title: "Inventory",
    icon: Package,
    href: "/dashboard/inventory",
    children: [
      { title: "All Units", href: "/dashboard/inventory/units", icon: Warehouse },
      { title: "Transfer Requests", href: "/dashboard/inventory/transfers", icon: ArrowRightLeft },
      { title: "Stock by Location", href: "/dashboard/inventory/stock-location", icon: MapPin },
    ],
  },
  {
    title: "Finance",
    icon: Calculator,
    href: "/dashboard/finance",
    children: [
      { title: "Finance Queue", href: "/dashboard/finance/queue", icon: ClipboardList },
    ],
  },
  {
    title: "Accounts",
    icon: CircleDollarSign,
    href: "/dashboard/accounts",
    children: [
      { title: "Invoice Queue", href: "/dashboard/accounts/invoices", icon: Receipt },
      { title: "Expense Approvals", href: "/dashboard/accounts/expenses", icon: CreditCard },
      { title: "Salary Processing", href: "/dashboard/accounts/salary", icon: Wallet },
    ],
  },
  {
    title: "HR",
    icon: Users,
    href: "/dashboard/hr",
    children: [
      { title: "Users", href: "/dashboard/hr/users", icon: Users },
      { title: "Franchises", href: "/dashboard/hr/franchises", icon: Building2 },
      { title: "Freelancer Requests", href: "/dashboard/hr/freelancers", icon: UserPlus },
      { title: "Incentive Rules", href: "/dashboard/hr/incentives", icon: Gift },
      { title: "Support Tickets", href: "/dashboard/hr/support", icon: HelpCircle },
    ],
  },
  {
    title: "Transport",
    icon: Truck,
    href: "/dashboard/transport",
    children: [
      { title: "Transport Requests", href: "/dashboard/transport/requests", icon: Truck },
    ],
  },
  {
    title: "Marketing",
    icon: Megaphone,
    href: "/dashboard/marketing",
    children: [
      { title: "Expenses", href: "/dashboard/marketing/expenses", icon: CreditCard },
    ],
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/dashboard/reports",
    children: [
      { title: "Role-Based Reports", href: "/dashboard/reports", icon: BarChart3 },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    children: [
      { title: "Roles & Permissions", href: "/dashboard/settings/roles", icon: Shield },
      { title: "System Configuration", href: "/dashboard/settings/config", icon: Settings },
      { title: "Audit Logs", href: "/dashboard/settings/audit-logs", icon: ScrollText },
    ],
  },
]

interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ isCollapsed = false }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])

  // Auto-expand the section that contains the current page
  React.useEffect(() => {
    const currentSection = navigationItems.find((item) =>
      item.children?.some((child) => child.href === pathname)
    )
    if (currentSection && !expandedItems.includes(currentSection.title)) {
      setExpandedItems((prev) => [...prev, currentSection.title])
    }
  }, [pathname])

  function toggleExpanded(title: string) {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    )
  }

  function isActive(href: string) {
    return pathname === href
  }

  function isSectionActive(item: NavItem) {
    if (item.href) return pathname === item.href
    return item.children?.some((child) => child.href === pathname)
  }

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "flex flex-col h-full bg-card border-r transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: "hsl(68, 60%, 27%)", color: "white" }}
            >
              <Briefcase className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold">Rummi CRM</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <div key={item.title}>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {item.href ? (
                        <Link href={item.href}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-center p-2",
                              isActive(item.href) && "bg-primary text-primary-foreground"
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                          </Button>
                        </Link>
                      ) : (
                        <Link href={item.href ?? (item.children?.[0]?.href ?? "/dashboard")}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-center p-2",
                              isSectionActive(item) && "bg-accent text-accent-foreground"
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                          </Button>
                        </Link>
                      )}
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      <div className="space-y-1">
                        <p className="font-medium">{item.title}</p>
                        {item.children && item.children.length > 1 && (
                          <div className="space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href!}
                                className={cn(
                                  "block text-sm py-1 px-2 rounded hover:bg-accent",
                                  isActive(child.href!) && "bg-accent font-medium"
                                )}
                              >
                                {child.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ) : item.children && item.children.length > 0 ? (
                  // Section with children - title links to dashboard, chevron toggles expand
                  <>
                    <div
                      className={cn(
                        "flex items-center w-full rounded-md",
                        isSectionActive(item) && "bg-accent/50"
                      )}
                    >
                      <Link
                        href={item.href!}
                        className="flex flex-1 items-center gap-2 px-2 py-1.5 text-sm font-medium hover:bg-accent/50 rounded-md transition-colors min-w-0"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                      {item.children && item.children.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 shrink-0"
                          onClick={(e) => {
                            e.preventDefault()
                            toggleExpanded(item.title)
                          }}
                        >
                          {expandedItems.includes(item.title) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    {item.children &&
                      expandedItems.includes(item.title) && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link key={child.href} href={child.href!}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "w-full justify-start gap-2 pl-4",
                                  isActive(child.href!) &&
                                    "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                                )}
                              >
                                <child.icon className="h-4 w-4" />
                                <span className="text-sm">{child.title}</span>
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                  </>
                ) : (
                  // Direct link without children (e.g. Dashboard)
                  <Link href={item.href ?? "/dashboard"}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        isActive(item.href ?? "/dashboard") &&
                          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </span>
                    </Button>
                  </Link>
                )}
                {navigationItems.indexOf(item) < navigationItems.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
          </div>
        </nav>
      </aside>
    </TooltipProvider>
  )
}
