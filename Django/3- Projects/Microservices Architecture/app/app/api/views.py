from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def main(request):
	return HttpResponse("<h2>Print Hello World</h2>")