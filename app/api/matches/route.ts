import { NextResponse } from "next/server";
import { profiles } from "../../data/profiles";
import { getStore } from "../../../lib/store";

export async function GET() {
  try {
    const store = await getStore();

    const matches = profiles.filter((profile) =>
      store.matches.includes(profile.id)
    );

    return NextResponse.json(matches);
  } catch (error) {
    console.error("MATCHES API ERROR:", error);

    return NextResponse.json(
      { error: "Unable to load matches" },
      { status: 500 }
    );
  }
}
