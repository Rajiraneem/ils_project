from io import BytesIO
import random
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    Image,
    Flowable
)
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch, mm
from reportlab.graphics.shapes import Drawing, String, Rect
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.legends import Legend
from reportlab.lib.enums import TA_CENTER
import datetime

from .models import StudentSubmission, Question  # Adjust as needed

# --- Helper functions and classes ---

def get_random_quote():
    quotes = [
        "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
        "The beautiful thing about learning is that no one can take it away from you.",
        "Education is not the filling of a pail, but the lighting of a fire.",
        "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
        "Intelligence plus character-that is the goal of true education.",
        "The function of education is to teach one to think intensively and to think critically.",
        "Education is not preparation for life; education is life itself.",
        "The roots of education are bitter, but the fruit is sweet.",
        "Learning is a treasure that will follow its owner everywhere.",
        "Education is the most powerful weapon which you can use to change the world."
    ]
    return random.choice(quotes)

def get_random_tip():
    tips = [
        "Study in short bursts with regular breaks to improve retention.",
        "Teaching what you've learned to someone else is one of the best ways to solidify your knowledge.",
        "Create mind maps to visualize connections between concepts.",
        "Set specific goals for each study session to maintain focus.",
        "Regular review of material improves long-term memory.",
        "Sleep is crucial for memory consolidation - get enough rest!",
        "Exercise before studying can improve focus and cognitive function.",
        "Try the Pomodoro technique: 25 minutes of focus followed by a 5-minute break.",
        "Use mnemonic devices to remember complex information more easily.",
        "Practice active recall instead of passive reading for better retention."
    ]
    return random.choice(tips)

def get_random_fact():
    facts = [
        "Your brain uses about 20% of your body's total energy.",
        "Learning a new language can improve decision-making skills.",
        "Taking handwritten notes helps you remember information better than typing.",
        "Regular physical exercise improves cognitive function and memory.",
        "The human brain can store approximately 2.5 petabytes of information.",
        "Listening to classical music while studying can enhance spatial reasoning.",
        "Humans are capable of making mental maps using grid cells in the brain.",
        "Reading fiction increases empathy and emotional intelligence.",
        "Your brain processes visual information 60,000 times faster than text.",
        "Learning new skills creates new neural pathways in your brain."
    ]
    return random.choice(facts)

class WaterMark(Flowable):
    def __init__(self, text, angle=45):
        Flowable.__init__(self)
        self.text = text
        self.angle = angle
        
    def draw(self):
        canvas = self.canv
        canvas.saveState()
        canvas.setFont('Helvetica', 70)
        canvas.setFillColor(colors.Color(0.9, 0.9, 0.9))
        canvas.translate(A4[0]/2, A4[1]/2)
        canvas.rotate(self.angle)
        canvas.drawCentredString(0, 0, self.text)
        canvas.restoreState()

class MotivationalBox(Flowable):
    def __init__(self, content, width=400, height=80):
        Flowable.__init__(self)
        self.content = content
        self.width = width
        self.height = height
        
    def draw(self):
        canvas = self.canv
        canvas.saveState()
        canvas.setFillColor(colors.Color(0.95, 0.95, 1.0))
        canvas.setStrokeColor(colors.Color(0.7, 0.7, 0.9))
        canvas.roundRect(0, 0, self.width, self.height, 8, stroke=1, fill=1)
        canvas.setFont('Helvetica-Bold', 11)
        canvas.setFillColor(colors.Color(0.3, 0.3, 0.6))
        canvas.drawString(15, self.height-20, self.content)
        canvas.setFillColor(colors.Color(1.0, 0.8, 0.2))
        canvas.circle(15, 15, 8, stroke=0, fill=1)
        canvas.restoreState()

