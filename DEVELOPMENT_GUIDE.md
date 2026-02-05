# Metics Mobile - Development Guide

## Table of Contents
1. [Design Language](#design-language)
2. [API Handling](#api-handling)
3. [Error Handling](#error-handling)
4. [Component Patterns](#component-patterns)
5. [Navigation](#navigation)
6. [State Management](#state-management)
7. [Code Style Guidelines](#code-style-guidelines)

---

## Design Language

### Theme System

The application uses a centralized theme system located in `src/theme/`.

#### Color Palette

```typescript
// Primary Colors
colors.primary[300] - Light blue
colors.primary[500] - Main brand blue
colors.primary[600] - Dark blue (for active states)
colors.primary[700] - Darker blue

// Semantic Colors
colors.semantic.success - Green (for suppliers, positive actions)
colors.semantic.error - Red (for errors, destructive actions)
colors.semantic.warning - Orange (for warnings)
colors.semantic.info - Blue (for informational content)

// Neutral Colors
colors.neutral.white - Pure white
colors.neutral.background - Light gray background
colors.neutral.surface.default - Card/surface background
colors.neutral.surface.sunken - Slightly darker surface
colors.neutral.text.primary - Main text color
colors.neutral.text.secondary - Secondary text
colors.neutral.text.tertiary - Muted text
colors.neutral.border.default - Border color
```

#### Typography

```typescript
// Heading Styles
typography.styles.h1 - Page titles
typography.styles.h2 - Section titles
typography.styles.h3 - Subsection titles
typography.styles.h4 - Card titles

// Body Styles
typography.styles.body - Regular body text
typography.styles.label - Form labels, button text
typography.styles.labelSmall - Small labels, captions
```

#### Spacing

```typescript
spacing.xs   // 4px
spacing.sm   // 8px
spacing.md   // 12px
spacing.lg   // 16px
spacing.xl   // 24px
spacing['2xl'] // 32px
spacing['3xl'] // 48px
```

#### Border Radius

```typescript
borderRadius.sm    // 4px - Small elements
borderRadius.base  // 8px - Standard cards, buttons
borderRadius.lg    // 12px - Large cards
borderRadius.full  // 9999px - Pills, avatars
```

#### Shadows

```typescript
shadows.sm  // Subtle shadow for cards
shadows.md  // Medium shadow for elevated elements
shadows.lg  // Strong shadow for modals, drawers
```

### Design Principles

1. **Consistency**: Always use theme values instead of hardcoded colors/spacing
2. **Hierarchy**: Use typography and spacing to create clear visual hierarchy
3. **Accessibility**: Maintain proper contrast ratios (WCAG AA minimum)
4. **Feedback**: Provide visual feedback for all user interactions
5. **Clarity**: Use clear, descriptive labels and error messages

### Component Design Patterns

#### Cards
```typescript
// Standard card structure
<View style={styles.card}>
  <Text style={styles.cardTitle}>Title</Text>
  <Text style={styles.cardContent}>Content</Text>
</View>

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.surface.default,
    borderRadius: borderRadius.base,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral.border.default,
    ...shadows.sm,
  },
});
```

#### Buttons
```typescript
// Use GradientButton component for primary actions
<GradientButton
  label="Submit"
  onPress={handleSubmit}
  loading={isLoading}
/>

// Use outline variant for secondary actions
<GradientButton
  label="Cancel"
  onPress={handleCancel}
  variant="outline"
/>
```

#### Input Fields
```typescript
// Use react-native-paper TextInput with outlined mode
<TextInput
  label="Field Label *"
  value={value}
  onChangeText={setValue}
  mode="outlined"
  style={styles.input}
/>
```

---

## API Handling

### API Hook Structure

All API calls use React Query hooks following this pattern:

#### Location
- Place hooks in `src/api/[domain]/use[Feature].ts`
- Example: `src/api/auctions/useAuction.ts`

#### Basic Query Hook Pattern

```typescript
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { YourType } from '../../types/yourType';

export const useYourFeature = (id?: string) => {
  const api = useApi();

  return useQuery<YourType>({
    queryKey: ['your-feature', id],
    queryFn: async () => {
      const response = await api.get(`/your-endpoint/${id}/`);
      return response.data;
    },
    enabled: !!id, // Only run if id exists
  });
};
```

#### Mutation Hook Pattern

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';

export const useCreateItem = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateItemData) => {
      const response = await api.post('/items/', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
```

#### Hook Usage in Components

```typescript
const MyComponent = () => {
  const { data, isPending, isError, refetch } = useYourFeature(id);
  const { mutate, isPending: isSaving } = useCreateItem();

  const handleSubmit = () => {
    mutate(formData, {
      onSuccess: (data) => {
        console.log('Success:', data);
        // Handle success
      },
      onError: (error) => {
        console.error('Error:', error);
        // Handle error
      },
    });
  };

  if (isPending) return <ActivityIndicator />;
  if (isError) return <ErrorView onRetry={refetch} />;

  return <YourUI data={data} />;
};
```

### API Best Practices

1. **Query Keys**: Use descriptive, hierarchical query keys
   ```typescript
   ['users'] // All users
   ['users', userId] // Specific user
   ['users', userId, 'posts'] // User's posts
   ```

2. **Error Handling**: Always handle errors in mutations
   ```typescript
   mutate(data, {
     onError: (error: any) => {
       console.error('API Error:', error);
       console.error('Response:', error.response?.data);
       console.error('Status:', error.response?.status);
     },
   });
   ```

3. **Loading States**: Show loading indicators during async operations
   ```typescript
   {isPending && <ActivityIndicator />}
   {!isPending && data && <YourContent />}
   ```

4. **Optimistic Updates**: For better UX, update UI before API response
   ```typescript
   onMutate: async (newData) => {
     await queryClient.cancelQueries({ queryKey: ['items'] });
     const previousData = queryClient.getQueryData(['items']);
     queryClient.setQueryData(['items'], (old) => [...old, newData]);
     return { previousData };
   },
   onError: (err, newData, context) => {
     queryClient.setQueryData(['items'], context.previousData);
   },
   ```

5. **Cache Invalidation**: Invalidate queries after mutations
   ```typescript
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['items'] });
     queryClient.invalidateQueries({ queryKey: ['item-details'] });
   },
   ```

---

## Error Handling

### Error Handling Strategy

#### 1. API Error Handling

```typescript
// In API hooks
const { mutate } = useMutation({
  mutationFn: async (data) => {
    try {
      const response = await api.post('/endpoint/', data);
      return response.data;
    } catch (error: any) {
      // Log detailed error information
      console.error('API Error:', error);
      console.error('Error Response:', error.response?.data);
      console.error('Error Status:', error.response?.status);
      console.error('Error Headers:', error.response?.headers);
      
      // Re-throw to let React Query handle it
      throw error;
    }
  },
  onError: (error: any) => {
    // Handle specific error codes
    if (error.response?.status === 400) {
      // Validation error
      setValidationError(error.response.data);
    } else if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      navigation.replace('Login');
    } else if (error.response?.status === 403) {
      // Forbidden
      showErrorDialog('You do not have permission to perform this action');
    } else if (error.response?.status >= 500) {
      // Server error
      showErrorDialog('Server error. Please try again later.');
    } else {
      // Generic error
      showErrorDialog('An error occurred. Please try again.');
    }
  },
});
```

#### 2. Component Error Boundaries

```typescript
// Wrap screens with ErrorBoundary
import { ErrorBoundary } from '../../components/ErrorBoundary';

const MyScreen = () => {
  return (
    <ErrorBoundary name="MyScreen">
      <YourContent />
    </ErrorBoundary>
  );
};
```

#### 3. User-Facing Error Messages

```typescript
// Use CustomDialog for error messages
const [showErrorDialog, setShowErrorDialog] = useState(false);
const [errorMessage, setErrorMessage] = useState('');

<CustomDialog
  visible={showErrorDialog}
  title="Error"
  message={errorMessage}
  onDismiss={() => setShowErrorDialog(false)}
  confirmText="OK"
  isDestructive
/>
```

#### 4. Validation Errors

```typescript
// Client-side validation before API call
const handleSubmit = () => {
  // Validate required fields
  if (!name.trim()) {
    setValidationMessage('Name is required');
    setShowValidationDialog(true);
    return;
  }
  
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    setValidationMessage('Please enter a valid email');
    setShowValidationDialog(true);
    return;
  }
  
  // Proceed with API call
  mutate(formData);
};
```

#### 5. Network Error Handling

```typescript
// Handle network errors specifically
onError: (error: any) => {
  if (error.code === 'ERR_NETWORK' || !error.response) {
    setErrorMessage('Network error. Please check your connection.');
  } else if (error.code === 'ECONNABORTED') {
    setErrorMessage('Request timeout. Please try again.');
  } else {
    setErrorMessage('An error occurred. Please try again.');
  }
  setShowErrorDialog(true);
},
```

### Error Message Guidelines

1. **Be Specific**: Tell users exactly what went wrong
   - ❌ "Error occurred"
   - ✅ "Failed to save product. Please check all required fields."

2. **Be Helpful**: Provide actionable guidance
   - ❌ "Invalid input"
   - ✅ "Email address must be in format: user@example.com"

3. **Be Friendly**: Use conversational tone
   - ❌ "Operation failed with code 500"
   - ✅ "We're having trouble connecting. Please try again in a moment."

4. **Provide Recovery**: Offer ways to fix the issue
   - Include "Retry" buttons
   - Suggest alternative actions
   - Link to help/support if needed

---

## Component Patterns

### Screen Structure

```typescript
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { Text, Icon, ActivityIndicator } from 'react-native-paper';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const MyScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  
  const { data, isPending, isError, refetch } = useMyData();

  if (isPending) return <LoadingView />;
  if (isError) return <ErrorView onRetry={refetch} />;

  return (
    <ErrorBoundary name="MyScreen">
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.surface.default} />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon source="arrow-left" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Screen Title</Text>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {/* Your content here */}
          </View>
        </ScrollView>

        {/* Footer (if needed) */}
        <View style={styles.footer}>
          <GradientButton label="Action" onPress={handleAction} />
        </View>
      </View>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.surface.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border.default,
  },
  headerTitle: {
    ...typography.styles.h4,
    marginLeft: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border.default,
  },
});

