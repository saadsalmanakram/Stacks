from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def home(request):
    peoples = [
        {'name' : 'Saad', 'age' : 26},
        {'name' : 'Salman', 'age' : 22},
        {'name' : 'Monti', 'age' : 20},
        {'name' : 'Haider', 'age' : 19},
        {'name' : 'Javeria', 'age' : 18}
    ]

    text = """
         Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    """
    
    return render(request, "home/index.html", context= {'peoples': peoples, 'text': text})

def about(request):
    return render(request, "home/about.html")

def contact(request):
    return render(request, "home/contact.html")