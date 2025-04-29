# views.py
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from rest_framework import status
from .serializers import *
from .pdf_utils import generate_student_performance_pdf
import random
from django.http import HttpResponse

@api_view(['POST'])
def submit_form(request):
    serializer = StudentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def subject_list(request):
    class_level = request.GET.get('class_level')
    board = request.GET.get('board')

    subjects = Subject.objects.all()
    if class_level:
        subjects = subjects.filter(class_level=class_level)
    if board:
        subjects = subjects.filter(board__iexact=board)

    serializer = SubjectSerializer(subjects, many=True, context={'request': request})
    return Response(serializer.data)

# @api_view(['POST'])
# def get_random_questions(request):
#     subject_ids = request.data.get("subject_ids", [])
#     result = {}

#     for subject_id in subject_ids:
#         questions = Question.objects.filter(subject_id=subject_id)
#         levels = [1, 2, 3, 4]
#         selected = []
#         level_counts = {}  # To track how many questions we selected from each level

#         for level in levels:
#             level_qs = list(questions.filter(level=level))
#             if level_qs:
#                 # Choose up to 5 random questions per level
#                 sample_size = min(5, len(level_qs))
#                 selected_questions = random.sample(level_qs, sample_size)
#                 selected.extend(selected_questions)
#                 level_counts[level] = sample_size  # Store the count of selected questions

#         subject = Subject.objects.get(id=subject_id)
#         result[subject.name] = {
#             'questions': QuestionSerializer(selected, many=True).data,
#             'level_counts': level_counts  # Include the count of selected questions per level
#         }

#     return Response(result)


@api_view(['POST'])
def get_random_questions(request):
    subject_ids = request.data.get("subject_ids", [])
    student_id = request.data.get("student_id")
    result = {}

    # Check if we have saved questions for this student
    if student_id:
        try:
            # Look for existing saved questions for this student and these subjects
            saved_questions = StudentSavedQuestions.objects.filter(
                student_id=student_id,
                subject_id__in=subject_ids
            )
            
            # If we found saved questions, return those instead of generating new ones
            if saved_questions.exists():
                for saved in saved_questions:
                    if str(saved.subject_id) in [str(id) for id in subject_ids]:
                        # Get questions from saved data
                        questions = Question.objects.filter(id__in=saved.question_ids)
                        subject = Subject.objects.get(id=saved.subject_id)
                        
                        # Count questions by level
                        level_counts = {}
                        for level in range(1, 5):
                            level_count = questions.filter(level=level).count()
                            if level_count > 0:
                                level_counts[level] = level_count
                        
                        # Format response the same way as for new questions
                        result[subject.name] = {
                            'questions': QuestionSerializer(questions, many=True).data,
                            'level_counts': level_counts
                        }
                        
                        # Remove this subject ID from the list to process
                        subject_ids = [sid for sid in subject_ids if str(sid) != str(saved.subject_id)]
        except Exception as e:
            print(f"Error retrieving saved questions: {e}")
            # Continue with generating new questions
    
    # For any remaining subject IDs that weren't found in saved questions,
    # generate new random questions
    for subject_id in subject_ids:
        questions = Question.objects.filter(subject_id=subject_id)
        levels = [1, 2, 3, 4]
        selected = []
        level_counts = {}
        selected_ids = []

        for level in levels:
            level_qs = list(questions.filter(level=level))
            if level_qs:
                # Choose up to 5 random questions per level
                sample_size = min(5, len(level_qs))
                selected_questions = random.sample(level_qs, sample_size)
                selected.extend(selected_questions)
                selected_ids.extend([q.id for q in selected_questions])
                level_counts[level] = sample_size

        subject = Subject.objects.get(id=subject_id)
        result[subject.name] = {
            'questions': QuestionSerializer(selected, many=True).data,
            'level_counts': level_counts
        }
        
        # Save these questions for this student if a student ID was provided
        if student_id:
            try:
                StudentSavedQuestions.objects.update_or_create(
                    student_id=student_id,
                    subject_id=subject_id,
                    defaults={'question_ids': selected_ids}
                )
            except Exception as e:
                print(f"Error saving questions for student: {e}")

    return Response(result)



# @api_view(['POST'])
# def submit_answers(request):
#     print("🔍 Incoming data:", request.data)

#     student_id = request.data.get("student_id")
#     subject_ids = request.data.get("subject_ids", [])
#     answers = request.data.get("answers", {})

#     try:
#         student = Student.objects.get(id=student_id)
#     except Student.DoesNotExist:
#         return Response({"error": "Student not found"}, status=status.HTTP_400_BAD_REQUEST)

#     score = 0
#     total = 0
#     subject_score_data = {}

#     for subject in Subject.objects.filter(id__in=subject_ids):
#         subject_questions = Question.objects.filter(subject=subject)
#         correct = 0
#         for q in subject_questions:
#             qid_str = str(q.id)
#             if qid_str in answers and answers[qid_str] == q.correct_option:
#                 correct += 1
#                 score += 1
#             total += 1
#         subject_score_data[subject.name] = correct
#         print(f"Subject: {subject.name}, Correct Answers: {correct}, Total Score So Far: {score}")

