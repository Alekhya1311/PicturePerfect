from django.shortcuts import render

# Create your views here.


def render_about(request):
    # details = get_about_details()
    return render(request, 'index.html')
