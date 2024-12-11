## The Course Project

### Public and Private Pages

Public "marketing" pages & Private "app" pages

### Table:

| Public/Private | Route | Description |
| --- | --- | --- |
| Public | / | Home page |
| Public | /pricing | Pricing info |
| Public | /auth | User authentication |
| Protected | /expenses | List of expenses |
| Protected | /expenses/raw | Raw data of expenses |
| Protected | /expenses/add | Add a new expense |
| Protected | /expenses/edit/:id | Edit an expense |
| Protected | /expenses/analysis | Analysis of expenses |


### Comencem!

Per crear un nou projecte de Remix, utilitza la comanda `npx create-remix@latest`. Això, com sempre, et demanarà algunes qüestions com el nom de la carpeta de projecte, si ho necessites.


Per començar, intenta generar l'estructura d'arxius, preferiblement amb el format de nom d'arxiu (notació amb punts), ja que és la que he fet servir i l'opció "moderna" de Remix. 

app/
├── routes/
│   ├── _index.tsx                   // Ruta "/"
│   ├── pricing.tsx                  // Ruta "/pricing"
│   ├── auth.tsx                     // Ruta "/auth"
│   ├── expenses._index.tsx          // Ruta "/expenses"
│   ├── expenses.raw.tsx             // Ruta "/expenses/raw"
│   ├── expenses.add.tsx             // Ruta "/expenses/add"
│   ├── expenses.edit.$id.tsx        // Ruta "/expenses/edit/:id"
│   ├── expenses.analysis.tsx        // Ruta "/expenses/analysis"

Aquesta estructura inicial l'haurem de modificar a mesura que avancem en el projecte.

Aixeca el teu projecte i mira que les diferents rutes estiguin operatives. 

### Nested Paths i Layouts

