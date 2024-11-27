import {
  type MedusaNextFunction,
  type MedusaRequest,
  type MedusaResponse,
} from "@medusajs/framework/http";

export async function moveIdsToQueryFromFilterableFields(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  if (!req.filterableFields) {
    return next();
  }

  // do this, otherwise the 'filterableFields' will be overwritten in
  // https://github.com/medusajs/medusa/blob/develop/packages/medusa/src/api/admin/products/middlewares.ts#L49
  if (req.filterableFields.id) {
    req.query["id"] = req.filterableFields.id as string[];
  } else if (req.filterableFields.store_id) {
    req.query["id"] = req.filterableFields.store_id as string;
  }

  return next();
}
