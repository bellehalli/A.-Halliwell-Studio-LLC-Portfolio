export const signatureFields = ["studioSignature", "studioDate", "clientSignature", "clientDate"] as const;
export type SignatureField = typeof signatureFields[number];
export type SignaturePosition = { page: number; x: number; y: number; width: number };
export type SignatureLayout = Record<SignatureField, SignaturePosition>;
export function validSignatureLayout(value: unknown): value is SignatureLayout {
  if (!value || typeof value !== "object") return false;
  return signatureFields.every(key => {
    const p = (value as SignatureLayout)[key];
    return p && Number.isInteger(p.page) && p.page >= 1 && p.page <= 100 &&
      [p.x, p.y, p.width].every(Number.isFinite) && p.x >= 0 && p.y >= 0 && p.width >= 40 && p.width <= 600;
  });
}
