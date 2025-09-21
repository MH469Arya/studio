'use client';

import { Globe, LifeBuoy, LogOut, Settings, User, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from './language-provider';
import Link from 'next/link';

export function UserNav() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full" id="user-nav-trigger">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="@artisan" />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{t('Artisan Kumar')}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {t('artisan.kumar@example.com')}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User />
              {t('Profile')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            {t('Settings')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Globe />
            {t('Choose Language')}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setLocale('en')}>
                <span className="w-6">{locale === 'en' && <Check />}</span>
                {t('English')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale('hi')}>
                 <span className="w-6">{locale === 'hi' && <Check />}</span>
                {t('Hindi')}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem>
          <LifeBuoy />
          {t('Support')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          {t('Log out')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
