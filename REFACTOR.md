# Plan de Refactorización — CorchoAppFront

Estado: en progreso | Última revisión: 2026-04-19

---

## Por qué refactorizamos

El front está terminado visualmente. Antes de conectar la API, limpiamos el código para que:
- No haya lógica duplicada en varios archivos
- Cada archivo tenga una sola responsabilidad
- Conectar la API sea más fácil (un solo sitio donde cambiar las cosas)

---

## Patrones repetidos encontrados

### 1. `useTypewriter` + `Cursor`
**Duplicado en:** `NoteDetail.jsx` (líneas 74–100) y `UserProfile.jsx` (líneas 42–73). También en `Login.jsx`.
**Solución:** Extraer a `src/hooks/useTypewriter.js`
**Impacto:** Eliminar ~50 líneas duplicadas

---

### 2. Función `timeAgo()`
**Duplicado en:** `NoteDetail.jsx` (línea 66) y `UserProfile.jsx` (línea 80). Código idéntico.
**Solución:** Extraer a `src/utils/helpers.js`
**Impacto:** Eliminar ~7 líneas duplicadas, centralizar lógica de formato de fechas

---

### 3. Configuración de categorías (`CATEGORY_CONFIG` / `CATEGORY_COLORS`)
**Duplicado en:** `NoteDetail.jsx` tiene iconos + colores. `UserProfile.jsx` tiene solo colores. `NoteCard.jsx` tiene su propia versión.
**Solución:** Extraer a `src/utils/categories.js` con un único objeto de configuración
**Impacto:** Un único sitio para cambiar colores/iconos de categorías

---

### 4. Modal de confirmación de borrado (`DeleteConfirmModal`)
**Duplicado en:** `NoteDetail.jsx` (líneas 748–809) y `UserProfile.jsx` (líneas 514–570). Casi idéntico, solo cambia el texto.
**Solución:** Extraer a `src/components/DeleteConfirmModal.jsx` con props: `title`, `message`, `onConfirm`, `onCancel`
**Impacto:** ~60 líneas menos por archivo, corriges en un sitio para los dos

---

### 5. Botón "Volver" (`BackButton`)
**Duplicado en:** `NoteDetail.jsx` (líneas 240–254) y `UserProfile.jsx` (líneas 188–206). Código idéntico.
**Solución:** Extraer a `src/components/BackButton.jsx` con prop `onClick`
**Impacto:** ~15 líneas menos por archivo

---

### 6. Decoración de cinta/tape (`Tape`)
**Repetido en:** NoteDetail (nota principal, cada comentario, modal resolver, modal borrar), UserProfile (tarjeta principal), Login. Siempre el mismo div amarillo con las mismas medidas.
**Solución:** Extraer a `src/components/Tape.jsx` con props opcionales `width` y `rotate`
**Impacto:** El estilo del tape se define en un solo sitio

---

### 7. Avatar con inicial (`Avatar`)
**Repetido en:** NoteDetail (autor de nota, cada comentario, modal resolver), UserProfile (tarjeta), Community.
**Solución:** Extraer a `src/components/Avatar.jsx` con props: `name`, `size`, `color`
**Impacto:** Consistencia visual garantizada, un solo lugar para cambiar el estilo

---

### 8. Botones Guardar/Cancelar (`EditActions`)
**Repetido en:** `NoteDetail.jsx` (líneas 424–449) y `UserProfile.jsx` (líneas 390–406). Mismo estilo, misma lógica de disabled.
**Solución:** Extraer a `src/components/EditActions.jsx` con props: `onSave`, `onCancel`, `disabled`
**Impacto:** Estilo de botones consistente en todos los formularios de edición

---

### 9. Datos mock duplicados
**Problema:** `MOCK_NOTES` existe en `Dashboard.jsx` Y en `NoteDetail.jsx` — son versiones distintas del mismo dato.
**Solución:** Extraer a `src/mocks/data.js` con todos los datos centralizados
**Nota:** Esto desaparece cuando conectemos la API. Prioritad baja.

---

## Plan de ejecución — orden recomendado

| Orden | Qué | Tipo | Branch sugerida | Estado |
|---|---|---|---|---|
| 1 | `timeAgo` + `formatMemberSince` → `src/utils/helpers.js` | utility | `refactor/utils` | ✅ Hecho |
| 2 | `CATEGORY_CONFIG` → `src/utils/categories.js` | utility | `refactor/utils` | ✅ Hecho |
| 3 | `useTypewriter` + `Cursor` → `src/hooks/useTypewriter.jsx` | hook | `refactor/hooks` | ✅ Hecho |
| 4 | `<DeleteConfirmModal />` → `src/components/DeleteConfirmModal.jsx` | componente | `refactor/components` | 🔄 En progreso |
| 5 | `<Tape />` → `src/components/Tape.jsx` | componente | `refactor/components` | ⬜ Pendiente |
| 6 | `<Avatar />` → `src/components/Avatar.jsx` | componente | `refactor/components` | ⬜ Pendiente |
| 7 | `<BackButton />` → `src/components/BackButton.jsx` | componente | `refactor/components` | ⬜ Pendiente |
| 8 | `<EditActions />` → `src/components/EditActions.jsx` | componente | `refactor/components` | ⬜ Pendiente |
| 9 | Datos mock → `src/mocks/data.js` | datos | `refactor/mocks` | ⬜ Pendiente |

---

## Estructura final esperada

```
src/
├── hooks/
│   └── useTypewriter.js        ← (nuevo)
├── utils/
│   ├── helpers.js              ← timeAgo, formatMemberSince (nuevo)
│   └── categories.js           ← CATEGORY_CONFIG unificado (nuevo)
├── mocks/
│   └── data.js                 ← todos los MOCK_* centralizados (nuevo)
├── components/
│   ├── Avatar.jsx              ← (nuevo)
│   ├── BackButton.jsx          ← (nuevo)
│   ├── DeleteConfirmModal.jsx  ← (nuevo)
│   ├── EditActions.jsx         ← (nuevo)
│   ├── Tape.jsx                ← (nuevo)
│   ├── CategoryScrollableRow.jsx
│   ├── MenuBar.jsx
│   ├── NoteCard.jsx
│   └── SearchBar.jsx
└── pages/
    ├── Login.jsx
    ├── Dashboard.jsx
    ├── NoteDetail.jsx      → pasará de 831 a ~500 líneas
    ├── CreateNote.jsx
    ├── UserProfile.jsx     → pasará de 573 a ~350 líneas
    └── Community.jsx
```

---

## Reglas para la refactorización

1. **Una cosa a la vez** — un componente/hook por PR
2. **El resultado visual no cambia** — si algo se rompe, revertir
3. **Tú tocas el git** — Claude no hace commits ni branches
4. **Empezar por utilities** (sin JSX) antes que componentes (con JSX) — menos riesgo
