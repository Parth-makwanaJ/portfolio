/** Public contact links. Set them in .env.local (see .env.example). Blocks using them hide when unset. */
export const publicLinks = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || null,
  booking: process.env.NEXT_PUBLIC_BOOKING_URL || null,
};
