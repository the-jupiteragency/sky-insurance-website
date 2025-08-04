import { z } from "zod";

export const carInfoSchema = z.object({
  make: z.string().min(1, "Car make is required"),
  model: z.string().min(1, "Car model is required"),
  year: z
    .number()
    .min(1990)
    .max(new Date().getFullYear() + 1),
  market_price: z.number().min(50000, "Minimum price is 50,000 EGP"),
  condition: z.enum(["new", "used"]),
  fuel_type: z.enum(["fuel", "electric"]),
  has_official_dealership: z.boolean().optional(),
  insurance_type: z.enum(["full_value", "partial_value"]),
});

export const userInfoSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100),
  mobile_number: z
    .string()
    .regex(/^01[0-9]{9}$/, "Invalid Egyptian mobile number")
    .transform(val => val.trim()),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

export const documentsSchema = z.object({
  personal_id_front: z.string().optional(),
  personal_id_back: z.string().optional(),
  license_front: z.string().optional(),
  license_back: z.string().optional(),
});

export type CarInfo = z.infer<typeof carInfoSchema>;
export type UserInfo = z.infer<typeof userInfoSchema>;
export type Documents = z.infer<typeof documentsSchema>;
