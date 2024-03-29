'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePathname } from 'next/navigation';

interface INav {
  isCollapsed: boolean;
  links: {
    title: string;
    route: string;
    label?: string;
    icon: LucideIcon;
  }[];
}

export function Nav({ links, isCollapsed }: INav) {
  const pathname = usePathname();

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-2 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.route}
                  className={cn(
                    buttonVariants({
                      variant: pathname === link.route ? 'default' : 'ghost',
                      size: 'icon',
                    }),
                    'h-9 w-9 border hover:text-primary',
                    pathname === link.route &&
                      'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white hover:text-background'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={link.route}
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                  size: 'default',
                }),
                pathname === link.route &&
                  'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white border-r-4 text-primary border-primary rounded-r-none',
                'justify-start hover:text-primary'
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    'ml-auto',
                    pathname === link.route && 'text-background dark:text-white'
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
