from django.conf.urls import url

from .views import GameListView
from .views import LevelDetailView


urlpatterns = [
	url(r'^$', GameListView.as_view()),
	url(r'^(?P<pk>[-\w]+)/$', LevelDetailView.as_view(), name='level-detail'),
	#url(r'^games/$', views.game_list),
	#url(r'^games/(?P<pk>[0-9]+)/$', views.game_detail),
]