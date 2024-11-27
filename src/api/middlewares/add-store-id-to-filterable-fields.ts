import {
  type MedusaNextFunction,
  type MedusaRequest,
  type MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { UserDTO } from "@medusajs/framework/types";

export async function addStoreIdToFilterableFields(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const loggedInUser = req.scope.resolve("loggedInUser", {
    allowUnregistered: true,
  }) as UserDTO;
  if (!loggedInUser) {
    return next();
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: users } = await query.graph({
    entity: "user",
    fields: ["id", "email", "store.*"],
    filters: {
      id: [loggedInUser.id],
    },
  });

  const store = users[0].store;
  if (store) {
    if (!req.filterableFields) {
      req.filterableFields = {};
    }
    // set 'filterableFields' so then the 'maybeApplyLinkFilter' middleware will process it
    req.filterableFields["store_id"] = store.id;
  }

  return next();
}
