import { z } from "zod";

/**
 * Schéma de validation pour l'inscription d'un utilisateur
 */
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Le nom complet doit contenir au moins 2 caractères")
      .max(100, "Le nom complet ne peut pas dépasser 100 caractères"),
    email: z.string().email("Adresse email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(72, "Le mot de passe ne peut pas dépasser 72 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

/**
 * Schéma de validation pour la connexion d'un utilisateur
 */
export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

/**
 * Schéma de validation pour la création/modification d'une todo
 */
export const todoSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(200, "Le titre ne peut pas dépasser 200 caractères"),
  description: z
    .string()
    .max(1000, "La description ne peut pas dépasser 1000 caractères")
    .optional(),
  status: z.enum(["en_cours", "termine"]),
});

/**
 * Types dérivés des schémas Zod
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TodoInput = z.infer<typeof todoSchema>;
