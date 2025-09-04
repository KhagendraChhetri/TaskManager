import { Plus, ListTodo, Filter, SortAsc, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  onNewTask: () => void
  onShowFilters?: () => void
}

export function AppSidebar({ onNewTask, onShowFilters }: AppSidebarProps) {
  const menuItems = [
    {
      title: "Add New Task",
      icon: Plus,
      onClick: onNewTask,
      className: "bg-gradient-primary text-white hover:bg-primary/90"
    }
  ]

  const navigationItems = [
    {
      title: "All Tasks",
      icon: ListTodo,
      onClick: () => {},
    },
    {
      title: "Filters & Sort",
      icon: Filter,
      onClick: onShowFilters || (() => {}),
    }
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="p-2 bg-gradient-primary rounded-xl">
            <ListTodo className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">Task Manager</h2>
            <p className="text-xs text-sidebar-foreground/70">Stay organized</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={item.onClick}
                    className={item.className}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={item.onClick}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}