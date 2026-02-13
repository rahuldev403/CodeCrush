# Global Loading Indicator

The app now has a pixelated global loading indicator that can be used anywhere.

## Usage

Import the `useLoading` hook:

```jsx
import { useLoading } from "@/contexts/LoadingContext";

function MyComponent() {
  const { showLoading, hideLoading } = useLoading();

  const handleAction = async () => {
    showLoading("Processing...");
    try {
      await someAsyncAction();
    } finally {
      hideLoading();
    }
  };

  return <button onClick={handleAction}>Do Something</button>;
}
```

## Features

- **Pixelated Design**: Matches the bubblegum theme with hard-edged borders
- **Animated Spinner**: Spinning loader with ping effect
- **Custom Messages**: Pass any loading message
- **Backdrop Blur**: Prevents interaction while loading
- **z-50**: Always appears on top

## Components Available

### LoadingSpinner

Standalone spinner component:

```jsx
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Sizes: sm, md, lg, xl
<LoadingSpinner size="lg" />

// Full screen mode
<LoadingSpinner fullScreen />
```

### Global Loading Context

Managed through `LoadingProvider` in App.jsx:

```jsx
const { isLoading, showLoading, hideLoading } = useLoading();

// Show loading
showLoading("Fetching data...");

// Hide loading
hideLoading();
```
