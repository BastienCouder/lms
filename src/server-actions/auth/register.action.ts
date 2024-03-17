'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { RegisterSchema } from '@/schemas/auth';

import { generateVerificationToken } from '@/lib/tokens';
import { getUserByEmail } from '@/lib/data/user';
import { sendVerificationEmail } from '@/lib/email';
import { db } from '@/lib/prisma';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email already in use!' };
  }
  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const defaultFolders = ['Documents', 'Downloads', 'Pictures', 'Videos'];

  await Promise.all(
    defaultFolders.map((folderName) =>
      db.folder.create({
        data: {
          name: folderName,
          userId: user.id,
        },
      })
    )
  );

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'Confirmation email sent!' };
};