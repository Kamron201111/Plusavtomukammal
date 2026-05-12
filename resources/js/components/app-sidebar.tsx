import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Auth, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookText,
    Github,
    History,
    LayoutDashboard,
    Send,
    Users,
    Zap,
    Minus,
    ShieldAlert,
    LayoutGrid,
} from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { t, i18n } = useTranslation();

    const footerNavItems: NavItem[] = [
        {
            title: t('sidebar.repository'),
            href: 'https://github.com/islamabdurahman',
            icon: Github,
        },
        {
            title: t('sidebar.telegram'),
            href: 'https://t.me/livelongevity',
            icon: Send,
        },
    ];

    const { auth } = usePage().props as unknown as { auth?: Auth };

    const isAdmin = auth?.user?.roles?.some((role) => role.name === 'Admin');

    const filteredNavItems = useMemo((): NavItem[] => {
        const items: NavItem[] = [
            {
                title: t('sidebar.dashboard'),
                href: route('dashboard'),
                icon: LayoutDashboard,
            },
            {
                title: t('sidebar.user'),
                href: route('user.index'),
                icon: Users,
            },
            {
                title: t('sidebar.ticket'),
                href: route('tickets.index'),
                icon: BookText,
            },
            {
                title: t('sidebar.active_tickets'),
                href: route('active_tickets'),
                icon: Zap,
            },
            {
                title: t('sidebar.attempts'),
                href: route('attempts.index'),
                icon: History,
            },
            // Admin-only items
            {
                title: t('sidebar.road_line'),
                href: route('road_line.index'),
                icon: Minus,
                isActive: false,
            },
            {
                title: t('sidebar.sign_category'),
                href: route('sign_category.index'),
                icon: LayoutGrid,
                isActive: false,
            },
            {
                title: t('sidebar.yhq'),
                href: route('yhq.index'),
                icon: ShieldAlert,
                isActive: false,
            },
        ];

        return items.filter((item) => {
            if (item.href === route('user.index') && !isAdmin) return false;
            if (item.href === route('tickets.index') && !isAdmin) return false;
            if (item.href === route('road_line.index') && !isAdmin) return false;
            if (item.href === route('sign_category.index') && !isAdmin) return false;
            if (item.href === route('yhq.index') && !isAdmin) return false;
            return true;
        });
    }, [isAdmin, i18n.language]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
