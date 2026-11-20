import { NextResponse } from "next/server";
import { profiles } from "../../data/profiles";
import { getStore } from "../../../lib/store";

export async function GET() {
  try {
    const store = await getStore();

    const swipedIds = new Set(
      store.swipes.map((swipe) => swipe.profileId)
    );

    const feed = profiles
      .filter((profile) => !swipedIds.has(profile.id))
      .map(({ likedYou, ...profile }) => profile);

    return NextResponse.json(feed);
  } catch (error) {
    console.error("FEED API ERROR:", error);

    return NextResponse.json(
      { error: "Unable to load feed" },
      { status: 500 }
    );
  }
}
