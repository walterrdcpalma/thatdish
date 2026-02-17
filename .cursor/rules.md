# Cursor Development Rules

## General Principles

1. Always follow industry best practices
2. Prefer simplicity over complexity
3. Be minimal in design and implementation
4. Avoid unnecessary abstractions
5. Build only what is needed

## Backend Architecture

1. Always follow Clean Architecture
2. Separate clearly: Domain, Application, Infrastructure, Presentation
3. Business logic must live only in the Domain/Application layers
4. Avoid leaking infrastructure concerns into core logic
5. Use dependency inversion

## Frontend Architecture

Use Feature-Based Architecture from the beginning.

Structure must follow:

```
src/
  features/
    <feature-name>/
      screens/
      components/
      hooks/
      services/
      types/
  shared/
    components/
    navigation/
    theme/
    utils/
```

- No global `/screens` folder
- No feature logic outside its feature folder
- Shared folder is only for reusable generic components
- Keep components small and focused
- Separate UI, state, and services
- Avoid complex patterns unless necessary
- Prefer simple and maintainable structure
- Do not introduce global state management unless strictly required

## Styling

1. All styling must be done using Tailwind CSS
2. Avoid custom CSS unless strictly necessary
3. Prefer utility-first approach

## Development Workflow

1. Always implement features in the smallest possible iteration
2. After each step, explain what was done
3. Ensure code is reviewable at every stage
4. Never implement large features in a single step
