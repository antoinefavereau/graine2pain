import { getPayload } from "payload";

type PayloadClient = Awaited<ReturnType<typeof getPayload>>;
type PayloadFindQuery = Parameters<PayloadClient["find"]>[0];
type PayloadFindDocs = Awaited<ReturnType<PayloadClient["find"]>>["docs"];

export type SafePayloadFindResult = {
  docs: PayloadFindDocs;
};

export async function safePayloadFind(
  payload: PayloadClient,
  query: PayloadFindQuery,
  label: string,
): Promise<SafePayloadFindResult> {
  try {
    return await payload.find(query);
  } catch (error) {
    console.error(`[payload] Failed to load ${label}`, error);
    return { docs: [] as PayloadFindDocs };
  }
}
