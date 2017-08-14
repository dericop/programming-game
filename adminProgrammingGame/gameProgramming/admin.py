from django.contrib import admin
from gameProgramming.models import *

class GameAdmin(admin.ModelAdmin):
	pass

class LevelAdmin(admin.ModelAdmin):
	pass

class FeedBackAdmin(admin.ModelAdmin):
	pass

class ControlAdmin(admin.ModelAdmin):
	pass

admin.site.register(Game, GameAdmin)
admin.site.register(Level, LevelAdmin)
admin.site.register(FeedBack, FeedBackAdmin)
admin.site.register(control, ControlAdmin)
