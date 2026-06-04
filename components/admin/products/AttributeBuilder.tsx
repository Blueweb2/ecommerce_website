"use client";

import { Plus, Trash2 } from "lucide-react";

type Attribute = {
  name: string;
  values: string[];
};

type Props = {
  attributes: Attribute[];
  setAttributes: (attrs: Attribute[]) => void;
};

export default function AttributeBuilder({
  attributes,
  setAttributes,
}: Props) {

  //  Add new attribute
  const addAttribute = () => {
    setAttributes([...attributes, { name: "", values: [""] }]);
  };

  //  Update attribute name (clean + lowercase)
  const updateName = (index: number, name: string) => {
    const cleaned = name.trim().toLowerCase();

    //  prevent duplicate names
    if (
      attributes.some(
        (attr, i) => i !== index && attr.name === cleaned
      )
    ) {
      return;
    }

    const updated = [...attributes];
    updated[index].name = cleaned;
    setAttributes(updated);
  };

  // Update value (trimmed)
  const updateValue = (
    attrIndex: number,
    valueIndex: number,
    value: string
  ) => {
    const cleaned = value.trim();

    const updated = [...attributes];
    updated[attrIndex].values[valueIndex] = cleaned;
    setAttributes(updated);
  };

  //  Add value
  const addValue = (index: number) => {
    const updated = [...attributes];
    updated[index].values.push("");
    setAttributes(updated);
  };

  //  Remove value (keep at least 1)
  const removeValue = (attrIndex: number, valueIndex: number) => {
    const updated = [...attributes];

    if (updated[attrIndex].values.length === 1) return;

    updated[attrIndex].values = updated[attrIndex].values.filter(
      (_, i) => i !== valueIndex
    );

    setAttributes(updated);
  };

  //  Remove attribute
  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  return (
    <section className="rounded-2xl border p-6 bg-white space-y-4">
      
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Attributes</h3>

        <button
          type="button"
          onClick={addAttribute}
          className="flex items-center gap-2 border px-3 py-1 rounded"
        >
          <Plus className="w-4 h-4" />
          Add Attribute
        </button>
      </div>

      {attributes.map((attr, i) => (
        <div key={i} className="border p-4 rounded-xl space-y-3">
          
          {/* Name */}
          <div className="flex gap-2">
            <input
              placeholder="Attribute name (e.g. size)"
              value={attr.name}
              onChange={(e) => updateName(i, e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />

            <button
              type="button"
              onClick={() => removeAttribute(i)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>

          {/* Values */}
          <div className="space-y-2">
            {attr.values.map((val, j) => (
              <div key={j} className="flex gap-2">
                <input
                  placeholder="Value (e.g. red)"
                  value={val}
                  onChange={(e) =>
                    updateValue(i, j, e.target.value)
                  }
                  className="border px-3 py-2 rounded w-full"
                />

                <button
                  type="button"
                  onClick={() => removeValue(i, j)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addValue(i)}
              className="text-sm text-blue-600"
            >
              + Add Value
            </button>
          </div>

        </div>
      ))}
    </section>
  );
}