'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { appLinks, adminLinks } from '@/config/links';
import { UserNav } from '@/components/user-nav';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Nav } from './nav';
import { MobileNav } from './mobile-nav';
import Logo from './logo';
import { SearchInput } from '@/components/search-input';
import { ModeToggle } from '@/components/mode-toggle';
import { useCurrentRole } from '@/hooks/useCurrentRole';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface IDashboardShell {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize?: number;
  children: React.ReactNode;
}

export function DashboardShell({
  defaultLayout = [265, 440 + 655],
  defaultCollapsed = false,
  navCollapsedSize = 4,
  children,
}: IDashboardShell) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const user = useCurrentUser();
  const role = useCurrentRole();
  const pathname = usePathname();
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn(
            isCollapsed &&
              'min-w-[50px] transition-all duration-300 ease-in-out',
            'hidden lg:block'
          )}
        >
          <Logo isCollapsed={isCollapsed} />
          {role === 'ADMIN' && (
            <>
              <Separator />
              <Nav isCollapsed={isCollapsed} links={adminLinks} />
            </>
          )}
          <Separator />
          <Nav isCollapsed={isCollapsed} links={appLinks} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <div className={cn('h-full overflow-y-auto')}>
            <div
              className={cn(
                'sticky top-0 z-10',
                'h-[52px]',
                'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
                'flex items-center justify-between px-4'
              )}
            >
              <div className="block lg:hidden">
                <MobileNav />
              </div>
              <div className="block lg:hidden">
                <Logo isCollapsed={true} />
              </div>
              <div className="w-full flex items-center justify-end lg:justify-end space-x-4">
                {pathname === '/courses' && (
                  <div className="hidden lg:block">
                    <SearchInput />
                  </div>
                )}
                <div className="flex items-center space-x-4">
                  <ModeToggle />
                  {user ? (
                    <UserNav
                      user={{
                        name: user?.name ?? 'N/A',
                        email: user?.email ?? 'N/A',
                      }}
                    />
                  ) : (
                    <Link href={'/login'}>
                      <Button>Connexion</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <Separator className="sticky top-[52px]" />
            <div className={cn('overflow-y-auto')}>{children}</div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
