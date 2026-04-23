"use client";

import { getHorseVariantImage, getVariantName } from "@/utils/variant";
import Image from "next/image";
import * as styles from "./VariantSelector.css";

interface VariantSelectorProps {
  selectedVariant: number;
  onChange: (variant: number) => void;
}

export default function VariantSelector({
  selectedVariant,
  onChange,
}: VariantSelectorProps) {
  // Generate all 35 variants
  const variants = [];
  for (let color = 0; color < 7; color++) {
    for (let pattern = 0; pattern < 5; pattern++) {
      variants.push(color + pattern * 256);
    }
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>Appearance Variant</label>
      <div className={styles.grid}>
        {variants.map((v) => (
          <button
            key={v}
            type="button"
            className={v === selectedVariant ? styles.optionActive : styles.option}
            onClick={() => onChange(v)}
            title={getVariantName(v)}
          >
            <div className={styles.imageContainer}>
              <Image
                src={getHorseVariantImage(v)}
                alt={getVariantName(v)}
                width={32}
                height={32}
              />
            </div>
          </button>
        ))}
      </div>
      <div className={styles.selectedName}>
        {getVariantName(selectedVariant)}
      </div>
    </div>
  );
}