def create_page_footer(canvas, doc, footer_text=""):
    canvas.saveState()
    footer = f"Page {doc.page} | {footer_text} | Generated on {datetime.datetime.now().strftime('%Y-%m-%d')}"
    canvas.setFont('Helvetica', 9)
    canvas.setFillColor(colors.gray)
    canvas.drawString(inch, 0.5 * inch, footer)
    canvas.line(inch, 0.75 * inch, A4[0] - inch, 0.75 * inch)
    canvas.restoreState()

def create_page_header(canvas, doc, title="Student Report"):
    canvas.saveState()
    canvas.setFont('Helvetica-Bold', 10)
    canvas.setFillColor(colors.HexColor("#4CAF50"))
    canvas.drawString(A4[0] - 2*inch, A4[1] - 0.5 * inch, title)
    canvas.line(inch, A4[1] - 0.6 * inch, A4[0] - inch, A4[1] - 0.6 * inch)
    canvas.restoreState()

def create_page_decoration(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(colors.HexColor("#E8F5E9"))
    canvas.rect(0, 0, 25*mm, A4[1], fill=1, stroke=0)
    for _ in range(3):
        x = random.randint(5, 20) * mm
        y = random.randint(50, int(A4[1]/mm) - 50) * mm
        size = random.randint(5, 15) * mm
        canvas.setFillColor(colors.Color(0.8, 0.9, 0.8, alpha=0.3))
        canvas.circle(x, y, size, fill=1, stroke=0)
    canvas.restoreState()

def add_random_content_to_page(story):
    content_type = random.choice(["quote", "tip", "fact", "decoration"])
    if content_type == "quote":
        quote = get_random_quote()
        style = ParagraphStyle(
            'Quote',
            parent=styles['Italic'],
            textColor=colors.HexColor("#1B5E20"),
            borderColor=colors.HexColor("#A5D6A7"),
            borderWidth=1,
            borderPadding=6,
            alignment=TA_CENTER
        )
        story.append(Spacer(1, 12))
        story.append(Paragraph(f'"{quote}"', style))
        story.append(Spacer(1, 12))
    elif content_type == "tip":
        tip = get_random_tip()
        story.append(Spacer(1, 12))
        story.append(MotivationalBox(f"💡 TIP: {tip}"))
        story.append(Spacer(1, 12))
    elif content_type == "fact":
        fact = get_random_fact()
        style = ParagraphStyle(
            'Fact',
            parent=styles['Normal'],
            backColor=colors.HexColor("#E8F5E9"),
            borderColor=colors.HexColor("#81C784"),
            borderWidth=1,
            borderPadding=6
        )
        story.append(Spacer(1, 12))
        story.append(Paragraph(f"<b>Did you know?</b> {fact}", style))
        story.append(Spacer(1, 12))
    elif content_type == "decoration":
        story.append(Spacer(1, 12))
        drawing = Drawing(400, 20)
        for i in range(10):
            x = i * 40
            color = colors.Color(0.6, 0.8, 0.6, alpha=0.2 + (i % 3) * 0.1)
            drawing.add(Rect(x, 5, 30, 10, fillColor=color, strokeColor=None))
        story.append(drawing)
        story.append(Spacer(1, 12))
    return story

# --- Styles ---
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name='ReportTitle',
    parent=styles['Title'],
    textColor=colors.HexColor("#2E7D32"),
    fontSize=24,
    spaceAfter=12
))
styles.add(ParagraphStyle(
    name='ReportHeading1',
    parent=styles['Heading1'],
    textColor=colors.HexColor("#2E7D32"),
    fontSize=18,
    spaceAfter=10
))
styles.add(ParagraphStyle(
    name='ReportHeading2',
    parent=styles['Heading2'],
    textColor=colors.HexColor("#388E3C"),
    fontSize=16,
    spaceAfter=8
))
styles.add(ParagraphStyle(
    name='ReportNormal',
    parent=styles['Normal'],
    textColor=colors.HexColor("#333333"),
    fontSize=11,
    spaceAfter=6
))
styles.add(ParagraphStyle(
    name='ReportItalic',
    parent=styles['Normal'],
    fontName='Helvetica-Oblique',
    fontSize=11,
    textColor=colors.HexColor("#555555")
))

