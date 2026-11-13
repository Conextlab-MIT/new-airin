import { Button } from "@nakama/ui/button";
import { Input } from "@nakama/ui/input";
import {
  Analytics01Icon,
  Image01Icon,
  Location01Icon,
  Message01Icon,
  SparklesIcon,
  TableIcon,
} from "hugeicons-react";
import { type ComponentType, type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/use-theme";
import { submitLaundryInnovationSummitWaitlist } from "@/lib/laundry-innovation-summit-waitlist";
import { markLogoSrc } from "@/lib/theme";

type Capability = {
  description: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
};

const CAPABILITIES: Capability[] = [
  {
    description:
      "Rencana konten mingguan, ide posting, dan teks siap salin untuk Instagram & TikTok.",
    icon: Image01Icon,
    title: "Media sosial",
  },
  {
    description:
      "Jawab pertanyaan pelanggan lewat WhatsApp: jam buka, harga, status pesanan.",
    icon: Message01Icon,
    title: "Layanan WhatsApp",
  },
  {
    description:
      "Ramalan permintaan, laporan singkat, dan ide promo saat cuaca mendukung.",
    icon: Analytics01Icon,
    title: "Analis data",
  },
  {
    description:
      "Bantu catat pemasukan, pengeluaran, dan stok lewat Google Sheets.",
    icon: TableIcon,
    title: "Keuangan & stok",
  },
  {
    description:
      "Ringkas ulasan & listing laundry di Google Maps (lewat alat riset web).",
    icon: Location01Icon,
    title: "Visibilitas lokasi",
  },
];

const initialForm = {
  businessName: "",
  email: "",
  name: "",
  whatsapp: "",
};

export function LaundryInnovationSummitPage() {
  const { resolvedTheme } = useTheme();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await submitLaundryInnovationSummitWaitlist(form);
      setSubmitted(true);
      setForm(initialForm);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gagal mengirim. Coba lagi sebentar."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-border/60 border-b">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img
              alt="Airin"
              className="size-8 rounded-lg"
              height={32}
              src={markLogoSrc(resolvedTheme)}
              width={32}
            />
            <span className="font-semibold text-sm tracking-tight">Airin</span>
          </div>
          <Link
            className="text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline"
            to="/login"
          >
            Masuk
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <section className="space-y-4 text-center">
          <p className="text-muted-foreground text-sm tracking-wide">
            Laundry Innovation Summit
          </p>
          <h1 className="text-balance font-semibold text-3xl tracking-tight sm:text-4xl">
            Agen AI untuk bisnis laundry Anda
          </h1>
          <p className="mx-auto max-w-xl text-pretty text-base text-muted-foreground leading-relaxed sm:text-lg">
            Airin adalah sistem agen AI yang membantu owner laundry menjalankan
            pemasaran, layanan pelanggan, dan laporan harian—{" "}
            <span className="text-foreground">
              tanpa menambah karyawan baru
            </span>
            .
          </p>
        </section>

        <section
          aria-labelledby="capability-heading"
          className="mt-14 space-y-6"
        >
          <h2
            className="text-center font-medium text-foreground text-lg"
            id="capability-heading"
          >
            Yang bisa Anda lihat di demo
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {CAPABILITIES.map(({ description, icon: Icon, title }) => (
              <li
                className="rounded-2xl border border-border/80 bg-card p-5 text-left shadow-none"
                key={title}
              >
                <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
                  <Icon aria-hidden className="size-5" />
                </div>
                <h3 className="font-medium text-base">{title}</h3>
                <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="waitlist-heading"
          className="mt-14 rounded-2xl border border-border/80 bg-card p-6 sm:p-8"
          id="daftar-tunggu"
        >
          <div className="mb-6 space-y-2 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-muted-foreground text-xs">
              <SparklesIcon aria-hidden className="size-3.5" />
              Daftar tunggu
            </div>
            <h2 className="font-semibold text-xl" id="waitlist-heading">
              Tertarik mencoba Airin?
            </h2>
            <p className="text-muted-foreground text-sm">
              Isi formulir ini. Tim kami akan menghubungi Anda lewat WhatsApp
              atau email. Belum ada pembayaran atau pembuatan akun di halaman
              ini.
            </p>
          </div>

          {submitted ? (
            <p
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-6 text-center text-emerald-900 text-sm dark:text-emerald-100"
              role="status"
            >
              Terima kasih. Data Anda sudah kami terima. Kami akan menghubungi
              Anda setelah acara summit.
            </p>
          ) : (
            <form
              className="mx-auto max-w-md space-y-4"
              onSubmit={handleSubmit}
            >
              <Field
                autoComplete="name"
                id="lis-name"
                label="Nama Anda"
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, name: value }))
                }
                required
                value={form.name}
              />
              <Field
                autoComplete="organization"
                id="lis-business"
                label="Nama bisnis laundry"
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, businessName: value }))
                }
                required
                value={form.businessName}
              />
              <Field
                autoComplete="tel"
                id="lis-whatsapp"
                inputMode="tel"
                label="Nomor WhatsApp"
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, whatsapp: value }))
                }
                placeholder="08xxxxxxxxxx"
                required
                value={form.whatsapp}
              />
              <Field
                autoComplete="email"
                id="lis-email"
                label="Email"
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, email: value }))
                }
                required
                type="email"
                value={form.email}
              />
              {error ? (
                <p className="text-destructive text-sm" role="alert">
                  {error}
                </p>
              ) : null}
              <Button
                className="w-full"
                disabled={submitting}
                size="lg"
                type="submit"
              >
                {submitting ? "Mengirim…" : "Gabung daftar tunggu"}
              </Button>
            </form>
          )}
        </section>

        <p className="mt-10 text-center text-muted-foreground text-xs leading-relaxed">
          Demo Laundry Innovation Summit · Airin
        </p>
      </main>
    </div>
  );
}

function Field({
  id,
  label,
  onChange,
  type = "text",
  value,
  required,
  autoComplete,
  inputMode,
  placeholder,
}: {
  id: string;
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="font-medium text-sm" htmlFor={id}>
        {label}
      </label>
      <Input
        autoComplete={autoComplete}
        className="h-11"
        id={id}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </div>
  );
}
