from django.shortcuts import render
from django.core.mail import EmailMessage
from rest_framework.views import APIView
from rest_framework.response import Response 

# Create your views here.
def index(request):
    return render(request, 'index.html')


class EmailSend(APIView):
    def post(self, request, *args, **kwargs):
        subject = f"Inquries From: {request.data.get('fullname')}"
        html_message = f"<p>{request.data.get('message')}</p></br></br><p>Email: {request.data.get('email')}</p><p>Phone #: {request.data.get('phone_num')}</p><p>Company: {request.data.get('company_name')}</p>"
        recipient_list = ['codechiqmember@gmail.com']

        email = EmailMessage(subject, '', '', recipient_list)
        email.content_subtype = 'html'  # Set the content_subtype to html
        email.body = html_message

        try:        
            email.send()
            return Response({'success': True})
        except Exception as e:
            return Response({'error': e})

