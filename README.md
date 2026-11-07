# Lundby Pizza & Grillbar – hjemmeside

Statisk side uden build-trin og uden eksterne afhængigheder (skrifter ligger i `fonts/`).

## Se den lokalt

```
python3 -m http.server 4750
```

## Hosting

Kører på GitHub Pages fra `main` / rod. Kan også lægges på Cloudflare Pages: Workers & Pages → Create → Pages → Upload assets.

## Ret menukortet

Alle retter og priser ligger i `assets/menu.js`. Pizzaernes grafik tegnes automatisk ud fra fyldet i beskrivelsen.
