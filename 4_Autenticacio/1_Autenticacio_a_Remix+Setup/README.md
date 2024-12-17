
# Com funciona l'autenticació en una WEB-APP?

### **Introducció a l'autenticació en el projecte web**

L'autenticació és el mecanisme que permet **verificar la identitat d'un usuari** abans que aquest accedeixi a recursos o funcionalitats específiques de l'aplicació. En el teu projecte web amb **Remix**, implementarem un sistema d'autenticació basat en **credencials, cookies i sessions**.

---

### **1. Credencials de l'usuari**
- Les **credencials** són normalment:
  - **Email** o **nom d'usuari**.
  - **Contrasenya** (que es valida al servidor).
- Els usuaris introduiran aquestes credencials a través d'un **formulari de login o signup**.

---

### **2. Validació i creació de la sessió**
Quan un usuari envia les credencials:
1. El **servidor** valida les dades rebudes:
   - Comprova si l'email i la contrasenya són correctes (normalment amb una base de dades).
   - La contrasenya mai es guarda en text pla, sinó **hashada** amb una llibreria com **bcrypt**.
2. Si les credencials són vàlides, el servidor:
   - Crea una **sessió** per l'usuari.
   - Retorna una **cookie segura** que identifica l'usuari.

---

### **3. Cookies i Sessió**
- **Cookies**:
   - Una cookie s'envia des del servidor al navegador i es guarda localment.
   - Conté un identificador únic (token de sessió) que permet al servidor reconèixer l'usuari en futures peticions.
   - Es configura com **HTTPOnly** i **Secure** per evitar atacs (com XSS o CSRF).

- **Sessió**:
   - La sessió és una associació entre el **token de sessió** i la informació de l'usuari.
   - Es guarda al servidor (o a una base de dades com Redis) i es valida en cada petició.

---

### **4. Mecanisme amb Remix**
Amb **Remix**, el flux funciona així:
1. **Login**:
   - L'usuari envia les credencials amb un **`Form`** a un `action`.
   - El servidor valida les credencials i crea una cookie de sessió.
2. **Protecció de rutes**:
   - Els `loaders` comproven la cookie de sessió abans de carregar dades.
   - Si la cookie no és vàlida o no existeix, es redirigeix l'usuari a la pàgina de login.
3. **Logout**:
   - L'usuari pot tancar sessió esborrant la cookie del navegador.

---

### **5. Diagrama simplificat**
1. **Usuari introdueix email i contrasenya** → Formulari `POST` a Remix.
2. **Servidor valida credencials** → Si són vàlides, crea una cookie de sessió.
3. **Cookie s'envia al navegador** → S'utilitza per identificar l'usuari en peticions futures.
4. **Carregant dades protegides**:
   - Els `loaders` comproven si la cookie és vàlida.
5. **Logout** → El servidor elimina la cookie de sessió.

![autenticacio](./public/images/autenticacio.png)

---
# Setup del meu projecte per Autenticar

El que volem aconseguir és que només els usuaris autenticats puguin fer ús de l'aplicatiu. 

* Hem de ser capaços de crear usuaris
* Hem de ser capaços de fer login amb aquests usuaris

Anem a generar una taula d'usuari a Supabase (pots investigar com fer-ho amb Prisma i MongoDB si ho prefereixes).

## **Estructura de la base de dades a Supabase**

### **1. Taula `users`**

Crea una taula anomenada **`users`** per guardar les credencials d'usuari:

| Columna   | Tipus           | Propietats                       |
|-----------|-----------------|----------------------------------|
| `id`      | `uuid`          | Primary Key, Default `gen_random_uuid()` |
| `email`   | `text`          | Unique, Not Null                |
| `password`| `text`          | Not Null                        |

#### **SQL per crear la taula `users`:**
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL
);
```

---

### **2. Taula `expenses`**

Modifica o crea la taula anomenada **`expenses`** per guardar les despeses associades a cada usuari:

| Columna     | Tipus          | Propietats                           |
|-------------|----------------|--------------------------------------|
| `id`        | `uuid`         | Primary Key, Default `gen_random_uuid()` |
| `title`     | `text`         | Not Null                            |
| `amount`    | `float8`       | Not Null                            |
| `date`      | `timestamptz`  | Not Null                            |
| `date_added`| `timestamptz`  | Default `now()`                     |
| `user_id`   | `uuid`         | Foreign Key → `users(id)`           |

#### **SQL per crear la taula `expenses`:**
```sql
CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  amount float8 NOT NULL,
  date timestamptz NOT NULL,
  date_added timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
