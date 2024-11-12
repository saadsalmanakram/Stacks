from django.shortcuts import render

# Create your views here.

def receipes(request):
    if request.method == "POST":

        data = request.POST
        receipe_image = request.FILES['receipe_image']
        receipe_name = data.get('receipe_name')
        receipe_description = data.get('receipe_description')

        print(receipe_description)
        print(receipe_name)

    return render(request, 'receipes.html')

