// src/utils/userStorage.js

function getCurrentUserId() {
  try {
    const stored = localStorage.getItem("userInfo");
    if (!stored) return "guest";
    const user = JSON.parse(stored);
    return user?._id || user?.id || "guest";
  } catch {
    return "guest";
  }
}

export function wishlistKey(userId = getCurrentUserId()) {
  return `tm_wishlist_${userId}`;
}

export function cartKey(userId = getCurrentUserId()) {
  return `cart_${userId}`;
}

export function readWishlistIds() {
  try {
    return JSON.parse(localStorage.getItem(wishlistKey())) || [];
  } catch {
    return [];
  }
}

export function writeWishlistIds(ids) {
  try {
    localStorage.setItem(wishlistKey(), JSON.stringify(ids));
    window.dispatchEvent(new Event("wishlist:change"));
  } catch {}
}

export function readCart() {
  try {
    return JSON.parse(localStorage.getItem(cartKey())) || [];
  } catch {
    return [];
  }
}

export function writeCart(cart) {
  try {
    localStorage.setItem(cartKey(), JSON.stringify(cart));
    window.dispatchEvent(new Event("cart:change"));
  } catch {}
}

// guest session on this browser.
export function mergeGuestDataIntoUser(userId) {
  try {
    // Wishlist: union of guest + existing user ids, de-duplicated
    const guestWishlist = JSON.parse(localStorage.getItem(wishlistKey("guest"))) || [];
    if (guestWishlist.length) {
      const userWishlist = JSON.parse(localStorage.getItem(wishlistKey(userId))) || [];
      const merged = Array.from(new Set([...userWishlist, ...guestWishlist]));
      localStorage.setItem(wishlistKey(userId), JSON.stringify(merged));
      localStorage.removeItem(wishlistKey("guest"));
    }

    // Cart: merge by _id + size, summing quantities on overlap
    const guestCart = JSON.parse(localStorage.getItem(cartKey("guest"))) || [];
    if (guestCart.length) {
      const userCart = JSON.parse(localStorage.getItem(cartKey(userId))) || [];
      const merged = [...userCart];
      guestCart.forEach((gItem) => {
        const match = merged.find((u) => u._id === gItem._id && u.size === gItem.size);
        if (match) match.qty += gItem.qty;
        else merged.push(gItem);
      });
      localStorage.setItem(cartKey(userId), JSON.stringify(merged));
      localStorage.removeItem(cartKey("guest"));
    }

    window.dispatchEvent(new Event("wishlist:change"));
    window.dispatchEvent(new Event("cart:change"));
  } catch {
    // ignore malformed data
  }
}