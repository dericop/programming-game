from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from gameProgramming.models import *
from gameProgramming.serializers import *
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView

class GameListView(ListView):
	
	model = Game

	def get_context_data(self, **kwargs):
		context = super(GameListView, self).get_context_data(**kwargs)
		return context

class LevelDetailView(DetailView):

	model = Level

	def get_context(self, **kwargs):
		context = super(LevelDetailView, self).get_context_data(**kwargs)
		return context

class JSONResponse(HttpResponse):
	"""
	Renderiza contenido en JSON
	"""

	def __init__(self, data, **kwargs):
		content = JSONRenderer().render(data)
		kwargs['content_type'] = 'application/json'
		super(JSONResponse, self).__init__(content, **kwargs)

	@csrf_exempt
	def game_list(request):
		"""
		Lista todos los juegos o crea uno
		"""
		if request.method == 'GET':
			games = Game.objects.all()
			serializer = GameSerializer(games, many=True)
			return JSONResponse(serializer.data)

		elif request.method == 'POST':
			data = JSONParser().parse(request)
			serializer = GameSerializer(data=data)
			if serializer.is_valid():
				serializer.save()
				return JSONResponse(serializer.data, status=201)
			return JSONResponse(serializer.errors, status=400)

	@csrf_exempt
	def game_detail(request, pk):
		"""
		Retrieve, update or delete a game.
		"""
		try:
			game = Game.objects.get(pk=pk)
		except game.DoesNotExist:
			return HttpResponse(status=404)

		if request.method == 'GET':
			serializer = GameSerializer(game)
			return JSONResponse(serializer.data)

		elif request.method == 'PUT':
			data = JSONParser().parse(request)
			serializer = GameSerializer(game, data=data)
			if serializer.is_valid():
				serializer.save()
				return JSONResponse(serializer.data)
			return JSONResponse(serializer.errors, status=400)

		elif request.method == 'DELETE':
			game.delete()
			return HttpResponse(status=204)


			
