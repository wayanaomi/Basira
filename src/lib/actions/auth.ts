"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { signIn } from "@/auth";

export interface AuthActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }

    return { fieldErrors };
  }

  const { name, username, email, password } = parsed.data;

  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    return {
      fieldErrors: {
        email: "An account with this email already exists.",
      },
    };
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUsername) {
    return {
      fieldErrors: {
        username: "Username taken. Please choose another username.",
      },
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        username,
        email,
        passwordHash,
        role: "STUDENT",
      },
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        fieldErrors: {
          username: "Username taken. Please choose another username.",
        },
      };
    }

    throw error;
  }

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/onboarding",
  });

  return {};
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error && typeof error === "object" && "type" in error) {
      return { error: "That email and password don't match." };
    }

    throw error;
  }

  return {};
}
