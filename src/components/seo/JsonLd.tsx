interface JsonLdProps {
  data: Record<string, any>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2)
      }}
    />
  )
}

// Component for multiple JSON-LD objects
interface MultipleJsonLdProps {
  data: Record<string, any>[]
}

export function MultipleJsonLd({ data }: MultipleJsonLdProps) {
  return (
    <>
      {data.map((item, index) => (
        <JsonLd key={index} data={item} />
      ))}
    </>
  )
}