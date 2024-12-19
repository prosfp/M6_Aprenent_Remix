
# Dades de Sessió i Render Condicional

## Botó de Login si ja hi ha una sessió iniciada

Al "Front-End" no tenim informació sobre si hi ha una sessió iniciada o no. Per mostrar el botó de "Logout" en funció d'això, el que podem fer és anar a la ruta de `_marketing` i implementar un `Loader` que ens permeti comprovar si hi ha una sessió iniciada o no.

Abans, però, ens hem de crear una nova funció "auxiliar" a `auth.server.ts` que ens permeti comprovar si hi ha una sessió iniciada o no.

```typescript
// Funció per obtenir la sessió de l'usuari
export async function getUserFromSession(request: Request) {
  // En aquest cas li passem la cookie de la petició
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  // Obtenim l'identificador de l'usuari de la sessió
  const userId = session.get("userId") as string;

  if (!userId) {
    return null;
  }

  return userId;
}
```

I, ara sí, a la ruta `_marketing` podem comprovar si hi ha una sessió iniciada o no.

```tsx
export async function loader({ request }: LoaderFunctionArgs) {
  return await getUserFromSession(request);
}
```

Com que ho cridem des del layout de `marketing`, també serà efectiu a tots els components aniuats.

Això és molt pràctic perquè si, per exemple, ara anem al component `MainHeader.tsx`, com que estem retornant `userId` a través del nostre loader, podem triar què mostrar de manera condicional.

```tsx
  {userID ? (
        <form action="/logout" method="post">
              <button
                  type="submit"
                  className="rounded-lg bg-white px-4 py-2 text-blue-600 shadow-md transition-all duration-300 hover:bg-blue-100"
              >
                  Logout
              </button>
        </form>
  ) : (
        <Link
              to="/auth"
              className="rounded-lg bg-white px-4 py-2 text-blue-600 shadow-md transition-all duration-300 hover:bg-blue-100"
        >
              Login
        </Link>
  )}
```

## Logout

Ja hem afegit el nostre `Logout` al nostre `MainHeader.tsx`. Implementem la seva lògica.

Si l'usuari fa un `POST` a `/logout`, eliminem la sessió de l'usuari i el redirigim a la pàgina principal.

Fins ara, quan hem necessitat fer la lògica dels forms, al final ens anava bé redirigir a la ruta que estava activa. Però això no és el cas del navegador ja que aquest es pot trobar en diverses rutes (recorda que es tracta del `MainHeader.tsx`) com pricing, homepage...

Per tant, en realitat potser pot tenir més sentit enviar la petició a una pàgina on gestionar aquesta lògica particular, com per exemple `logout.ts`. Aquesta no l'hem creat encara.

Aquesta pàgina no ha de tenir res visual, no ha de renderitzar cap petició de tipus `GET`, simplement executar lògica, per això és `.ts` i no `.tsx`.

```typescript
// logout.ts
import type { ActionFunctionArgs } from "@remix-run/node";
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    throw Response.json({ message: "Method not allowed" }, { status: 405 });
    return {};
  }
}
```

Tenim la base amb una verificació de mètode. Anem a implementar la funció necessària per eliminar la sessió de l'usuari. Retornem al nostre arxiu `auth.server.ts` i creem la funció `destroyUserSession` que ens permeti eliminar la sessió de l'usuari.

```typescript
// auth.server.ts
// Funció per tancar la sessió de l'usuari
export async function destroyUserSession(request: Request) {
  // Obtenim la sessió actual
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  sessionStorage.destroySession(session);
}
```

En aquest cas recuperem la sessió de l'usuari a través de la cookie de la petició i l'eliminem amb la funció `destroySession`.

Però fixa't, com ho hem fet abans en el moment de crear la sessió d'usuari. Necessitem modificar la capçalera de la nostra petició a través del redirect.

```typescript
// Funció per tancar la sessió de l'usuari
export async function destroyUserSession(request: Request) {
 // Obtenim la sessió actual
 const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  // Eliminem la sessió de l'usuari
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
```
---
### Flux complet del logout

1. **Petició de logout**:
   - L'usuari fa una petició al servidor (normalment des d'un botó de "Logout").

