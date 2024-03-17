import { NavBar } from '@/components/layout/navbar';
import { SiteFooter } from '@/components/layout/site-footer';
import { marketingConfig } from '@/config/marketing';
import { currentUser } from '@/lib/authCheck';
import { Suspense } from 'react';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const user = await currentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback="...">
        <NavBar user={user} items={marketingConfig.mainNav} scroll={true} />
      </Suspense>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