```

---

### **3. Relacions entre `users` i `expenses`**

- La columna `user_id` a la taula `expenses` és una **Foreign Key** que apunta a la columna `id` de la taula `users`.
- La propietat **`ON DELETE CASCADE`** assegura que si un usuari s'elimina, totes les seves despeses també s'eliminaran.

---

## Afegint Credencials al Servidor

Tenim els nostre `AuthForm` amb un `form` que envia les dades a la ruta on està injectat, `_marketing.auth.tsx`. 

Aquí ens torna a passar que tenim algunes validacions al client (html), poc fiables, i volem també dur a terme validacions a de backend de Remix. 

He modificat l'arxiu `validations.server.ts` per incorporar noves validacions pel cas d'usuaris i credencials. Pot copiar-lo i fer un cop d'ull. 

### **Explicació de les validacions**

#### Validació de despeses (validateExpenseInput):
- **title**: No pot ser buit i ha de tenir com a màxim 30 caràcters.
- **amount**: Ha de ser un número vàlid i major que 0.
- **date**: Ha de ser una data abans d'avui.

#### Validació de credencials (validateCredentials):
- **email**: Ha d'incloure un "@" per ser considerat vàlid.
- **password**: Ha de tenir una longitud mínima de 7 caràcters.

#### Gestió dels errors:
- Les validacions fallen si alguna condició no es compleix.
- Es llancen en forma d'objecte ValidationErrors que pot ser gestionat per mostrar missatges d'error a l'usuari.

---

Vale, ara sí a la lògica de l'`Action` podem començar a fer ús d'aquestes validacions.

```typescript
// _marketing.auth.tsx
// ...
  // Validacions
  try {
    validateCredentials({ email, password });
  } catch (error) {
    return error;
  }
  // ...
```
Recorda que si retornem "data" en un `Action` de Remix, aquesta la podem recuperar a través de `useActionData`. 

I al nostre `AuthForm` podem mostrar els errors que ens retorni el servidor. 

```tsx
// AuthForm.tsx
//..
import { ValidationErrors } from "../../types/validations.server";
//...
function AuthForm() {
  //...
  const validationErrors = useActionData<ValidationErrors>();
  //...
  {validationErrors && (
    <div className="text-red-500 text-sm mt-2">
      {Object.values(validationErrors).map((error) => (
        <div key={error}>{error}</div>
      ))}
    </div>
  )}
  //...
```

Això és com ja havíem fet  l'`ExpenseForm`. Pots provar si funciona canviant a l'inspector del navegador les validacions de `email` o `password` per veure com es mostren els errors.


### Creant un usuari

Començarem afegint un arxiu específic sota la carpeta `/data` per a la gestió d'autenticacions d'usuari. 

Crea un arxiu anomenat `auth.server.ts` i començarem creant la funció `signup` per fer la petició a la base de dades de Supabase per crear un usuari. 

```typescript
// auth.server.ts
import supabase from "../utils/supabaseClient";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

interface SignupInput {
  email: string;
  password: string;
}

export async function signUpUser({ email, password }: SignupInput) {
  // 1. Comprovar si l'usuari ja existeix a la taula 'users'
  const { data: user, error: findError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();
}
```

Podem encara afinar una mica més, tornant un error més precís si l'usuari ja existeix:

```typescript
// auth.server.ts
export async function signUpUser({ email, password }: SignupInput) {
  // 1. Comprovar si l'usuari ja existeix a la taula 'users'
  const { data: existingUser, error: findError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (findError && findError.code !== "PGRST116") {
    // Error inesperat en la cerca (excloem "no rows found")
    throw new Error("Error checking user existence.");
  }

  if (existingUser) {
    // Si ja existeix un usuari, llença un error 422
    const error = new Error("This email is already registered. Please log in.");
    (error as any).status = 422;
    throw error;
  }
}
```

Un cop validat que l'usuari no existeix, podem crear-lo però COMPTE! No volem passar la constrasenya en text pla i emmagatzemar-la visible per tothom.

Farem un hash de la contrasenya abans de guardar-la a la base de dades.  Per això podem instal·lar la llibreria `bcrypt`:

```bash
npm install bcrypt
```

Ara ja sí podem crear l'usuari a la base de dades:


```typescript
// auth.server.ts
export async function signUpUser({ email, password }: SignupInput) {
  // 1. Comprovar si l'usuari ja existeix a la taula 'users'
  const { data: existingUser, error: findError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (findError && findError.code !== "PGRST116") {
    // Error inesperat en la cerca (excloem "no rows found")
    throw new Error("Error checking user existence.");
  }

  if (existingUser) {
    // Si ja existeix un usuari, llença un error 422
    const error = new Error("This email is already registered. Please log in.");
    (error as any).status = 422;
    throw error;
  }

  // 2. Hash de la contrasenya
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Inserir el nou usuari a la taula 'users'
  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert([{ email, password: hashedPassword }])
    .select("id, email")
    .single();

  if (insertError) {
    throw new Error(`Failed to create user: ${insertError.message}`);
  }

  // 4. Retornar la informació del nou usuari
  return newUser;
}
```

Ara ja tenim la funció `signUpUser` i podem tornar a la nostra lògica de `_marketing.auth.tsx` per cridar-la quan es faci un signup.

```typescript
  // Gestió amb les dades

  if (authMode === "login") {
    // Autenticació (login)
  } else {
    // Creació d'usuari (signup)
    signup({ email, password });
    return redirect("/expenses");
  }
```
Si proves a fer un signup amb un usuari que no existeixi, hauria de crear-se a la base de dades. Prova-ho!

> Nota: Estem creant usuaris de moment, NO sessions ara per ara!


