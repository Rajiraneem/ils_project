from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('submit-form/', views.submit_form, name='submit_form'),
    path('api/subjects/', views.subject_list, name='subject-list'),
    path('api/get_random_questions/', views.get_random_questions, name='get_random_questions'),
    path('api/submit_answers/', views.submit_answers, name='submit_answers'),
    # path('api/generate_pdf/<int:submission_id>/', views.generate_pdf, name='generate_pdf'),
    path('api/generate_pdf/<int:submission_id>/', views.generate_pdf, name='generate_pdf'),

    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
