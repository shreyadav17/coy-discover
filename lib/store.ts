
import { readFile, writeFile } from "fs/promises";
import path from "path";

export type SwipeAction = "like" | "pass";

type Store = {
  swipes: {
    profileId: number;
    action: SwipeAction;
  }[];
  matches: number[];
};

const filePath = path.join(process.cwd(), "data", "swipes.json");

export async function getStore(): Promise<Store> {
  try {
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content) as Store;
  } catch {
    const initial: Store = { swipes: [], matches: [] };
    await saveStore(initial);
    return initial;
  }
}

export async function saveStore(store: Store) {
  await writeFile(filePath, JSON.stringify(store, null, 2), "utf-8");
}
