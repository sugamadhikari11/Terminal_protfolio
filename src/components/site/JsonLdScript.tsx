type JsonLdScriptProps = {
  id: string;
  data: Record<string, unknown>;
};

/** Server-safe JSON-LD script tag for App Router pages. */
export function JsonLdScript({ id, data }: JsonLdScriptProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
