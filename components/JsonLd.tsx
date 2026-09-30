/**
 * Renders a JSON-LD <script>. Server component — no client JS. "<" is
 * escaped as < so a string value containing "</script>" can't break
 * out of the tag.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
