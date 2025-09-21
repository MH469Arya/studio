'use client';

import { useState } from 'react';
import { useLanguage } from '../_components/language-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState('/avatars/01.png');
  const [story, setStory] = useState(
    'I am a third-generation artisan from Jaipur, specializing in Blue Pottery. My family has been perfecting this craft for over a century, passing down the secret techniques of preparing the quartz-based dough and creating the iconic turquoise-blue dyes from natural ingredients. I find joy in blending traditional motifs with contemporary designs, creating pieces that tell a story of heritage and innovation.'
  );
  
  const handleSave = () => {
    // Here you would typically save the data to a backend.
    // For this prototype, we'll just show a success message.
    console.log({ profileImage, story });
    toast({
      title: t('Profile Saved'),
      description: t('Your profile has been updated successfully.'),
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          {t('My Profile')}
        </h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t('Edit Your Profile')}</CardTitle>
          <CardDescription>
            {t("Share your story and what makes your craft unique. This information will be visible to customers.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImage} alt={t('Artisan Kumar')} />
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">{t('Profile Photo URL')}</Label>
              <Input
                id="picture"
                type="text"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
              />
            </div>
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="story">{t('Your Story')}</Label>
            <Textarea
              id="story"
              placeholder={t("Tell us about your journey, your craft, and your passion...")}
              rows={10}
              value={story}
              onChange={(e) => setStory(e.target.value)}
            />
          </div>
          <Button onClick={handleSave}>{t('Save Profile')}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
