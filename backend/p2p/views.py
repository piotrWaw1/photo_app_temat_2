import json
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Conversation, Message


@login_required
def get_messages(request, conversation_id):
    conversation = get_object_or_404(Conversation, id=conversation_id)
    if request.user not in conversation.participants.all():
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    messages = list(conversation.messages.values('id', 'sender__username', 'content', 'timestamp'))
    return JsonResponse(messages, safe=False)


@login_required
def send_message(request, conversation_id):
    if request.method == 'POST':
        conversation = get_object_or_404(Conversation, id=conversation_id)
        if request.user not in conversation.participants.all():
            return JsonResponse({'error': 'Unauthorized'}, status=403)

        data = json.loads(request.body)
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=data['content']
        )
        return JsonResponse({'message_id': message.id})
    return JsonResponse({'error': 'Invalid request'}, status=400)
