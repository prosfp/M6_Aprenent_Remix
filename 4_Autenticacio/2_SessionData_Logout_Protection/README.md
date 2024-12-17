
# Dades de Sessió i Render Condicional

## Botó de Login si ja hi ha una sessió iniciada

Al "Front-End" no tenim informació sobre si hi ha una sessió iniciada o no. Per tant, no podem mostrar el botó de "Logout" si no hi ha una sessió iniciada. Però el que si que podem fer és anar a la ruta de `_marketing` i implementar un `Loader` que ens permeti comprovar si hi ha una sessió iniciada o no. 

Abans però, ens hem de crear una nova funció "auxiliar" a `auth.server.ts` que ens permeti comprovar si hi ha una sessió iniciada o no. 

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

Això és molt pràctic perquè si, per exemple, ara anem al component `MainHeader.tsx`, com que estem retornat `userId` a través del nostre loader, podem triar què mostrar de manera condicional. 

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

Si l'usuari fa un `POST` a `/logout`, eliminem la sessió de l'usuari i el redirigim a la pàgina principal. Però compte, hi ha un punt important. El `logout` es troba dins del `MainHeader.tsx` i aquest està present en moooooooltes rutes (pricing, homepage...) Per tant, no ho vull enviar a la pàgina activa sinó per exemple a una pàgina `logout.ts` que no tenim encara.

Aquesta pàgina no ha de tenir res visual, simplement executar lògica, per això és `.ts` i no `.tsx`. 

```tsx

```typescript
// Ruta de logout