# --- Main PDF Generation Function ---
def generate_student_performance_pdf(student_id, title, notes="", footer="", include_chart=True, logo_bytes=None, signature=None):
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=30*mm,
        rightMargin=30*mm,
        topMargin=20*mm,
        bottomMargin=20*mm
    )
    story = []

    # Cover Page
    story.append(WaterMark("CONFIDENTIAL"))
    if logo_bytes:
        img = Image(BytesIO(logo_bytes), width=150, height=100)
        img.hAlign = 'CENTER'
        story.append(img)
    story.append(Spacer(1, 30))
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['ReportTitle'],
        alignment=TA_CENTER,
        fontSize=28
    )
    story.append(Paragraph(title or "Student Performance Report", title_style))
    story.append(Spacer(1, 150))
    drawing = Drawing(400, 100)
    pie = Pie()
    pie.x = 150
    pie.y = 50
    pie.width = 100
    pie.height = 100
    pie.data = [35, 25, 20, 20]
    pie.labels = None
    pie.slices.strokeWidth = 0.5
    pie.slices[0].fillColor = colors.HexColor("#4CAF50")
    pie.slices[1].fillColor = colors.HexColor("#2196F3")
    pie.slices[2].fillColor = colors.HexColor("#FF9800")
    pie.slices[3].fillColor = colors.HexColor("#9C27B0")
    drawing.add(pie)
    story.append(drawing)
    story.append(Spacer(1, 60))
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['ReportHeading2'],
        alignment=TA_CENTER
    )
    story.append(Paragraph("Confidential Academic Assessment", subtitle_style))
    story.append(Spacer(1, 30))
    quote_style = ParagraphStyle(
        'CoverQuote',
        parent=styles['ReportItalic'],
        alignment=TA_CENTER,
        textColor=colors.HexColor("#555555")
    )
    story.append(Paragraph(f'"{get_random_quote()}"', quote_style))
    story.append(PageBreak())

    # Introduction Page
    story.append(Paragraph("Introduction", styles['ReportHeading1']))
    add_random_content_to_page(story)
    story.append(Paragraph(
        "This comprehensive report presents a detailed analysis of the student's academic performance "
        "based on subject-wise assessments. The evaluation covers multiple subjects across different "
        "difficulty levels to provide a holistic view of the student's strengths and areas for improvement.",
        styles['ReportNormal']
    ))
    story.append(Spacer(1, 12))
    story.append(Paragraph(
        "The assessment is designed to measure both knowledge acquisition and critical thinking skills. "
        "Results are presented with visual aids to facilitate understanding of performance patterns.",
        styles['ReportNormal']
    ))
    add_random_content_to_page(story)
    story.append(PageBreak())

    # Fetch data
    submission = StudentSubmission.objects.get(student__id=student_id)
    student = submission.student
    answers = submission.answers or {}
    question_ids = [int(qid) for qid in answers.keys()]

    # Student Info Page
    info_heading = ParagraphStyle(
        'InfoHeading',
        parent=styles['ReportHeading2'],
        textColor=colors.HexColor("#1B5E20"),
        fontSize=18,
        borderColor=colors.HexColor("#A5D6A7"),
        borderWidth=1,
        borderPadding=6,
        backColor=colors.HexColor("#E8F5E9")
    )
    story.append(Paragraph("Student Information", info_heading))
    story.append(Spacer(1, 12))
    info_data = [
        ["Student Name:", student.name],
        ["Class:", student.classLevel],
        ["School:", student.school],
        ["Report Date:", datetime.datetime.now().strftime("%B %d, %Y")]
    ]
    info_table = Table(info_data, colWidths=[100, 300])
    info_table.setStyle(TableStyle([
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor("#1B5E20")),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('LINEBELOW', (0, 0), (1, -1), 0.5, colors.HexColor("#A5D6A7")),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 24))
    add_random_content_to_page(story)

    # Overall Score
    total_correct = submission.score
    total_questions = len(answers) if answers else 0
    overall_percentage = round((total_correct / total_questions) * 100, 2) if total_questions > 0 else 0
    story.append(Paragraph("Overall Performance", styles['ReportHeading2']))
    drawing = Drawing(400, 80)
    drawing.add(Rect(0, 30, 300, 30, fillColor=colors.HexColor("#EEEEEE"), strokeColor=None))
    if overall_percentage >= 75:
        score_color = colors.HexColor("#4CAF50")
    elif overall_percentage >= 50:
        score_color = colors.HexColor("#FFC107")
    else:
        score_color = colors.HexColor("#F44336")
    score_width = (overall_percentage / 100) * 300
    drawing.add(Rect(0, 30, score_width, 30, fillColor=score_color, strokeColor=None))
    drawing.add(String(150, 45, f"{overall_percentage}%", fontName="Helvetica-Bold", fontSize=14, fillColor=colors.white))
    drawing.add(String(10, 10, f"Score: {total_correct} out of {total_questions} questions", fontName="Helvetica", fontSize=10))
    story.append(drawing)
    story.append(Spacer(1, 12))
    if overall_percentage >= 90:
        performance_desc = "Outstanding performance! The student demonstrates exceptional understanding across subjects."
    elif overall_percentage >= 80:
        performance_desc = "Excellent performance! The student shows strong comprehension of most concepts."
    elif overall_percentage >= 70:
        performance_desc = "Very good performance. The student has a good grasp of the material with some areas for improvement."
    elif overall_percentage >= 60:
        performance_desc = "Good performance. The student understands core concepts but has several areas to strengthen."
    elif overall_percentage >= 50:
        performance_desc = "Satisfactory performance. The student has basic understanding but needs significant improvement."
    else:
        performance_desc = "Needs improvement. The student requires additional support to meet expected standards."
    story.append(Paragraph(performance_desc, styles['ReportNormal']))
    story.append(Spacer(1, 12))
    note_style = ParagraphStyle(
        'Note',
        parent=styles['ReportItalic'],
        fontSize=9,
        textColor=colors.HexColor("#666666")
    )
    story.append(Paragraph("* Scores are calculated based on randomly selected questions (max 5 per level)", note_style))
    story.append(Spacer(1, 12))
    add_random_content_to_page(story)
    story.append(PageBreak())

    # Subject Summary Page
    story.append(Paragraph("Subject Performance Summary", styles['ReportHeading1']))
    story.append(Spacer(1, 12))
    table_data = [["Subject", "Correct Answers", "Total Questions", "Percentage"]]
    for subject in submission.subjects.all():
        subject_name = subject.name
        subject_questions = Question.objects.filter(subject=subject, id__in=question_ids)
        total_subject_questions = subject_questions.count()
        correct_answers = 0
        for q in subject_questions:
            qid_str = str(q.id)
            if qid_str in answers and answers[qid_str] == q.correct_option:
                correct_answers += 1
        subject_percentage = round((correct_answers / total_subject_questions) * 100, 2) if total_subject_questions > 0 else 0
        table_data.append([
            subject_name,
            str(correct_answers),
            str(total_subject_questions),
            f"{subject_percentage}%"
        ])
    t = Table(table_data, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#4CAF50")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.gray),
        ('LINEBELOW', (0, 0), (-1, 0), 1.5, colors.HexColor("#388E3C")),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    for i in range(1, len(table_data)):
        if i % 2 == 1:
            t.setStyle(TableStyle([('BACKGROUND', (0, i), (-1, i), colors.HexColor("#F1F8E9"))]))
    story.append(t)
    story.append(Spacer(1, 24))
    add_random_content_to_page(story)
    story.append(PageBreak())

    # Level-based charts per subject
    if include_chart:
        subject_colors = [
            colors.HexColor("#4CAF50"),
            colors.HexColor("#2196F3"),
            colors.HexColor("#FF9800"),
            colors.HexColor("#9C27B0"),
            colors.HexColor("#F44336"),
            colors.HexColor("#00BCD4"),
            colors.HexColor("#795548"),
            colors.HexColor("#607D8B"),
        ]
        all_subjects = list(submission.subjects.all())
        for subject_index, subject in enumerate(all_subjects):
            subject_name = subject.name
            questions = Question.objects.filter(subject=subject, id__in=question_ids)
            level_total = [0, 0, 0, 0]
            level_correct = [0, 0, 0, 0]
            for q in questions:
                qid_str = str(q.id)
                level_index = q.level - 1
                level_total[level_index] += 1
                if qid_str in answers and answers[qid_str] == q.correct_option:
                    level_correct[level_index] += 1
            level_percentages = []
            for i in range(4):
                if level_total[i] > 0:
                    percentage = round((level_correct[i] / level_total[i]) * 100, 2)
                else:
                    percentage = 0
                level_percentages.append(percentage)
            drawing = Drawing(450, 250)
            subject_color = subject_colors[subject_index % len(subject_colors)]
            drawing.add(String(100, 230, f"{subject_name} Performance by Level",
                               fontSize=14, fontName="Helvetica-Bold", fillColor=subject_color))
            drawing.add(Rect(100, 225, 250, 1, fillColor=subject_color, strokeColor=None))
            bc = VerticalBarChart()
            bc.x = 50
            bc.y = 50
            bc.height = 150
            bc.width = 350
            bc.data = [level_correct, level_total]
            bc.categoryAxis.categoryNames = ["Level 1", "Level 2", "Level 3", "Level 4"]
            bc.barLabels.nudge = 7
            bc.barLabels = True
            bc.barWidth = 15
            bc.groupSpacing = 10
            bc.valueAxis.valueMin = 0
            bc.valueAxis.valueMax = max(max(level_total) + 1, 10)
            bc.valueAxis.valueStep = 1
            bc.categoryAxis.labels.fontName = 'Helvetica'
            bc.valueAxis.labels.fontName = 'Helvetica'
            bc.bars[0].fillColor = subject_color
            bc.bars[1].fillColor = colors.Color(0.9, 0.9, 0.9)
            bc.bars.strokeWidth = 0.5
            bc.valueAxis.gridStrokeWidth = 0.5
            bc.valueAxis.gridStrokeColor = colors.Color(0.8, 0.8, 0.8)
            bc.categoryAxis.strokeWidth = 0.5
            legend = Legend()
            legend.alignment = 'right'
            legend.x = 400
            legend.y = 150
            legend.colorNamePairs = [(bc.bars[0].fillColor, 'Correct Answers'),
                                    (bc.bars[1].fillColor, 'Total Questions')]
            legend.fontName = 'Helvetica'
            legend.fontSize = 8
            drawing.add(bc)
            story.append(drawing)
            level_table_data = [["Level", "Correct", "Total", "Percentage", "Performance"]]
            perf_labels = ["Basic", "Intermediate", "Advanced", "Expert"]
            for i in range(4):
                if level_percentages[i] >= 80:
                    performance = "Excellent"
                elif level_percentages[i] >= 60:
                    performance = "Good"
                elif level_percentages[i] >= 40:
                    performance = "Satisfactory"
                else:
                    performance = "Needs Improvement"
                level_table_data.append([
                    f"{perf_labels[i]} (Level {i+1})",
                    str(level_correct[i]),
                    str(level_total[i]),
                    f"{level_percentages[i]}%",
                    performance
                ])
            level_table = Table(level_table_data, repeatRows=1)
            level_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), subject_color),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.gray),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            for i in range(1, len(level_table_data)):
                if i % 2 == 1:
                    light_subject_color = colors.Color(
                        *subject_color.rgb(), alpha=0.1
                    )
                    level_table.setStyle(TableStyle([
                        ('BACKGROUND', (0, i), (-1, i), light_subject_color)
                    ]))
            story.append(Spacer(1, 20))
            story.append(level_table)
            story.append(Spacer(1, 20))
            strengths = []
            weaknesses = []
            for i in range(4):
                if level_percentages[i] >= 70:
                    strengths.append(f"Level {i+1} ({perf_labels[i]})")
                if level_percentages[i] < 50:
                    weaknesses.append(f"Level {i+1} ({perf_labels[i]})")
            subject_analysis = Paragraph(f"<b>{subject_name} Analysis:</b>", styles['ReportNormal'])
            story.append(subject_analysis)
            if strengths:
                strengths_text = Paragraph(f"<b>Strengths:</b> Demonstrated good understanding in {', '.join(strengths)}.", styles['ReportNormal'])
                story.append(strengths_text)
            if weaknesses:
                weaknesses_text = Paragraph(f"<b>Areas for Improvement:</b> Needs more practice in {', '.join(weaknesses)}.", styles['ReportNormal'])
                story.append(weaknesses_text)
            story.append(Spacer(1, 12))
            add_random_content_to_page(story)
            story.append(PageBreak())

    # Notes and Signature
    if notes:
        story.append(Paragraph("Teacher's Notes", styles['ReportHeading2']))
        notes_style = ParagraphStyle(
            'Notes',
            parent=styles['ReportNormal'],
            backColor=colors.HexColor("#FFF8E1"),
            borderColor=colors.HexColor("#FFB74D"),
            borderWidth=1,
            borderPadding=10
        )
        story.append(Paragraph(notes, notes_style))
    story.append(Spacer(1, 20))
    add_random_content_to_page(story)
    story.append(PageBreak())

    # Signature
    story.append(Paragraph("Authentication", styles['ReportHeading1']))
    story.append(Spacer(1, 40))
    if signature:
        story.append(Paragraph("Authorized Signature:", styles['ReportNormal']))
        story.append(Spacer(1, 40))
        sig_table = Table([[signature]], colWidths=[300])
        sig_table.setStyle(TableStyle([
            ('LINEABOVE', (0, 0), (0, 0), 1, colors.black),
            ('TOPPADDING', (0, 0), (0, 0), 10),
            ('ALIGNMENT', (0, 0), (0, 0), 'CENTER'),
        ]))
        story.append(sig_table)
    else:
        sig_table = Table([["________________________"]], colWidths=[300])
        sig_table.setStyle(TableStyle([
            ('LINEABOVE', (0, 0), (0, 0), 1, colors.black),
            ('TOPPADDING', (0, 0), (0, 0), 10),
            ('ALIGNMENT', (0, 0), (0, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (0, 0), 'Helvetica-Bold'),
        ]))
        story.append(sig_table)
        story.append(Paragraph("Authorized Signature", styles['ReportNormal']))
    story.append(Spacer(1, 60))
    final_quote = get_random_quote()
    quote_style = ParagraphStyle(
        'FinalQuote',
        parent=styles['ReportItalic'],
        alignment=TA_CENTER,
        textColor=colors.HexColor("#558B2F")
    )
    story.append(Paragraph(f'"{final_quote}"', quote_style))

    # Page layout
    def page_layout(canvas, doc):
        if doc.page > 1:
            create_page_decoration(canvas, doc)
            create_page_header(canvas, doc, title)
        footer_text = footer if footer else "Confidential Student Assessment Report"
        create_page_footer(canvas, doc, footer_text)

    doc.build(story, onFirstPage=page_layout, onLaterPages=page_layout)
    buffer.seek(0)
    return buffer
