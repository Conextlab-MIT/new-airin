import { z } from "zod";

const waitlistErrorBodySchema = z.object({
  error: z.string().optional(),
});

export type LaundryInnovationSummitWaitlistInput = {
  name: string;
  businessName: string;
  whatsapp: string;
  email: string;
};

const WAITLIST_PATH = "/v1/public/waitlist/laundry-innovation-summit";

export async function submitLaundryInnovationSummitWaitlist(
  input: LaundryInnovationSummitWaitlistInput
): Promise<void> {
  const payload = {
    businessName: input.businessName.trim(),
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    whatsapp: input.whatsapp.trim(),
  };

  if (
    !(payload.name && payload.businessName && payload.whatsapp && payload.email)
  ) {
    throw new Error("Lengkapi semua kolom formulir.");
  }

  const response = await fetch(WAITLIST_PATH, {
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  if (!response.ok) {
    let message = "Gagal mengirim daftar tunggu.";

    try {
      const body = waitlistErrorBodySchema.parse(await response.json());

      if (body.error?.trim()) {
        message = body.error;
      }
    } catch {
      // Keep default message when the body is not JSON.
    }

    throw new Error(message);
  }
}