2. **Obtenir la sessió activa**:
   - Amb `sessionStorage.getSession()`, es recupera la sessió basada en la cookie enviada pel navegador.

3. **Destrucció de la sessió**:
   - Amb `sessionStorage.destroySession()`, s'elimina tota la informació de la sessió i es genera una cookie buida.

4. **Redirecció de l'usuari**:
   - L'usuari és redirigit a la pàgina principal o qualsevol altra pàgina especificada.

---   

Si ara afegeixes la funció `destroyUserSession` a la teva pàgina `logout.ts`, ja hauries de poder tancar la sessió de l'usuari.

```typescript
// logout.ts
import type { ActionFunctionArgs } from "@remix-run/node";
import { destroyUserSession } from "../data/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  //console.log("logging out");

  if (request.method !== "POST") {
    throw Response.json({ message: "Method not allowed" }, { status: 405 });
  }
  return destroyUserSession(request);
}
```
Si ho proes, veuràs que quan fas clic al botó de "Logout", la sessió de l'usuari es tanca i es redirigeix a la pàgina principal.

Podràs veure que la cookie de sessió s'ha eliminat a través de les eines de desenvolupament del navegador (existeix la sessió, però no hi ha cap valor).

### Protegint Rutes

Segurament t'estaràs preguntant com evitar que els usuaris que no han iniciat sessió accedeixin a rutes protegides.

Per assegurar-nos d'això, podem fer servir els `loaders` de Remix ja que són els elements responsables de carregar les dades abans de renderitzar la pàgina.

Posem el cas d'`expenses`. Abans de fer res, el `loader` hauria de comprovar que l'usuari és vàlid. 

Per fer això ens farem encara una altra funció `auxiliar` a `auth.server.ts` que ens permeti comprovar si l'usuari és vàlid o no.

```typescript
export async function requireUserSession(request: Request) {
  const userId = await getUserFromSession(request);

  if (!userId) {
    // Si no hi ha cap identificador d'usuari, redirigim a la pàgina d'autenticació
    throw redirect("/auth?mode=login");
  }
}
```

Fixa't que fins ara havíem fet un `return` del `redirect` i que en aquest cas estem fent servir `throw`. 

En aquest cas, com que fem un throw del `redirect`, no serà l'`ErrorBoundaries` on arribi la petició, sinó que el que aconseguim és que és canceli aquesta funció i qualssevol altra s'hagi d'executar allà d'on l'estem cridant. 

En el cas d'`expenses`: 

```typescript
// expenses.tsx
// ...
export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);

  return await getExpenses();
}
```
Si l'usuari no ha iniciat sessió és limitarà a redirigir-lo a la pàgina d'autenticació i ja no durà a terme la resta de la funció.

Ara si proves a accedir a la pàgina d'`expenses`, o qualssevol "filla" (add, analysis, id...) sense haver iniciat sessió, veuràs que et redirigeix a la pàgina d'autenticació.

> **IMPORTANT**: Els `Loaders` que puguis tenir a altres rutes niuades, encara que siguin filles, SÍ QUE S'EXECUTARAN IGUALMENT. Compte amb això, perquè encara que no es renderitzin, sí que s'executen.

Per tant, és recomanable que facis la comprovació a totes les rutes on tinguis `loaders`. 

### Més rutes a protergir

#### Expenses Analysis

> **NOTA**: Hem modificat aquest arxiu amb algunes modificacions perquè pugui fer ús de les expenses reals. Ho teníem pendent. 

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);

  const expenses = await getExpenses(userId);

  if (!expenses || expenses.length === 0) {
    throw Response.json(
      { message: "Could not load expenses for the requested analysis." },
      {
        status: 404,
        statusText: "Expenses not found",
      },
    );
  }

  return Response.json(expenses); // Encapsulem la resposta amb json per ser explícits
}
```
#### Expenses RAW

```typescript
// expenses.raw.ts
import type { LoaderFunctionArgs } from "@remix-run/node";
import { requireUserSession } from "../data/auth.server";
import { getExpenses } from "../data/expenses.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);
  return getExpenses();
}
```