export default MyScreen;
```

### Reusable Component Pattern

```typescript
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

interface MyComponentProps {
  title: string;
  value: string | number;
  onPress?: () => void;
  accentColor?: string;
}

export const MyComponent = ({ 
  title, 
  value, 
  onPress,
  accentColor = colors.primary[500]
}: MyComponentProps) => {
  const Content = () => (
    <View style={styles.container}>
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Content />
      </TouchableOpacity>
    );
  }

  return <Content />;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.surface.default,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.neutral.border.default,
    overflow: 'hidden',
    ...shadows.sm,
  },
  accent: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  title: {
    ...typography.styles.labelSmall,
    color: colors.neutral.text.secondary,
  },
  value: {
    ...typography.styles.h3,
    color: colors.neutral.text.primary,
  },
});
```

---

## Navigation

### Navigation Structure

```
App.tsx (Stack Navigator)
├── Splash
├── Login
├── ForgotPassword
├── OTP
├── EnterNewPassword
├── BuyerTabs (Bottom Tab Navigator)
│   ├── BuyerDashboard
│   ├── BuyerRfqHistory
│   ├── BuyerPurchaseOrder
│   └── Settings
├── SupplierTabs (Bottom Tab Navigator)
│   ├── SupplierDashboard
│   ├── SupplierProducts
│   ├── SupplierRequestHistory
│   ├── SupplierPurchaseOrder
│   ├── SupplierClients
│   └── Settings
└── Detail Screens (Stack)
    ├── SupplierRequestDetails
    ├── SupplierClientDetails
    ├── BuyerRfqDetails
    └── etc.
