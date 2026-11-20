import { NextRequest, NextResponse } from "next/server";
import { profiles } from "../../data/profiles";
import { getStore, saveStore, SwipeAction } from "../../../lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const profileId = Number(body.profileId);
    const action = body.action as SwipeAction;

    if (
      !Number.isInteger(profileId) ||
      !["like", "pass"].includes(action)
    ) {
      return NextResponse.json(
        { error: "Invalid swipe data" },
        { status: 400 }
      );
    }

    const profile = profiles.find((p) => p.id === profileId);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const store = await getStore();

    if (store.swipes.some((s) => s.profileId === profileId)) {
      return NextResponse.json(
        { error: "Profile already swiped" },
        { status: 409 }
      );
    }

    store.swipes.push({ profileId, action });

    let isMatch = false;

    if (action === "like" && profile.likedYou) {
      if (!store.matches.includes(profileId)) {
        store.matches.push(profileId);
      }

      isMatch = true;
    }

    await saveStore(store);

    return NextResponse.json({
      success: true,
      isMatch,
    });
  } catch (error) {
    console.error("SWIPE API ERROR:", error);

    return NextResponse.json(
      { error: "Unable to save swipe" },
      { status: 500 }
    );
  }
}
