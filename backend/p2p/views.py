from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Conversation, Message
from django.contrib.auth import get_user_model
import json

User = get_user_model()

def conversations(request):
    #if request.user.is_authenticated:
    if request.user:
        user_conversations = Conversation.objects.filter(participants=request.user)
        conversations_data = [
            {
                'id': convo.id,
                'participants': [user.username for user in convo.participants.exclude(id=request.user.id)]
            } for convo in user_conversations
        ]
        return render(request, 'p2p/conversations.html', {'conversations': conversations_data})
    else:
        return JsonResponse({'error': 'Unauthorized'}, status=403)

def conversation_detail(request, conversation_id):
    #if request.user.is_authenticated:
    if request.user:
        conversation = get_object_or_404(Conversation, id=conversation_id)
        if request.user not in conversation.participants.all():
            return JsonResponse({'error': 'Unauthorized'}, status=403)

        participants = conversation.participants.exclude(id=request.user.id)
        return render(request, 'p2p/conversation_detail.html', {
            'conversation': conversation,
            'other_participants': participants
        })
    else:
        return JsonResponse({'error': 'Unauthorized'}, status=403)

@csrf_exempt
def send_message(request, conversation_id):
    if request.method == 'POST' and request.user.is_authenticated:
        conversation = get_object_or_404(Conversation, id=conversation_id)
        if request.user not in conversation.participants.all():
            return JsonResponse({'error': 'Unauthorized'}, status=403)
        data = json.loads(request.body)
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=data['content']
        )
        return JsonResponse({'message': 'Message sent successfully', 'message_id': message.id})
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)
