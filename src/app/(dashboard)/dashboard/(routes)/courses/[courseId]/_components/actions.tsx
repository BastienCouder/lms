'use client';

import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { ConfirmModal } from '@/components/modal/confirm-modal';
import { toast } from '@/components/ui/use-toast';
import { admin } from '@/app/(auth)/actions/admin.action';
import { toggleCoursePublication } from '@/app/(dashboard)/dashboard/(routes)/courses/action/action/toggle-publish-course';
import { deleteCourse } from '@/app/(dashboard)/dashboard/(routes)/courses/action/action/delete-course';

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    const adminResponse = await admin();
    if (adminResponse.error) {
      toast({
        title: adminResponse.error,
      });
      return;
    }

    try {
      setIsLoading(true);

      if (isPublished) {
        const res = await toggleCoursePublication(courseId, false);
        console.log(res);
        toast({
          title: 'Cours non publié',
        });
      } else {
        const res = await toggleCoursePublication(courseId, true);
        console.log(res);

        toast({
          title: 'Cours publié',
        });
      }

      router.refresh();
    } catch {
      toast({
        title: "Une erreur s'est produite",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    const adminResponse = await admin();
    if (adminResponse.error) {
      toast({
        title: adminResponse.error,
      });
      return;
    }

    try {
      setIsLoading(true);

      await deleteCourse(courseId);
      toast({
        title: 'Cours supprimé',
      });
      router.refresh();
      router.push(`/dashboard/courses`);
    } catch {
      toast({
        title: "Une erreur s'est produite",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
        aria-label={isPublished ? 'Non publié' : 'Publié'}
      >
        {isPublished ? 'Non publié' : 'Publié'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button aria-label="Supprimer le cours" size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" aria-label="icon supprimer" />
        </Button>
      </ConfirmModal>
    </div>
  );
};