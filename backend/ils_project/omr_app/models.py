from django.db import models
from django.contrib.postgres.fields import JSONField
from django.db.models.signals import pre_save
from django.dispatch import receiver

class Student(models.Model):
    name = models.CharField(max_length=100)
    school = models.CharField(max_length=100)
    fatherName = models.CharField(max_length=100)
    motherName = models.CharField(max_length=100)
    address = models.TextField()
    favouriteSubject = models.CharField(max_length=100)
    classLevel = models.CharField(max_length=10)
    stream = models.CharField(max_length=20)
    fatherOccupation = models.CharField(max_length=100)
    motherOccupation = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    
    def __str__(self):
        return self.name
    
class Subject(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='subject_images/', blank=True, null=True)
    board = models.CharField(max_length=20, default='CBSE', choices=[('CBSE', 'CBSE'), ('STATE', 'STATE')])
    class_level = models.IntegerField()
    
    def __str__(self):
        return f"{self.name} - Class {self.class_level} ({self.board})"

class Question(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    question_text = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    question_image = models.ImageField(upload_to='questions/', blank=True, null=True)
    
    CORRECT_OPTION_CHOICES = [
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
    ]
    correct_option = models.CharField(max_length=1, choices=CORRECT_OPTION_CHOICES)
    
    level = models.IntegerField(
        choices=[
            (1, 'Level 1'),
            (2, 'Level 2'),
            (3, 'Level 3'),
            (4, 'Level 4'),
        ],
        default=1
    )
    
    def __str__(self):
        return f"{self.subject.name} (Level {self.level}) - Q: {self.question_text[:30]}"

class StudentSubmission(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subjects = models.ManyToManyField(Subject)
    answers = models.JSONField()  # question_id: selected_option
    score = models.IntegerField()
    subject_scores = models.JSONField(null=True, blank=True)  # Add this
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.student.name} - {self.score} Marks"

# Define the signal handler at the bottom after all models are defined
@receiver(pre_save, sender=StudentSubmission)
def calculate_score(sender, instance, **kwargs):
    from omr_app.models import Question

    correct = 0
    for qid, selected in instance.answers.items():
        try:
            q = Question.objects.get(id=int(qid))
            # Compare against correct_option key (e.g., 'A')
            if selected == q.correct_option:
                correct += 1
        except:
            pass
    instance.score = correct



class StudentSavedQuestions(models.Model):
    """
    Model to store the specific questions assigned to a student for a subject.
    This prevents questions from changing when a student refreshes the page or returns later.
    """
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE)
    question_ids = models.JSONField(default=list)  # Store as JSON array since ArrayField requires PostgreSQL
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'subject')
        verbose_name = 'Student Saved Question'
        verbose_name_plural = 'Student Saved Questions'

    def __str__(self):
        return f"{self.student.name} - {self.subject.name} Questions"
