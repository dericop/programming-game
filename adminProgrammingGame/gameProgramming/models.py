from __future__ import unicode_literals

from django.db import models


class Game(models.Model):
	name = models.CharField(max_length = 100)
	description = models.TextField(max_length = 200)

class Level(models.Model):
	game = models.ForeignKey(
		Game, 
		models.SET_NULL,
		blank = True,
		null = True,
	)

	name = models.CharField(max_length = 100)
	description = models.TextField(max_length = 200)
	order = models.IntegerField()
	instruction = models.TextField(max_length = 500)
	gameMap = models.TextField(max_length = 500)
	player = models.CharField(max_length = 200)
	target = models.CharField(max_length = 200)
	
	nextLevel = models.ForeignKey(
		"self", 
		models.SET_NULL,
		blank = True,
		null = True,
	)

	def __str__(self):
		return '%s. %s' % (self.id, self.name)

class control(models.Model):
	name = models.CharField(max_length = 30)
	level = models.ForeignKey(
		Level,
		models.SET_NULL,
		blank = True,
		null = True,
	)
	def __str__(self):
		return '%s %s' % (self.level, self.name)

class FeedBack(models.Model):
	level = models.ForeignKey(
		Level, 
		models.SET_NULL,
		blank = True,
		null = True,
	)
	description = models.TextField(max_length = 200)
	order = models.IntegerField()
