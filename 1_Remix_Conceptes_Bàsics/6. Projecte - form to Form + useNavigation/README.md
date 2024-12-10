Remix incorpora **Form** que permet enviar dades a través de fetch i actualitzar la pàgina sense recarregar-la. Aquesta funcionalitat és molt útil per a formularis, ja que permet enviar dades sense perdre l'estat de la pàgina.

https://remix.run/docs/en/main/components/form

Per treballar en un model Single Page prioritzarem l'ús de Form en comptes de l'etiqueta `<form>` de HTML. Això ens permetrà gestionar les dades de manera més eficient i sense recarregar la pàgina.

> **Nota Important:** Estic experimentant problemes amb la versió DEV de Vite amb la recàrrega de pàgina. Això pot ser degut a la configuració de Vite o a un problema amb Remix. Per tant, de moment executeu `npm run build` i `npm run preview` per veure els canvis.

**Principals diferències entre `<Form>` de Remix i `<form>` d'HTML:**

1. **Submissió de formularis millorada:**
   - El component `<Form>` de Remix utilitza `fetch` per enviar dades als "actions", la qual cosa permet una experiència d'usuari més fluida en comparació amb la submissió tradicional de formularis HTML que provoca un refresc complet de la pàgina. 

2. **Gestió d'estats de càrrega:**
   - Amb `<Form>`, es poden activar estats pendents mitjançant el hook `useNavigation`, permetent la creació d'interfícies d'usuari més avançades que informen l'usuari sobre l'estat de la submissió del formulari. 

3. **Integració amb el sistema de rutes de Remix:**
   - En utilitzar `<Form>`, la submissió es gestiona dins del sistema de rutes de Remix, facilitant la manipulació de dades i la navegació sense necessitat de configurar manejadors d'esdeveniments personalitzats com `onChange` o `onSubmit`. 

4. **Millora progressiva:**
   - El component `<Form>` està dissenyat per funcionar fins i tot si JavaScript està desactivat al navegador, assegurant que la funcionalitat bàsica del formulari es mantingui. 

**Exemple d'ús del component `<Form>` de Remix:**

```jsx
import { Form } from "@remix-run/react";

export default function ContactForm() {
  return (
    <Form method="post" action="/contact/submit">
      <label>
        Nom:
        <input type="text" name="nom" required />
      </label>
      <button type="submit">Enviar</button>
    </Form>
  );
}
```

### **Què és `useNavigation`?**

`useNavigation` és un hook proporcionat per Remix que permet accedir a l'estat actual de la navegació dins d'una aplicació Remix. És especialment útil per obtenir informació sobre l'estat d'una acció de navegació, com ara si una pàgina s'està carregant o si un formulari s'està enviant.

Aquest hook retorna un objecte amb informació sobre l'estat de navegació, incloent-hi:
- **`state`**: Indica l'estat actual de la navegació (`idle`, `loading`, `submitting`).
- **`location`**: Proporciona detalls sobre la ubicació de la navegació actual.

---

### **Com ajuda en aquest cas concret?**

En aquest exemple, `useNavigation` s'utilitza per:
1. **Detectar si el formulari està en procés de submissió (`submitting`).**
   - Això es fa comprovant si `navigation.state === "submitting"`.

2. **Desactivar el botó de submissió mentre el formulari està enviant dades.**
   - Això evita múltiples enviaments del mateix formulari per part de l'usuari.

3. **Mostrar un indicador visual (`Adding Note...`) per informar l'usuari que el formulari s'està processant.**
   - Això millora l'experiència de l'usuari proporcionant feedback visual.

---

### **Com funciona aquest codi?**

1. **Accés a `useNavigation`:**
   ```tsx
   const navigation = useNavigation();
   ```

2. **Comprovació de l'estat del formulari:**
   ```tsx
   const isSubmitting = navigation.state === "submitting";
   ```

3. **Desactivació del botó i canvi de text:**
   ```tsx
   <button
     disabled={isSubmitting}
     className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-900"
   >
     {isSubmitting ? "Adding Note..." : "Add Note"}
   </button>
   ```

---

### **Flux del procés:**
1. Quan l'usuari fa clic al botó "Add Note", el formulari s'envia utilitzant el mètode `post` de Remix.
2. En aquest moment, l'estat de navegació canvia a `"submitting"`.
3. El botó es desactiva i el text es modifica a "Adding Note...".
4. Un cop la submissió finalitza, l'estat torna a `"idle"`, reactivant el botó i tornant a mostrar "Add Note".

---

### **Exemple ampliat:**

```tsx
function NewNote(): JSX.Element {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form
      method="post"
      id="note-form"
      className="max-w-xl my-12 mx-auto p-8 rounded-lg bg-primary-100 shadow-md text-center"
    >
      <p className="mb-4">
        <label htmlFor="title" className="block text-white font-semibold mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full p-2 border border-green-300 rounded-md"
        />
      </p>
      <p className="mb-4">
        <label
          htmlFor="content"
          className="block text-white-700 font-semibold mb-2"
        >
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={5}
          required
          className="w-full p-2 border border-green-300 rounded-md"
        />
      </p>
      <div className="form-actions">
        <button
          disabled={isSubmitting}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-900"
        >
          {isSubmitting ? "Adding Note..." : "Add Note"}
        </button>
      </div>
    </Form>
  );
}
```

---

### **Avantatges de `useNavigation`:**
1. **Millora l'Experiència d'Usuari (UX):** Feedback immediat sobre l'estat del formulari.
2. **Evita Errors:** Es prevé que l'usuari enviï el formulari més d'una vegada.
3. **Simplicitat:** És fàcil d'implementar i utilitzar amb el sistema de formularis de Remix.


Com que estàs executant tot en local, no podràs veure l'efecte real ja que tot succeeix molt ràpidament. Afegeix un timeout a través d'uns Promise des de l'Action a notes.tsx:

```tsx
// Action: Gestiona l'enviament de noves notes
export const action = async ({ request }: ActionFunctionArgs) => {

// ... resta del codi 
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return redirect("/notes");
};
```
Ara hauries de poder veure l'estat de "Adding Note..." durant un segon abans de redirigir a la pàgina de notes.
