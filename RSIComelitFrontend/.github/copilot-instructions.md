# RSI Comelit Frontend - Copilot Instructions

## Project Overview
This is an Angular 20.x application using CoreUI framework with Material Design components for a social enterprise platform. Key features include user management, absence tracking, chat/messaging, and social feeds.

## Architecture Patterns

### Component Structure
- **Standalone Components**: All components use `standalone: true` with explicit imports
- **Material Design**: Heavy use of Angular Material with custom theming
- **Dialog Pattern**: Use `ConfirmationDialogComponent` for user confirmations with typed data interfaces
- **Service Layer**: Services in `src/app/shared/service/` handle API communication

### Key Conventions

#### Dialog Usage
```typescript
// Enhanced confirmation dialogs with typed data
const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  width: '450px',
  data: {
    title: 'Action Title',
    message: 'Detailed message',
    confirmText: 'Action',
    cancelText: 'Cancel',
    type: 'danger' | 'warning' | 'info'
  }
});
```

#### Data Loading Pattern
```typescript
// Standard pattern in list components
loadUsers(): void {
  this.loading = true;
  this.userService.getUsers(this.paginationParams).subscribe({
    next: (response) => {
      this.dataSource.data = response.users;
      this.totalItems = response.total; // Note: Check API response structure
      this.loading = false;
    },
    error: (error) => {
      this.handleError(error, 'Error loading users');
    }
  });
}
```

#### Pagination Implementation
- Uses `MatPaginator` with server-side pagination
- `PaginationParams` interface for consistent API calls
- Page index is 0-based in UI, 1-based for API calls

### File Organization
- `src/app/component/` - Reusable UI components
- `src/app/user/` - User-specific features  
- `src/app/shared/model/` - TypeScript interfaces
- `src/app/shared/service/` - API services
- `src/scss/` - Global styles and theme customization

### Styling Approach
- CoreUI base theme with custom SCSS in `src/scss/_custom.scss`
- Material components with custom CSS overrides
- Gradient backgrounds and modern UI patterns
- Animation effects for enhanced UX (pulse, hover transforms)

### Development Commands
- `npm start` - Development server with auto-open
- `npm run build` - Production build
- `npm test` - Unit tests with Karma/Jasmine

### Common Patterns
- **Error Handling**: Use MatSnackBar with consistent styling (`success-snackbar`, `error-snackbar`)
- **Loading States**: Boolean flags with MatProgressSpinner
- **Form Validation**: Reactive forms with Angular Material form controls
- **Responsive Design**: Material breakpoints with flexible layouts

### Integration Points
- JWT authentication with `@auth0/angular-jwt`
- WebSocket communication via `@stomp/stompjs`
- Chart.js integration through CoreUI
- Moment.js for date handling
- PrimeNG components alongside Material Design
