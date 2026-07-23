export function SpecTable({ specifications }: { specifications: string[] }) {
  if (specifications.length === 0) {
    return (
      <p className="font-mono text-xs uppercase tracking-[0.1em] text-on-surface-variant">
        Specifications coming soon — contact Afton for complete product details.
      </p>
    );
  }

  const rows = specifications.map((spec) => {
    const i = spec.indexOf(":");
    return i > 0 && i < 60
      ? { label: spec.slice(0, i).trim(), value: spec.slice(i + 1).trim() }
      : { label: null, value: spec.trim() };
  });

  return (
    <table className="w-full border-collapse">
      <tbody className="divide-y divide-outline-variant border-y border-outline-variant">
        {rows.map((row, i) => (
          <tr key={i}>
            {row.label ? (
              <>
                <td className="w-1/3 py-4 pr-4 align-top font-mono text-xs font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
                  {row.label}
                </td>
                <td className="py-4 font-body text-base">{row.value}</td>
              </>
            ) : (
              <td colSpan={2} className="py-4 font-body text-base">
                {row.value}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