```

### Navigation Best Practices

1. **Type Safety**: Define navigation types
   ```typescript
   // src/types/common.ts
   export type RootStackParamList = {
     Login: undefined;
     SupplierDashboard: undefined;
     SupplierClientDetails: { clientId: string };
     // ... other screens
   };

   export type CustomNavigationProp = NavigationProp<RootStackParamList>;
   ```

2. **Navigation Usage**
   ```typescript
   const navigation = useNavigation<CustomNavigationProp>();
   
   // Navigate to screen
   navigation.navigate('SupplierClientDetails', { clientId: '123' });
   
   // Go back
   navigation.goBack();
   
   // Replace (no back)
   navigation.replace('Login');
   ```

3. **Route Parameters**
   ```typescript
   type ScreenRouteProp = RouteProp<RootStackParamList, 'SupplierClientDetails'>;
   
   const route = useRoute<ScreenRouteProp>();
   const { clientId } = route.params;
   ```

---

## State Management

### Local State (useState)

Use for component-specific state:
```typescript
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });
```

### Server State (React Query)

Use for API data:
```typescript
const { data, isPending, refetch } = useMyData();
```

### Form State

```typescript
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [errors, setErrors] = useState<Record<string, string>>({});

const validateForm = () => {
  const newErrors: Record<string, string> = {};
  
  if (!name.trim()) newErrors.name = 'Name is required';
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    newErrors.email = 'Invalid email format';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = () => {
  if (!validateForm()) return;
  
  mutate({ name, email });
};
```

---

## Code Style Guidelines

### Naming Conventions

1. **Components**: PascalCase
   ```typescript
   const MyComponent = () => { ... };
   export default MyComponent;
   ```

2. **Hooks**: camelCase with 'use' prefix
   ```typescript
   const useMyHook = () => { ... };
   ```

3. **Constants**: UPPER_SNAKE_CASE
   ```typescript
   const API_BASE_URL = 'https://api.example.com';
   ```

4. **Variables/Functions**: camelCase
   ```typescript
   const myVariable = 'value';
   const handleClick = () => { ... };
   ```

### File Organization

```
src/
├── api/              # API hooks
│   ├── auctions/
│   ├── clients/
│   └── products/
├── components/       # Reusable components
├── hooks/           # Custom hooks
├── navigation/      # Navigation configuration
├── screens/         # Screen components
│   ├── Buyer/
│   └── Supplier/
├── theme/           # Theme configuration
├── types/           # TypeScript types
└── utils/           # Utility functions
```

### Import Order

```typescript
// 1. React/React Native
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Third-party libraries
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-paper';

// 3. API hooks
import useMyData from '../../api/myData/useMyData';

// 4. Components
import { MyComponent } from '../../components/MyComponent';

// 5. Types
import { MyType } from '../../types/myType';

// 6. Theme
import { colors, spacing, typography } from '../../theme';

// 7. Utils
import { formatDate } from '../../utils/helper';
```

### TypeScript Best Practices

1. **Define interfaces for props**
   ```typescript
   interface MyComponentProps {
     title: string;
     count: number;
     onPress?: () => void;
   }
   ```

2. **Use type inference when possible**
   ```typescript
   const [count, setCount] = useState(0); // Type inferred as number
   ```

3. **Avoid 'any' type**
   ```typescript
   // ❌ Bad
   const handleError = (error: any) => { ... };
   
   // ✅ Good
   const handleError = (error: Error) => { ... };
   ```

4. **Use optional chaining**
   ```typescript
   const userName = user?.profile?.name ?? 'Guest';
   ```

### Comments

1. **Component documentation**
   ```typescript
   /**
    * Displays a card with client information
    * @param client - Client data object
    * @param onPress - Callback when card is pressed
    */
   export const ClientCard = ({ client, onPress }: ClientCardProps) => {
     // ...
   };
   ```

2. **Complex logic**
   ```typescript
   // Calculate total price including tax and discount
   const totalPrice = basePrice * (1 + taxRate) * (1 - discountRate);
   ```

3. **TODO comments**
   ```typescript
   // TODO: Add pagination support
   // FIXME: Handle edge case when user is null
   ```

---

## Testing Guidelines

### Unit Testing

```typescript
// MyComponent.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <MyComponent title="Test" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

---

## Performance Optimization

### 1. Memoization

```typescript
import { useMemo, useCallback } from 'react';

// Memoize expensive calculations
const filteredData = useMemo(() => {
  return data.filter(item => item.status === 'active');
}, [data]);

// Memoize callbacks
const handlePress = useCallback(() => {
  console.log('Pressed');
}, []);
```

### 2. List Optimization

```typescript
<FlatList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
  initialNumToRender={10}
/>
```

### 3. Image Optimization

```typescript
<Image
  source={{ uri: imageUrl }}
  resizeMode="cover"
  style={styles.image}
  // Add placeholder
  defaultSource={require('./placeholder.png')}
/>
```

---

## Accessibility

### 1. Accessible Labels

```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Close dialog"
  accessibilityRole="button"
  onPress={handleClose}
>
  <Icon source="close" size={24} />
</TouchableOpacity>
```

### 2. Contrast Ratios

Ensure text meets WCAG AA standards:
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum

### 3. Touch Targets

Minimum touch target size: 44x44 points

```typescript
const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

---

## Security Best Practices

### 1. Secure Storage

```typescript
import EncryptedStorage from 'react-native-encrypted-storage';

// Store sensitive data
await EncryptedStorage.setItem('jwt-token', token);

// Retrieve
const token = await EncryptedStorage.getItem('jwt-token');

// Remove
await EncryptedStorage.removeItem('jwt-token');
```

### 2. API Security

```typescript
// Always use HTTPS
const API_BASE_URL = 'https://api.metics.com';

// Include auth token in headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Token ${token}`,
  },
});
```

### 3. Input Validation

```typescript
// Sanitize user input
const sanitizeInput = (input: string) => {
  return input.trim().replace(/[<>]/g, '');
};

// Validate before sending to API
if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
  throw new Error('Invalid email');
}
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All TypeScript errors resolved
- [ ] All console.log statements removed or converted to proper logging
- [ ] Environment variables configured
- [ ] API endpoints point to production
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Analytics configured
- [ ] Push notifications tested
- [ ] Deep linking tested
- [ ] App icons and splash screens updated
- [ ] Version numbers incremented

### Testing

- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing on iOS
- [ ] Manual testing on Android
- [ ] Testing on different screen sizes
- [ ] Testing with slow network
- [ ] Testing offline functionality

### Post-Deployment

- [ ] Monitor error rates
- [ ] Monitor API response times
- [ ] Monitor user feedback
- [ ] Monitor crash reports

---

## Resources

### Documentation
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Query](https://tanstack.com/query/latest)
- [React Native Paper](https://callstack.github.io/react-native-paper/)

### Tools
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)
- [Reactotron](https://github.com/infinitered/reactotron)

---

**Last Updated:** February 5, 2026  
**Version:** 1.0.0
