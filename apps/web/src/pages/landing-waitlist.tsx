import { ArrowRight01Icon, CheckmarkCircle02Icon } from "hugeicons-react";
import { type FormEvent, useRef, useState } from "react";

function WaitlistForm() {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  // A ref, so two submits in the same tick cannot both pass the guard.
  const sending = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sending.current) {
      return;
    }

    sending.current = true;

    const entry = Object.fromEntries(new FormData(event.currentTarget));
    setStatus("pending");

    try {
      const response = await fetch("/v1/public/waitlist", {
        body: JSON.stringify(entry),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: AbortSignal.timeout(15_000),
      });

      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    } finally {
      sending.current = false;
    }
  }

  if (status === "success") {
    return (
      <p className="landing-success" role="status">
        <CheckmarkCircle02Icon aria-hidden />
        Pendaftaran kamu sudah masuk daftar tunggu.
      </p>
    );
  }

  return (
    <form className="landing-form" onSubmit={submit}>
      <div className="landing-form-fields">
        <label>
          Nama PIC
          <input
            autoComplete="name"
            maxLength={120}
            name="contactName"
            required
          />
        </label>
        <label>
          Nama Perusahaan
          <input
            autoComplete="organization"
            maxLength={150}
            name="businessName"
            required
          />
        </label>
        <label>
          Jenis Usaha
          <input
            maxLength={100}
            name="businessType"
            placeholder="Contoh: laundry"
            required
          />
        </label>
        <label>
          Nomor WhatsApp
          <input
            autoComplete="tel"
            maxLength={32}
            name="whatsapp"
            pattern="[+]?[0-9 \x28\x29\x2D]{8,31}"
            placeholder="+628123456789"
            required
            type="tel"
          />
        </label>
        <label>
          Email
          <input
            autoComplete="email"
            maxLength={254}
            name="email"
            placeholder="nama@bisnis.com"
            required
            type="email"
          />
        </label>
      </div>
      <button
        className="landing-button"
        disabled={status === "pending"}
        type="submit"
      >
        {status === "pending" ? "Mengirim…" : "Masuk daftar tunggu"}
        <ArrowRight01Icon aria-hidden />
      </button>
      {status === "error" && (
        <p className="landing-error" id="waitlist-error" role="alert">
          Pendaftaran belum tersimpan. Cek data kamu dan coba lagi.
        </p>
      )}
    </form>
  );
}

export { WaitlistForm };
