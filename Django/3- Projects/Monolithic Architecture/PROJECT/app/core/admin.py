from django.contrib import admin

# Register your models here.

class CustomUserAdmin(UserAdmin):
	add_fieldsets = (
		(None, {
			'classes': ('wide'),
			'fields': ('username', 'email', 'first_name', 'last_name', 'password1', 'password2', 'city', 'state', 'address', 'phone', 'is_staff', 'is_active')}
		)
	)

	