import { Metadata } from "next";
import Link from "next/link";
import { getUniqueTowns, getPropertiesByTown, avg, slugify } from "@/lib/properties";

export const revalidate = 86400;

export function generateStaticParams() {
  return getUniqueTowns().map((t) => ({ town: t.slug }));
}

function fmtEur(n: number): string {
  return "€" + Math.round(n).toLocaleString("es-ES");
}

function titleCase(s: string): string {
  return s
    .split(/[\s-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: { params: Promise<{ town: string }> }): Promise<Metadata> {
  const { town } = await params;
  const townName = titleCase(town.replace(/-/g, " "));
  return {
    title: `Obra nueva en ${townName} — Precios y Rentabilidad 2026 | Avena Terminal`,
    description: `Analisis completo de obra nueva en ${townName}, Espana. Precios medios, rentabilidad bruta, puntuacion de inversion y preguntas frecuentes para inversores.`,
    alternates: {
      canonical: `https://avenaterminal.com/es/${town}`,
      languages: { en: `https://avenaterminal.com/towns/${town}` },
    },
    openGraph: {
      title: `Obra nueva en ${townName} — Precios y Rentabilidad 2026`,
      description: `Datos de inversion inmobiliaria en ${townName}. Precios, rentabilidad y analisis 2026.`,
      url: `https://avenaterminal.com/es/${town}`,
      locale: "es_ES",
    },
  };
}

export default async function EsTownPage({ params }: { params: Promise<{ town: string }> }) {
  const { town: townSlug } = await params;
  const data = getPropertiesByTown(townSlug);
  if (!data) {
    return (
      <main className="min-h-screen bg-[#0d1117] text-gray-100 flex items-center justify-center">
        <p className="text-gray-400">Ciudad no encontrada.</p>
      </main>
    );
  }

  const { town, properties } = data;
  const totalCount = properties.length;
  const avgPrice = avg(properties.map((p) => p.pf));
  const yieldsGross = properties.filter((p) => p._yield).map((p) => p._yield!.gross);
  const avgYield = avg(yieldsGross);
  const avgScore = avg(properties.filter((p) => p._sc).map((p) => p._sc!));
  const pricesPerM2 = properties.filter((p) => p.pm2 && p.pm2 > 0).map((p) => p.pm2!);
  const avgPm2 = avg(pricesPerM2);
  const types = [...new Set(properties.map((p) => p.t))].join(", ");

  const faqQuestions = [
    {
      q: `¿Cual es el precio medio de obra nueva en ${town}?`,
      a: `El precio medio de obra nueva en ${town} es de ${fmtEur(avgPrice)}. Actualmente hay ${totalCount} propiedades disponibles con un precio por metro cuadrado medio de ${fmtEur(avgPm2)}/m². Los tipos disponibles incluyen ${types}.`,
    },
    {
      q: `¿Que rentabilidad se puede esperar en ${town}?`,
      a: `La rentabilidad bruta media en ${town} es del ${avgYield.toFixed(1)}%. Estimamos una rentabilidad neta aproximada del ${(avgYield * 0.67).toFixed(1)}% despues de impuestos, seguros y gastos de comunidad. La puntuacion media de inversion es ${Math.round(avgScore)} sobre 100.`,
    },
    {
      q: `¿Es ${town} una buena zona para invertir en 2026?`,
      a: `${town} tiene una puntuacion media de inversion de ${Math.round(avgScore)}/100 en Avena Terminal. Con ${totalCount} propiedades nuevas y una rentabilidad bruta del ${avgYield.toFixed(1)}%, ofrece oportunidades para inversores que buscan obra nueva en la costa espanola. Se recomienda analizar cada propiedad individualmente.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es",
    mainEntity: faqQuestions.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#0d1117] text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <link
        rel="alternate"
        hrefLang="en"
        href={`https://avenaterminal.com/towns/${townSlug}`}
      />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/es" className="text-emerald-400 hover:text-emerald-300 text-sm mb-6 inline-block">
          &larr; Volver a inicio
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">
          Obra nueva en {town}
        </h1>
        <p className="text-gray-400 mb-12 text-sm">
          Precios y Rentabilidad 2026 &middot; Avena Terminal
        </p>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <MiniStat label="Propiedades" value={totalCount.toString()} />
          <MiniStat label="Precio Medio" value={fmtEur(avgPrice)} />
          <MiniStat label="Rentabilidad" value={avgYield.toFixed(1) + "%"} />
          <MiniStat label="Puntuacion" value={Math.round(avgScore).toString() + "/100"} />
        </section>

        {/* Analysis */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4 border-b border-gray-800 pb-2">
            Analisis de Inversion
          </h2>
          <div className="bg-[#161b22] rounded-lg p-6 border border-gray-800 text-gray-300 leading-relaxed space-y-4">
            <p>
              {town} cuenta con {totalCount} propiedades de obra nueva en la base de datos
              de Avena Terminal. El precio medio se situa en {fmtEur(avgPrice)}, con un
              precio por metro cuadrado medio de {fmtEur(avgPm2)}/m². Los tipos de propiedad
              disponibles incluyen {types}.
            </p>
            <p>
              La rentabilidad bruta media es del {avgYield.toFixed(1)}%, lo que se traduce
              en una rentabilidad neta estimada del {(avgYield * 0.67).toFixed(1)}% tras
              descontar impuestos locales (IBI), seguros, gastos de comunidad y periodos de
              desocupacion. La puntuacion media de inversion de las propiedades en {town} es
              de {Math.round(avgScore)} sobre 100, calculada mediante el algoritmo
              propietario de Avena Terminal que pondera valor, rentabilidad, ubicacion,
              calidad constructiva y riesgo.
            </p>
            <p>
              Para inversores internacionales, {town} ofrece acceso a la costa espanola con
              infraestructura consolidada. Se recomienda visitar las propiedades seleccionadas
              y consultar con un asesor fiscal especializado en inversiones no residentes en
              Espana antes de tomar una decision de compra.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-emerald-400 mb-6 border-b border-gray-800 pb-2">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-6">
            {faqQuestions.map((faq, i) => (
              <div
                key={i}
                className="bg-[#161b22] rounded-lg p-6 border border-gray-800"
              >
                <h3 className="font-semibold text-emerald-300 mb-3">{faq.q}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Link
            href={`/towns/${townSlug}`}
            className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Ver propiedades en ingles &rarr;
          </Link>
        </section>
      </div>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#161b22] rounded-lg p-4 border border-gray-800 text-center">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg font-bold text-emerald-400">{value}</p>
    </div>
  );
}
