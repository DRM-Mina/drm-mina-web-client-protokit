const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export async function fetchGameData() {
  const headers = { "Content-Type": "application/json" };
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

  if (status == 200) {
    return true;
  } else {
    return false;
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

export async function fetchSlotNames(
  userPubKey: string,
  gameId: number,
): Promise<string[]> {
  const headers = { "Content-Type": "application/json" };

  const res = await fetch(ENDPOINT + "slot-names/" + userPubKey, {
    headers,
    method: "POST",
    body: JSON.stringify({ gameId }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch slot names API");
  }
  return json;
}

export async function postSlotNames(
  userPubKey: string,
  gameId: number,
  slots: string[],
): Promise<boolean> {
  const headers = { "Content-Type": "application/json" };

  const res = await fetch(ENDPOINT + "slot-names/" + userPubKey, {
    headers,
    method: "POST",
    body: JSON.stringify({ gameId: gameId, slotNames: slots }),
  });

  const json = await res.json();
  const status = res.status;

  if (json.errors) {
    throw new Error("Failed to post slot names API");
  }

  if (status == 200) {
    return true;
  } else {
    return false;
  }
}

export async function postGameData(signedMessage: SignedData) {
  const headers = { "Content-Type": "application/json" };

  const res = await fetch(ENDPOINT + "change-game-data", {
    headers,
    method: "POST",
    body: JSON.stringify({ signature: signedMessage }),
  });

  const json = await res.json();
  const status = res.status;

  if (json.errors) {
    throw new Error("Failed to post game data API");
  }

  if (status == 200) {
    return true;
  } else {
    return false;
  }
}
