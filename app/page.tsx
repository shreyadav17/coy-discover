
"use client";

import { useEffect, useRef, useState } from "react";

type Profile = {
  id: number;
  name: string;
  age: number;
  city: string;
  bio: string;
  interests: string[];
  photo: string;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("Discover");
  const [feed, setFeed] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [liked, setLiked] = useState<number[]>([]);
  const [passed, setPassed] = useState<number[]>([]);
  const [newMatch, setNewMatch] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [error, setError] = useState("");

  const touchStartX = useRef(0);
  const profile = feed[0];

  useEffect(() => {
    async function loadData() {
      try {
        const [feedResponse, matchesResponse] = await Promise.all([
          fetch("/api/feed"),
          fetch("/api/matches"),
        ]);

        if (!feedResponse.ok || !matchesResponse.ok) {
          throw new Error("Unable to load profiles");
        }

        const feedData = await feedResponse.json();
        const matchesData = await matchesResponse.json();

        setFeed(feedData);
        setMatches(matchesData);
      } catch (err) {
        setError("Unable to load data. Please refresh the page.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleSwipe(action: "like" | "pass") {
    if (!profile || swiping) return;

    setSwiping(true);
    setError("");

    try {
      const response = await fetch("/api/swipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId: profile.id,
          action,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Swipe failed");
      }

      if (action === "like") {
        setLiked((prev) => [...prev, profile.id]);
      } else {
        setPassed((prev) => [...prev, profile.id]);
      }

      setFeed((prev) => prev.filter((p) => p.id !== profile.id));

      if (result.isMatch) {
        setMatches((prev) => {
          if (prev.some((p) => p.id === profile.id)) return prev;
          return [...prev, profile];
        });

        setNewMatch(profile);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSwiping(false);
    }
  }

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    const difference =
      e.changedTouches[0].clientX - touchStartX.current;

    if (difference > 80) {
      handleSwipe("like");
    } else if (difference < -80) {
      handleSwipe("pass");
    }
  }

  return (
    <main className="app">
      <header className="topbar">
        <h1 className="logo">
          coy<span>.</span>
        </h1>
        <p className="tagline">Make meaningful connections.</p>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === "Home" ? "active" : ""}
          onClick={() => setActiveTab("Home")}
        >
          Home
        </button>

        <button
          className={activeTab === "Discover" ? "active" : ""}
          onClick={() => setActiveTab("Discover")}
        >
          Discover
        </button>

        <button
          className={activeTab === "Matches" ? "active" : ""}
          onClick={() => setActiveTab("Matches")}
        >
          Matches ({matches.length})
        </button>
      </nav>

      {activeTab === "Home" ? (
        <section className="home">
          <h2>Welcome to Coy</h2>
          <p>Your space for meaningful connections.</p>
        </section>
      ) : activeTab === "Matches" ? (
        <section className="matches-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR CONNECTIONS</p>
              <h2>Matches</h2>
            </div>
            <span className="badge">{matches.length} matches</span>
          </div>

          {matches.length > 0 ? (
            <div className="matches-grid">
              {matches.map((person) => (
                <div className="match-card" key={person.id}>
                  <div
                    className="match-photo"
                    style={{
                      backgroundImage: `url(${person.photo})`,
                    }}
                  />
                  <div className="match-info">
                    <h3>{person.name}, {person.age}</h3>
                    <p>{person.city}</p>
                    <span>♥ It's a match!</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span>♡</span>
              <h2>No matches yet</h2>
              <p>Keep discovering to find your connection.</p>
              <button onClick={() => setActiveTab("Discover")}>
                Discover profiles
              </button>
            </div>
          )}
        </section>
      ) : (
        <section className="discover">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR NEXT CONNECTION</p>
              <h2>Discover</h2>
            </div>
            <span className="badge">{feed.length} left</span>
          </div>

          {loading ? (
            <div className="empty-state">
              <h2>Loading profiles...</h2>
            </div>
          ) : error && feed.length === 0 ? (
            <div className="empty-state">
              <h2>Something went wrong</h2>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : profile ? (
            <>
              <div className="profile-card" key={profile.id}>
                <div
                  className="profile-photo"
                  style={{
                    backgroundImage: `url(${profile.photo})`,
                    touchAction: "pan-y",
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className="photo-gradient">
                    <div className="photo-details">
                      <h2>{profile.name}, {profile.age}</h2>
                      <p>⌖ {profile.city}</p>
                    </div>
                  </div>
                </div>

                <div className="profile-info">
                  <p>{profile.bio}</p>
                  <div className="interests">
                    {profile.interests.map((interest) => (
                      <span key={interest}>{interest}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="actions">
                <button
                  className="pass"
                  onClick={() => handleSwipe("pass")}
                  disabled={swiping}
                  aria-label="Pass profile"
                >
                  ×
                </button>

                <button
                  className="like"
                  onClick={() => handleSwipe("like")}
                  disabled={swiping}
                  aria-label="Like profile"
                >
                  ♥
                </button>
              </div>

              <p className="hint">
                {liked.length} liked · {passed.length} passed
              </p>

              {error && <p className="hint">{error}</p>}
            </>
          ) : (
            <div className="empty-state">
              <span>♡</span>
              <h2>You're all caught up!</h2>
              <p>You've discovered all available profiles.</p>
            </div>
          )}
        </section>
      )}

      {newMatch && (
        <div className="match-overlay">
          <div className="match-popup">
            <span className="match-heart">♥</span>
            <p className="eyebrow">IT'S A MATCH!</p>
            <h2>You and {newMatch.name}</h2>
            <p>You both liked each other.</p>

            <button onClick={() => setNewMatch(null)}>
              Continue Discovering
            </button>

            <button
              className="view-matches"
              onClick={() => {
                setNewMatch(null);
                setActiveTab("Matches");
              }}
            >
              View Matches
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        <span>coy.</span>
        <p>Connections that matter.</p>
      </footer>
    </main>
  );
}
