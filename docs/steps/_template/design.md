# Step N — Name

## Task
What is being built.

## Files to create
- `src/features/{feature}/screens/XxxScreen.tsx`
- `src/features/{feature}/hooks/useXxx.ts`
- ...

## ScreenWrapper config
- title:
- subtitle:
- form: false
- footer: none
- centered: false
- scrollable: true

## State approach
- Server data → TanStack Query: `useXxx()`
- Global UI → Zustand: `useXxxStore`
- Local → useState: which fields
- Forms → React Hook Form + Zod: schema shape

## Props drilling check
[ ] Max 2 levels confirmed. No Zustand needed beyond global stores.

## Navigation wiring
- Navigator: AppDrawer / HomeTabs / PostsStack
- Params: none / `{ id: string }`
- Register in: `src/app/navigation/types.ts`

## Libraries used
| Need | Library |
|---|---|
| Images | react-native-fast-image |
| ... | ... |

## Commit message
`feat(scope): description`
