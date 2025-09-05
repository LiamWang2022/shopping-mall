// mappers/product.mapper.ts
import type { ProductDTO, ShopLiteDTO } from "../dto/product.dto"

const toIdString = (v: any): string => {
  if (v && typeof v === 'object' && '_id' in v) return String((v as any)._id)
  if (v && typeof v.toString === 'function') return v.toString()
  return String(v)
}

const toShopLite = (ref: any): ShopLiteDTO => {
  if (!ref || typeof ref !== 'object' || !('_id' in ref)) {
    return { _id: toIdString(ref) }
  }
  const doc = ref as any
  const out: ShopLiteDTO = { _id: String(doc._id) }
  if (typeof doc.name === 'string') out.name = doc.name
  if (typeof doc.logo === 'string') out.logo = doc.logo
  if (typeof doc.ratingAvg === 'number' && Number.isFinite(doc.ratingAvg)) {
    out.ratingAvg = doc.ratingAvg
  }
  if (typeof doc.isActive === 'boolean') {
    out.isActive = doc.isActive
  }
  return out
}

export const toProductDTO = (p: any): ProductDTO => ({
  id:           toIdString(p._id ?? p.id),
  display_name: p.display_name,
  price:        Number(p.price ?? 0),
  images:       Array.isArray(p.images)
                  ? p.images
                      .filter((i: any) => i && i.url)
                      .map((i: any) => ({ url: String(i.url), alt: i.alt || undefined }))
                  : [],
  stock:        Number(p.stock_count ?? 0),
  shop:         toShopLite(p.shop),
  active:       !!p.isActive,
})

export const mapProductsDTO = (list: any[]) => list.map(toProductDTO)