#     submission = StudentSubmission.objects.create(
#         student=student,
#         answers=answers,
#         score=score,
#         subject_scores=subject_score_data
#     )
#     submission.subjects.set(subject_ids)

#     return Response({
#         "message": "Answers submitted successfully",
#         "score": score,
#         "total": total,
#         "submission_id": submission.id
#     }, status=status.HTTP_200_OK)






@api_view(['POST'])
def submit_answers(request):
    print("🔍 Incoming data:", request.data)

    student_id = request.data.get("student_id")
    subject_ids = request.data.get("subject_ids", [])
    answers = request.data.get("answers", {})

    try:
        student = Student.objects.get(id=student_id)
        
        # After successful submission, remove saved questions to clean up
        StudentSavedQuestions.objects.filter(
            student_id=student_id,
            subject_id__in=subject_ids
        ).delete()
        
    except Student.DoesNotExist:
        return Response({"error": "Student not found"}, status=status.HTTP_400_BAD_REQUEST)

    score = 0
    total = 0
    subject_score_data = {}

    for subject in Subject.objects.filter(id__in=subject_ids):
        subject_questions = Question.objects.filter(subject=subject)
        correct = 0
        for q in subject_questions:
            qid_str = str(q.id)
            if qid_str in answers and answers[qid_str] == q.correct_option:
                correct += 1
                score += 1
            total += 1
        subject_score_data[subject.name] = correct
        print(f"Subject: {subject.name}, Correct Answers: {correct}, Total Score So Far: {score}")

    submission = StudentSubmission.objects.create(
        student=student,
        answers=answers,
        score=score,
        subject_scores=subject_score_data
    )
    submission.subjects.set(subject_ids)

    return Response({
        "message": "Answers submitted successfully",
        "score": score,
        "total": total,
        "submission_id": submission.id
    }, status=status.HTTP_200_OK)



@api_view(['GET'])
def generate_pdf(request, submission_id):
    """
    Generate and download a PDF report for a student submission
    """
    # Get the submission
    submission = get_object_or_404(StudentSubmission, id=submission_id)
    student = submission.student
    
    try:
        # Generate PDF using the utility function
        buffer = generate_student_performance_pdf(
            student_id=student.id,
            title="Student Performance Report",
            notes="",
            footer="Generated by ILS Assessment System",
            include_chart=True
        )
        
        # Create response with PDF attachment
        filename = f"{student.name.replace(' ', '_')}_performance_report.pdf"
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
        
    except Exception as e:
        # Handle any errors that might occur during PDF generation
        print(f"Error generating PDF: {e}")
        return Response(
            {"error": "Failed to generate PDF report", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['GET'])
def student_performance_charts(request, submission_id):
    try:
        submission = Submission.objects.get(id=submission_id)
        student = submission.student
        
        # Get submission details
        submission_details = SubmissionDetail.objects.filter(submission=submission)
        
        # Prepare data for charts
        subjects = []
        scores = []
        totals = []
        level_data = {}
        
        # Group by subject
        subject_groups = {}
        for detail in submission_details:
            question = detail.question
            subject_name = question.subject.name
            
            if subject_name not in subject_groups:
                subject_groups[subject_name] = []
            
            subject_groups[subject_name].append({
                'question': question,
                'is_correct': detail.is_correct,
                'level': question.level
            })
        
        # Process each subject
        for subject_name, details in subject_groups.items():
            subjects.append(subject_name)
            
            # Initialize level data for this subject
            level_data[subject_name] = {
                'level1_correct': 0, 'level1_total': 0,
                'level2_correct': 0, 'level2_total': 0,
                'level3_correct': 0, 'level3_total': 0,
                'level4_correct': 0, 'level4_total': 0,
            }
            
            # Count by level with the 5-question limit
            level_counts = {1: 0, 2: 0, 3: 0, 4: 0}
            level_correct = {1: 0, 2: 0, 3: 0, 4: 0}
            
            for detail in details:
                level = detail.get('level')
                # Only count up to 5 questions per level
                if level_counts[level] < 5:
                    level_counts[level] += 1
                    if detail.get('is_correct'):
                        level_correct[level] += 1
            
            # Update level data
            level_data[subject_name]['level1_correct'] = level_correct[1]
            level_data[subject_name]['level1_total'] = level_counts[1]
            level_data[subject_name]['level2_correct'] = level_correct[2]
            level_data[subject_name]['level2_total'] = level_counts[2]
            level_data[subject_name]['level3_correct'] = level_correct[3]
            level_data[subject_name]['level3_total'] = level_counts[3]
            level_data[subject_name]['level4_correct'] = level_correct[4]
            level_data[subject_name]['level4_total'] = level_counts[4]
            
            # Calculate subject totals
            subject_score = sum(level_correct.values())
            subject_total = sum(level_counts.values())
            
            scores.append(subject_score)
            totals.append(subject_total)
        
        # Prepare chart data
        chart_data = {
            'subjects': subjects,
            'scores': scores,
            'totals': totals,
            'level_data': level_data
        }
        
        context = {
            'title': 'Student Performance Charts',
            'student': student,
            'submission': submission,
            'chart_data': chart_data,
            'opts': Submission._meta,
        }
        
        return render(request, 'admin/student_performance_charts.html', context)
    
    except Submission.DoesNotExist:
        return HttpResponseNotFound('Submission not found')