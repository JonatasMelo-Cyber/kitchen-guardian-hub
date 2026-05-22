import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HelpCircle,
  X,
  Mail,
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Headphones,
  Clock,
  FileText,
  UserCheck,
  MonitorSmartphone,
} from "lucide-react";

const faqs = [
  {
    question: "Como entrar em contato com o suporte?",
    answer:
      "Você pode entrar em contato através do e-mail safekitchensuporte@gmail.com, telefone (11) 4002-8922 ou WhatsApp (11) 4002-8922. Nossa equipe está pronta para ajudar.",
    icon: Headphones,
  },
  {
    question: "Qual o horário de atendimento?",
    answer:
      "O atendimento por e-mail e WhatsApp funciona 24 horas. O suporte telefônico está disponível de segunda a sexta, das 08h às 18h.",
    icon: Clock,
  },
  {
    question: "Como abrir um chamado?",
    answer:
      "Envie um e-mail para safekitchensuporte@gmail.com com o assunto 'Chamado Técnico', descrevendo o problema e anexando prints ou evidências. Você receberá um número de protocolo em até 30 minutos.",
    icon: FileText,
  },
  {
    question: "Como solicitar suporte presencial?",
    answer:
      "Abra um chamado técnico informando a necessidade de visita presencial. Um técnico será agendado em até 48 horas úteis, dependendo da sua região.",
    icon: UserCheck,
  },
  {
    question: "Como funciona o atendimento remoto?",
    answer:
      "Após abrir o chamado, nossa equipe acessa o sistema de forma segura para diagnóstico e ajustes. Todo acesso é logado e requer sua autorização prévia.",
    icon: MonitorSmartphone,
  },
];

function FaqItem({
  item,
  open,
  onToggle,
}: {
  item: (typeof faqs)[number];
  open: boolean;
  onToggle: () => void;
}) {
  const Icon = item.icon;
  return (
    <div className="rounded-xl border border-border bg-card/50 transition-colors hover:bg-card/80">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="flex-1 text-sm font-semibold text-foreground">
          {item.question}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0">
          <p className="ml-11 text-sm leading-relaxed text-muted-foreground">
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export function HelpModal() {
  const [open, setOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        title="Central de Ajuda"
      >
        <HelpCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Central de Ajuda</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[90vh] w-full max-w-lg flex-col gap-0 overflow-hidden border-border bg-card p-0 sm:rounded-2xl">
          <DialogHeader className="shrink-0 border-b border-border bg-card/60 px-6 py-5">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2.5 text-lg font-extrabold tracking-wide text-foreground">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                Perguntas Frequentes
              </DialogTitle>
            </div>
            <p className="ml-11.5 mt-1 text-sm text-muted-foreground">
              Tire suas dúvidas ou fale com o suporte
            </p>
          </DialogHeader>

          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-3">
              {faqs.map((item, i) => (
                <FaqItem
                  key={i}
                  item={item}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              ))}
            </div>

            {/* Contato */}
            <div className="mt-6 rounded-2xl border border-border bg-secondary/40 p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-foreground">
                <MessageCircle className="h-4 w-4 text-primary" />
                Informações de Contato
              </h3>
              <div className="space-y-3">
                <a
                  href="mailto:safekitchensuporte@gmail.com"
                  className="flex items-center gap-3 rounded-xl bg-card/60 p-3 transition-colors hover:bg-card"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      E-mail
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      safekitchensuporte@gmail.com
                    </div>
                  </div>
                </a>
                <a
                  href="tel:1140028922"
                  className="flex items-center gap-3 rounded-xl bg-card/60 p-3 transition-colors hover:bg-card"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-status-normal/10">
                    <Phone className="h-4 w-4 text-status-normal" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Telefone
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      (11) 4002-8922
                    </div>
                  </div>
                </a>
                <a
                  href="https://wa.me/551140028922"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-card/60 p-3 transition-colors hover:bg-card"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                    <MessageCircle className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      WhatsApp
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      (11) 4002-8922
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <div className="mt-4 pb-2 text-center text-[11px] text-muted-foreground">
              SafeKitchen · Suporte Técnico
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
