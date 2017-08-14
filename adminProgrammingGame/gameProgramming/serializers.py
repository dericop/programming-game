from rest_framework import serializers
from gameProgramming.models import *

class GameSerializer(serializers.ModelSerializer):

	class Meta:
		model = Game
		fields = ('id', 'name', 'description')
	

	"""def create(self, validated_data):
		return Game.objects.create(**validated_data)

	def update(self, instance, validated_data):
		instance.name = validated_data.get('name', instance.name)
		instance.description = validated_data.get('description', instance.description)
		instance.save()
		return instance"""
	