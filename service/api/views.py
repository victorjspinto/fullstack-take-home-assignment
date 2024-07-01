from rest_framework.decorators import action
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from rest_framework import status, permissions, viewsets

from . import models, serializers
from .serializers import PlaylistSerializer, PlaylistDetailSerializer

class TrackViewSet(viewsets.ModelViewSet):
    queryset = models.Track.objects.all()
    serializer_class = serializers.TrackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = models.Playlist.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return PlaylistDetailSerializer
        return PlaylistSerializer

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'], url_path='tracks')
    def add_track(self, request, *args, **kwargs):
        playlist = self.get_object()
        track_id = request.data.get('track_id')
        track = get_object_or_404(models.Track, id=track_id)
        playlist.tracks.add(track)
        playlist.save()
        return Response({'message': 'Track added successfully'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'], url_path='tracks/(?P<track_id>[a-zA-Z0-9]+)')
    def remove_track(self, request, *args, **kwargs):
        playlist = self.get_object()
        track_id = kwargs.get('track_id')
        track = get_object_or_404(models.Track, id=track_id)
        if track in playlist.tracks.all():
            playlist.tracks.remove(track)
            playlist.save()
            return Response({'message': 'Track removed successfully'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'Track not in playlist'}, status=status.HTTP_404_NOT_FOUND)