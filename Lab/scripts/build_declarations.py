"""Generate the three separate, factual GenAI declarations (requires reportlab)."""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

LAB=Path(__file__).resolve().parents[1]
SCOPES={
    4:'Codex generated the initial and revised SVG house, coordinate explanations, grouped windows, the preserved D3 selection/append example, CSV-loading code, horizontal bar chart, responsive styling and navigation. It adapted the supplied brand workflow by adding a CSV Writer. The original supplied brand-count CSV was preserved and independently checked against the teaching snapshot.',
    5:'Codex generated the vertical mean-energy bar chart, line chart with observation points and donut chart. It adapted existing KNIME node settings for rounded screen-size filtering, GroupBy aggregation and CSV export. It wrote independent reference calculations to check sample counts, means, size-group totals and annual electricity-price averages. These checks do not replace executed KNIME workflow evidence.',
    6:'Codex generated the CSV loader, histogram, scatterplot, screen-technology filters, record-count summary, tooltip and accessible record selector. It added the extension in which one filter updates both charts while keeping bins and domains fixed. It generated automated checks for missing numeric values, frequency totals, bin boundaries, domain endpoints, empty input and retention of the outlier, and performed browser interaction and layout checks.'
}

def main():
    output=LAB/'output/pdf';output.mkdir(parents=True,exist_ok=True)
    styles=getSampleStyleSheet()
    styles.add(ParagraphStyle(name='DeclarationBody',fontName='Helvetica',fontSize=10.5,leading=15,spaceAfter=12,alignment=TA_LEFT))
    for exercise,scope in SCOPES.items():
        sections=[
            ('Student','Nguyen Ngoc Lam Dan | Student ID: 104992198'),
            ('Assessment',f'COS30045 Data Visualisation - Demonstration 2, Exercise {exercise}'),
            ('Date','1 November 2026 (revised after the classroom demonstration)'),
            ('Tool and purpose','I used OpenAI Codex (GPT-6-based coding agent) to help implement the Week 4-6 exercise plan, prepare a local D3 v7 demonstration website, troubleshoot code and draft supporting documents.'),
            ('Scope of AI assistance',scope),
            ('After the demonstration','Following the classroom demonstration, Codex refined the website layout, typography, chart presentation, source notes and responsive behaviour, prepared a coordinate diagram and browser evidence, updated documents, and configured Vercel hosting at my request. The original datasets and analytical definitions were retained.'),
            ('Review and verification','Codex inspected the course instructions and supplied files, generated code and workflow settings, and ran the checks recorded in evidence/TEST-RESULTS.md. Its changes include explicit numeric parsing, source caveats, labels and accessibility support. Only checks actually performed are recorded. No participant feedback, Developer Tools capture or KNIME execution evidence was invented.'),
            ('Responsibility and limits','The SVG, website code, tests, workflow adaptations and this declaration include substantial AI assistance. I completed the classroom demonstration, as reported in this session. This declaration does not claim that I independently wrote every line or that an automated check assessed my understanding. Outstanding manual checks are identified in the submission checklist.'),
        ]
        story=[Paragraph(f'GenAI Declaration<br/>Exercise {exercise}',styles['Title']),Spacer(1,12)]
        for title,text in sections:
            story.append(Paragraph(title,styles['Heading3']))
            story.append(Paragraph(text,styles['DeclarationBody']))
        pdf=output/f'GenAI-Declaration_Exercise-{exercise}.pdf'
        document=SimpleDocTemplate(str(pdf),pagesize=A4,rightMargin=48,leftMargin=48,topMargin=40,bottomMargin=40,title=f'GenAI Declaration - Exercise {exercise}',author='Nguyen Ngoc Lam Dan')
        document.build(story)
        markdown=f'# GenAI Declaration - Exercise {exercise}\n\n'+'\n\n'.join(f'## {title}\n\n{text}' for title,text in sections)+'\n'
        (LAB/f'Lab-{exercise}/GenAI-Declaration_Exercise-{exercise}.md').write_text(markdown,encoding='utf-8')
        print(pdf)
if __name__=='__main__':main()
