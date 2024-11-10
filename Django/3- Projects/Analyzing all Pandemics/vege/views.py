from django.shortcuts import render

# Create your views here.

def receipes(request):
    return render(request, 'receipes.html')