En ocasions ens pot passar que les nostres rutes (i per tant el nom de l'arxiu) siguin massa llargues o complicades. En aquests casos, podem fer servir rutes anidades. Per exemple, si tenim una ruta `/expenses/analysis` i volem que sigui més senzill, podem crear una carpeta `expenses` i dins d'aquesta una altra carpeta `analysis` amb l'arxiu `_index.tsx` que contindrà el codi de la pàgina.

En qualssevol cas, com que hem decidit treballar amb la convenció de noms d'arxius amb punts. 

Ara bé, el concepte de **Layout** sí que l'hem de tenir en compte. Un layout és un component que envolta ("wraps") la pàgina i que pot ser compartit per diverses rutes. Per exemple, podem tenir un layout per a les pàgines públiques i un altre per a les pàgines privades. Això ens ajuda a evitar repetir codi i a mantenir la consistència en el nostre projecte. En realitat el teu component `root` és un layout, per això té elements com el `head` amb components generals com `Meta` o `Links`. Ja saps que `Outlet` és allà on s'injecten els components ruta. De fet conforme es vagi tornant més "complexa" la nostra aplicació, és probable que necessitis més d'un layout.

Suposem que vols un layout per `expenses`. Seguint la nostra lògica de rutes, aquest layout hauria de ser visible per totes les rutes que comencin per `/expenses`. Per tant, podem crear una carpeta `expenses` o bé, en el nostre cas directament amb un arxiu `expenses.tsx` que contindrà el codi del layout. Després ja començarem amb les nostres pàgines `expenses._index.tsx`, `expenses.analysis.tsx`, etc.

### Components i Estils per la nostra aplicació

Anem a mirar de donar una mica d'estil amb Tailwind a la nostra aplicació abans d'endinsar-nos en la lògica pròpiament. El curs d'on he tret aquesta informació treballa amb CSS però com que nosaltres hem treballat amb Tailwind darrerament, mirarem de fer-ho amb aquesta llibreria. 

El meu fitxer de layout per expenses podria ser així:

```tsx
// app/routes/expenses.tsx
import { Outlet } from "@remix-run/react";

export default function ExpensesLayout() {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-indigo-900 min-h-screen">
      <header className="bg-indigo-700 text-white p-4 shadow-lg">
        <h1 className="text-3xl font-bold">Expenses Dashboard</h1>
      </header>
      <main className="container mx-auto mt-4">
        <Outlet />
      </main>
    </div>
  );
}
```
Anem a instal·lar també una font de Google Fonts. Per exemple, la font `Rubik': 


Ves a la pàgina de Google Fonts i cerca "Rubik". Hauràs d'adaptar una mica els codis de google fonts per afegir-los al teu `app/root.tsx` dins de la secció `<head>`.

```tsx
// app/root.tsx
...
export const links: LinksFunction = () => {
  return [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swaphttps://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap",
    },
  ];
};
... 
```

2. Configura TailwindCSS per utilitzar la font

Edita el fitxer `tailwind.config.js` per afegir la font Rubik com a font principal o personalitzada:

```javascript
// tailwind.config.js
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}", // Asegura que Tailwind veu tot el codi dins de Remix
    ],
    theme: {
        extend: {
            fontFamily: {
                rubik: ["Rubik", "sans-serif"], // Afegeix "Rubik" com a font personalitzada
            },
        },
    },
    plugins: [],
};
```

3. Utilitza la font Rubik a les classes de Tailwind

Un cop configurada la font, pots aplicar-la a qualsevol element utilitzant la classe `font-rubik`:

```tsx
export default function HomePage() {
    return (
        <div className="font-rubik text-center p-8">
            <h1 className="text-3xl font-bold">Welcome to Remix with Rubik</h1>
            <p className="mt-4 text-lg">This page uses the Rubik font family.</p>
        </div>
    );
}
```

4. Comprova que tot funciona

Arranca el servidor de desenvolupament:

```bash
npm run dev
```

Si volem que `Rubik` sigui la font per defecte de tota la nostra aplicació:

Actualitza el fitxer `tailwind.config.js`:

Configura la font Rubik com a font predeterminada actualitzant el tema `fontFamily` de Tailwind. Substitueix la font predeterminada per Rubik i afegeix un fallback a sans-serif com a seguretat:

```javascript
// tailwind.config.js
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}", // Assegura que Tailwind veu els fitxers de Remix
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Rubik", "sans-serif"], // Defineix Rubik com a font predeterminada
            },
        },
    },
    plugins: [],
};
```

Per finalitzar veuràs que hi ha diversos components al projecte exemple. Aquests components els pots copiar de manera que poguem ja començar a treballar amb ells. De moment m'he limitat a passar el codi original en `.jsx`a `.tsx` i pot ser que vegis alguns errors. A mesura que els fem servir, anirem corregint aquests. Afegeix la carpeta al teu projecte i si vols fes un cop d'ull a cadascun d'ells per tenir una idea.

Basant-me en els noms dels components, puc deduir una idea general del que cadascun podria fer:

---

### **Carpeta: `auth`**
1. **`AuthForm.tsx`**
   - Formulari d'autenticació (login, registre o reset de contrasenya).

---

### **Carpeta: `expenses`**
1. **`Chart.tsx`**
   - Component principal que mostra gràfics relacionats amb les despeses.
   - Agafa les dades i les passa a subcomponents com `ChartBar.tsx`.

2. **`ChartBar.tsx`**
   - Subcomponent per representar una barra individual dins d'un gràfic de barres.
   - El farem servir dins de `Chart.tsx` per construir el gràfic.

3. **`ExpenseForm.tsx`**
   - Formulari per afegir o editar despeses.
   - Hauria d'incloure camps com nom, import, data, i un botó d'enviament.

4. **`ExpenseListItem.tsx`**
   - Element individual dins de la llista de despeses.
   - Hauria de mostrar informació com el títol, la quantitat i la data d'una despesa específica.

5. **`ExpensesList.tsx`**
   - Component que mostra una llista completa de despeses.
   - Hauria d'acabar utilitzant diversos `ExpenseListItem.tsx` per renderitzar cada despesa.

6. **`ExpenseStatistics.tsx`**
   - Per mostrar estadístiques relacionades amb les despeses, com sumes totals, mitjanes, o categories destacades.

---

### **Carpeta: `marketing`**
1. **`PricingPlan.tsx`**
   - Mostra els plans de preus o serveis que s'ofereixen.
   - Hauria d'incloure descripcions, preus, i botons per subscriure's o obtenir més informació.

---

### **Carpeta: `navigation`**
1. **`MainHeader.tsx`**
   - Serveix com a capçalera principal de l'aplicació.
   - Hauria d'incloure la navegació del lloc, el logo, i enllaços com inici de sessió, registre o desconnexió.

---

### **Carpeta: `util`**
1. **`Error.tsx`**
   - Component per mostrar errors.
   - A utilitzar amb un Error Boundary per gestionar errors d'aplicació.

2. **`Logo.tsx`**
   - Mostra el logo de l'aplicació.
   - Pot ser reutilitzat en components com la capçalera (`MainHeader.tsx`) o pàgines de màrqueting.

3. **`Modal.tsx`**
   - Un component modal genèric. El modal és una finestra emergent que bloqueja la resta de la interfície.
   - Podria ser utilitzat per formularis (com `ExpenseForm.tsx`) o missatges de confirmació.

---

