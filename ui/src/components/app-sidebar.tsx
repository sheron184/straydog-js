import { Home, Inbox } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useQueryParams } from "@/hooks/use-query"

// Menu items.
const items = [
  {
    title: "Home",
    url: "?page=home",
    icon: Home,
    page: 'home'
  },
  {
    title: "Error Log",
    url: "?page=log",
    icon: Inbox,
    page: 'log'
  }
]

export function AppSidebar() {
  const params = useQueryParams();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-bold text-center uppercase">StrayDog-JS</SidebarGroupLabel>
          <SidebarGroupContent className="mt-3">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className={`${params.page == item.page ? 'bg-slate-400': 'unset'}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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