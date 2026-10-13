# BenchBox: the snack pack after the kick

A mobile app (Expo / React Native) for ordering healthy pre-game, halftime and post-game snack packs for players, from kids' teams to elite athletes.

## What you can do

- **Browse snack packs** by group (Kids, Teens/Adults, Elite Athletes), search, and see pack details
- **Build your own box**: pick the sport, who it's for, dietary needs (nut-free, gluten-free, dairy-free), 3 to 6 snacks, and a player name. Unsafe snacks are hidden automatically when you choose a dietary need.
- **Cart** with quantities, line totals and a running total; the cart badge shows the item count; the cart survives app restarts
- **Checkout** with inline validation, saved details for next time, and an order confirmation
- **Order history** saved on the device
- **Light and dark mode** (follows the phone, or switch from the Home screen)

## Run it

```bash
npm install
npm start          # then scan the QR code with Expo Go, or press a / i
npm test           # cart, order and build-your-box logic tests
```

## Project layout

| Path | What's there |
|---|---|
| `App.js` | Providers (theme, profile, orders, cart) and navigation |
| `src/navigation/AppNavigator.js` | Tabs: Shop, Cart, Orders, and their stacks |
| `src/screens/` | Home, Snack Packs, Build Your Box, Cart, Checkout, Order Placed, Orders |
| `src/logic/` | Pure cart, order and custom-box logic (unit tested in `tests/`) |
| `src/context/` | Cart, orders, theme and customer profile state |
| `src/api/` | Catalog and orders. Stored on the device today; replace the function bodies with network calls when a backend exists. |

## Not built yet

- Payments (checkout notes that payment is collected on delivery)
- A backend: orders and profiles stay on the device
- Real sign-in (the profile context is ready to be swapped for one)
