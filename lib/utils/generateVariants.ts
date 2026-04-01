export type VariantAttributes = Record<string, string>;

export function generateVariants(
  attributes: { name: string; values: string[] }[]
): VariantAttributes[] {
  if (!attributes.length) return [];

  const combine = (
    index: number,
    current: VariantAttributes
  ): VariantAttributes[] => {
    if (index === attributes.length) return [current];

    const attr = attributes[index];

    return attr.values.flatMap((val) =>
      combine(index + 1, {
        ...current,
        [attr.name]: val,
      })
    );
  };

  return combine(0, {});
}