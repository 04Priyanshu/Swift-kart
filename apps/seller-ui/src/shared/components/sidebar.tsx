"use client";
import React, { useEffect } from "react";
import useSidebar from "../../hooks/useSidebar";
import { usePathname } from "next/navigation";
import useSeller from "../../hooks/useSeller";
import { Sidebar } from "./sidebar.styles";
import Box from "./box";
import Link from "next/link";
import Logo from "../../assets/svgs/logo";
import {
  BellPlus,
  BellRing,
  CalendarPlus,
  CreditCardIcon,
  Headset,
  HomeIcon,
  Inbox,
  ListOrdered,
  LogOut,
  PackageSearch,
  Settings,
  ShoppingBagIcon,
  SquarePlus,
  TicketPercent,
} from "lucide-react";
import SidebarItems from "./sidebar.items";
import Sidebarmenu from "./sidebar.menu";
import Payments from "../../assets/iocns/payments";
import Home from "../../assets/iocns/home";

const SideBarComponent = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathname = usePathname();
  const { seller } = useSeller();

  console.log(seller);

  useEffect(() => {
    setActiveSidebar(pathname);
  }, [pathname, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? "#0085ff" : "#969696";

  return (
    <Box
      css={{
        height: "100vh",
        zIndex: 202,
        position: "sticky",
        top: 0,
        overflow: "scroll",
        scrollbarWidth: "none",
      }}
      className="sidebar-wrapper"
    >
      <Sidebar.Header>
        <Box>
          <Link href="#" className="flex justify-center text-center gap-2">
            <Logo width={32} height={32} />
            <Box>
              <h3 className="text-lg font-medium text-[#ecedee]">
                {seller?.shop?.name}
              </h3>
              <h5 className="font-medium pl-2 text-xs text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]">
                {seller?.shop?.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>
      <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar">
          <SidebarItems
            title="Dashboard"
            icon={<Home fill={getIconColor("/dashboard")} />}
            isActive={activeSidebar === "/dashboard"}
            href="/dashboard"
          />

          <div className="mt-2 block">
            <Sidebarmenu title="Main Menu">
              <SidebarItems
                title="Orders"
                icon={
                  <ListOrdered
                    size={26}
                    color={getIconColor("/dashboard/orders")}
                  />
                }
                isActive={activeSidebar === "/dashboard/orders"}
                href="/dashboard/orders"
              />
              <SidebarItems
                title="Payments"
                icon={<Payments fill={getIconColor("/dashboard/payments")} />}
                isActive={activeSidebar === "/dashboard/payments"}
                href="/dashboard/payments"
              />
            </Sidebarmenu>

            <Sidebarmenu title="Products">
              <SidebarItems
                title="Create Product"
                icon={
                  <SquarePlus
                    size={24}
                    color={getIconColor("/dashboard/create-product")}
                  />
                }
                isActive={activeSidebar === "/dashboard/create-product"}
                href="/dashboard/create-product"
              />

              <SidebarItems
                title="All Products"
                icon={
                  <PackageSearch
                    size={22}
                    color={getIconColor("/dashboard/all-products")}
                  />
                }
                isActive={activeSidebar === "/dashboard/all-products"}
                href="/dashboard/all-products"
              />
            </Sidebarmenu>

            <Sidebarmenu title="Events">
              <SidebarItems
                title="Create Event"
                icon={
                  <CalendarPlus
                    size={24}
                    color={getIconColor("/dashboard/create-event")}
                  />
                }
                isActive={activeSidebar === "/dashboard/create-event"}
                href="/dashboard/create-event"
              />
              <SidebarItems
                title="All Events"
                icon={
                  <BellPlus
                    size={24}
                    color={getIconColor("/dashboard/all-events")}
                  />
                }
                isActive={activeSidebar === "/dashboard/all-events"}
                href="/dashboard/all-events"
              />
            </Sidebarmenu>

            <Sidebarmenu title="Controllers">
              <SidebarItems
                title="Inbox"
                icon={
                  <Inbox size={24} color={getIconColor("/dashboard/inbox")} />
                }
                isActive={activeSidebar === "/dashboard/inbox"}
                href="/dashboard/inbox"
              />

              <SidebarItems
                title="Settings"
                icon={
                  <Settings
                    size={24}
                    color={getIconColor("/dashboard/settings")}
                  />
                }
                isActive={activeSidebar === "/dashboard/settings"}
                href="/dashboard/settings"
              />

<SidebarItems
              title="Notifications"
              icon={<BellRing size={24} color={getIconColor("/dashboard/notifications")}/>}
              isActive={activeSidebar === "/dashboard/notifications"}
              href="/dashboard/notifications"
              />
            </Sidebarmenu>

            <Sidebarmenu title="Extras">
            <SidebarItems
              title="Discount Codes"
              icon={<TicketPercent size={22} color={getIconColor("/dashboard/discount-codes")}/>}
              isActive={activeSidebar === "/dashboard/discount-codes"}
              href="/dashboard/discount-codes"
              />

              <SidebarItems
              title="Logout"
              icon={<LogOut size={22} color={getIconColor("/dashboard/logout")}/>}
              isActive={activeSidebar === "/dashboard/logout"}
              href="/dashboard/logout"
              />
            </Sidebarmenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SideBarComponent;
