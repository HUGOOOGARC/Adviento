import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm

pdf_filename = "Talonario_Cupones_Romanticos_Lucia.pdf"
doc = SimpleDocTemplate(
    pdf_filename,
    pagesize=A4,
    rightMargin=1.5 * cm,
    leftMargin=1.5 * cm,
    topMargin=1.5 * cm,
    bottomMargin=1.5 * cm
)

story = []
styles = getSampleStyleSheet()

# Estilos de texto
title_style = ParagraphStyle(
    'CouponTitle',
    fontName='Helvetica-Bold',
    fontSize=16,
    leading=20,
    textColor=colors.HexColor('#B83232'),
    alignment=0
)

desc_style = ParagraphStyle(
    'CouponDesc',
    fontName='Helvetica',
    fontSize=10,
    leading=14,
    textColor=colors.HexColor('#5C4D4A'),
    alignment=0
)

tag_style = ParagraphStyle(
    'CouponTag',
    fontName='Helvetica-Bold',
    fontSize=9,
    leading=11,
    textColor=colors.HexColor('#7A5A4A'),
    alignment=2
)

# Lista de cupones inspirados en el calendario de Supabase
cupones_datos = [
    ("☕🥐 VALE POR: Desayuno en la cama", "Válido por un desayuno completo servido sin alarmas el fin de semana que elijas.", "CÓDIGO: LUCIA-02"),
    ("💆‍♀️✨ VALE POR: Sesión de masajes", "Concede un masaje de espalda o pies de 20 min con crema hidratante y música suave.", "CÓDIGO: LUCIA-06"),
    ("🍕🍣 VALE POR: Cena a tu elección", "Hoy no se cocina ni se discute: tú eliges absolutamente todo lo que cenamos.", "CÓDIGO: LUCIA-09"),
    ("🫂 VALE POR: Abrazo recargador", "Ven a buscarme y pídeme tu abrazo de 1 minuto sin decir nada en cualquier momento.", "CÓDIGO: LUCIA-13"),
    ("🧹❌ VALE POR: Exención total de tareas", "Hoy no mueves ni un dedo. Yo me encargo de fregar, recoger y dejar todo impecable.", "CÓDIGO: LUCIA-16"),
    ("🍦🍰 VALE POR: Tu dulce o helado favorito", "Vale por ir juntos a comprar o pedir tu tarta, pastel o postre preferido.", "CÓDIGO: LUCIA-21"),
    ("🕯️🍷 VALE POR: Cita romántica previa", "Vale por una cena íntima a la luz de las velas preparada especialmente para ti.", "CÓDIGO: LUCIA-23"),
    ("🎁✨ VALE POR: Lo que a ti te apetezca", "Comodín especial: este vale se puede canjear por cualquier deseo que me pidas.", "CÓDIGO: LUCIA-24")
]

tablas_cupones = []

for titulo, desc, codigo in cupones_datos:
    contenido_izq = [
        Paragraph(f"<b>{titulo}</b>", title_style),
        Spacer(1, 4),
        Paragraph(desc, desc_style),
        Spacer(1, 6),
        Paragraph("<i>Condiciones: Canjeable 1 sola vez con un beso ❤️</i>", desc_style)
    ]
    
    contenido_der = [
        Paragraph("<b>COUPON</b>", title_style),
        Spacer(1, 10),
        Paragraph(f"<b>{codigo}</b>", tag_style),
        Spacer(1, 10),
        Paragraph("✂️ Recortar", tag_style)
    ]

    t = Table([[contenido_izq, contenido_der]], colWidths=[13 * cm, 4.5 * cm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FDF8F2')),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor('#B83232')),
        ('LINEAFTER', (0,0), (0,0), 1, colors.HexColor('#EAD7C5')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    
    story.append(t)
    story.append(Spacer(1, 12))

doc.build(story)
print(f"Talonario generado con éxito: {pdf_filename}")