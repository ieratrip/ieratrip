# Ierapetra Tourism Site

Static tourism website σε `Next.js` με `App Router`, έτοιμο για deploy στο `Vercel`.

## Δομή

- `app/`: layout, homepage και global styles
- `components/`: sections και shared UI
- `data/site.ts`: όλο το editable περιεχόμενο σε ένα σημείο
- `next.config.ts`: static export config για hosting χωρίς server

## Πώς τρέχεις local

```bash
npm install
npm run dev
```

Άνοιξε:

```bash
http://localhost:3000
```

## Production build

```bash
npm run build
```

Με το `output: "export"` η παραγωγή βγαίνει ως static output, οπότε το Vercel το σερβίρει χωρίς backend λογική.

Αν θέλεις να δεις το export τοπικά μετά το build:

```bash
python3 -m http.server 4173 -d out
```

και ανοίγεις `http://localhost:4173`.

## Deploy στο Vercel

1. Κάνε push το repo σε GitHub.
2. Στο Vercel πάτα `Add New Project`.
3. Επίλεξε το repo.
4. Framework preset: `Next.js`.
5. Deploy χωρίς extra environment variables.

## Τι να πειράζεις συνήθως

- Κείμενα, links, στοιχεία επικοινωνίας: `data/site.ts`
- Styling / visual direction: `app/globals.css`
- Δομή homepage: `app/page.tsx`
