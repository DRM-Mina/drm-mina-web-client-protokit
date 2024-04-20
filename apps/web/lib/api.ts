const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export async function fetchGameData() {
  const headers = { "Content-Type": "application/json" };
  console.log(ENDPOINT);
  const res = await fetch(ENDPOINT + "game-data", { headers, method: "GET" });
  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch API");
  }
  return json;
}

export async function toggleGameWishlist(
  userPubKey: string,
  gameId: number,
): Promise<boolean> {
  const headers = { "Content-Type": "application/json" };

  console.log("wishlist", userPubKey, gameId);

  const res = await fetch(ENDPOINT + "wishlist/" + userPubKey, {
    headers,
    method: "POST",
    body: JSON.stringify({ gameId }),
  });

  const json = await res.json();
  const status = res.status;

  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to add wishlist API");
  }

  if (status == 201) {
    return false;
  } else {
    return true;
  }
}

export async function fetchWishlist(userPubKey: string) {
  const headers = { "Content-Type": "application/json" };

  const res = await fetch(ENDPOINT + "wishlist/" + userPubKey, {
    headers,
    method: "GET",
  });
  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch wishlist API");
  }
  return json;
}
