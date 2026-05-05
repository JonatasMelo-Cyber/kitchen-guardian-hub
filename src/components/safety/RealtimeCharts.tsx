import { Area, AreaChart, ResponsiveContainer, YAxis, XAxis } from "recharts";

interface Point { t: string; calor: number; fumaca: number; glp: number }

export function RealtimeCharts({ data }: { data: Point[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h2 className="text-sm font-bold tracking-wide">GRÁFICOS EM TEMPO REAL</h2>
      <p className="mb-3 text-[11px] text-muted-foreground">Acompanhe as leituras dos sensores</p>
      <div className="grid grid-cols-3 gap-3">
        <Mini title="Temperatura (°C)" data={data} dataKey="calor" color="hsl(var(--status-danger))" />
        <Mini title="Fumaça (%)"       data={data} dataKey="fumaca" color="hsl(var(--status-warning))" />
        <Mini title="Gás (ppm)"        data={data} dataKey="glp"    color="hsl(var(--status-gas))" />
      </div>
    </div>
  );
}

function Mini({ title, data, dataKey, color }: { title: string; data: Point[]; dataKey: keyof Point; color: string }) {
  const id = `g-${dataKey}`;
  return (
    <div className="rounded-lg border border-border bg-background/40 p-2">
      <div className="mb-1 text-[11px] font-semibold text-muted-foreground">{title}</div>
      <div className="h-[110px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} width={28} />
            <Area type="monotone" dataKey={dataKey as string} stroke={color} strokeWidth={2} fill={`url(#${id})`} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
