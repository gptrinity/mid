import type { ChatMessage } from '../types'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''

export async function askAITutor(
  messages: ChatMessage[],
  context?: string
): Promise<string> {
  if (!OPENAI_API_KEY) {
    return getFallbackResponse(messages[messages.length - 1]?.content || '')
  }

  const systemMessage = `You are MidWise AI, an expert midwifery tutor. You help midwifery students understand concepts, prepare for exams, and clarify difficult topics. You are knowledgeable about:
- Anatomy and Physiology (especially reproductive system)
- Normal and complicated pregnancy, labour, and delivery
- Neonatal care and resuscitation
- Pharmacology for midwives
- Community midwifery and public health
- Midwifery ethics and law
- Obstetric emergencies
- Family planning and reproductive health

${context ? `Additional context about the current topic: ${context}` : ''}

Always provide accurate, evidence-based information. Use simple language students can understand. When explaining, give examples and mnemonics where helpful. Reference the NMCN curriculum when relevant.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    })

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'
  } catch {
    return getFallbackResponse(messages[messages.length - 1]?.content || '')
  }
}

function getFallbackResponse(question: string): string {
  const q = question.toLowerCase()

  if (q.includes('eclampsia') || q.includes('pre-eclampsia')) {
    return `**Eclampsia** is a serious pregnancy complication characterized by seizures in a woman with pre-eclampsia.\n\n**Key Points:**\n- Pre-eclampsia: BP ≥140/90 mmHg + proteinuria after 20 weeks\n- Eclampsia: Pre-eclampsia + generalized tonic-clonic seizures\n- Management: IV magnesium sulfate (first-line), control BP, deliver the baby\n- Prevention: Early antenatal care, calcium supplementation, low-dose aspirin for high-risk women\n\n**Mnemonic for pre-eclampsia signs:** "HEEELP" - Hemolysis, Elevated liver enzymes, Low platelets`
  }

  if (q.includes('postpartum hemorrhage') || q.includes('pph')) {
    return `**Postpartum Hemorrhage (PPH)** is blood loss ≥500ml after vaginal delivery or ≥1000ml after caesarean section.\n\n**4 T's of PPH:**\n1. **Tone** (70%) - Uterine atony - massage, oxytocics\n2. **Tissue** (20%) - Retained products - remove manually\n3. **Trauma** (10%) - Lacerations/tears - repair\n4. **Thrombin** (<1%) - Coagulopathy - blood products\n\n**Immediate Management:** Fundal massage, IV oxytocin, misoprostol, tranexamic acid`
  }

  if (q.includes('apgar')) {
    return `**APGAR Score** is assessed at 1 and 5 minutes after birth.\n\n**Components (mnemonic APGAR):**\n- **A**ppearance (skin color): 0=blue, 1=body pink, 2=completely pink\n- **P**ulse (heart rate): 0=absent, 1=<100, 2=>100\n- **G**rimace (reflex irritability): 0=no response, 1=grimace, 2=cry/active\n- **A**ctivity (muscle tone): 0=limp, 1=some flexion, 2=active movement\n- **R**espiration: 0=absent, 1=weak/irregular, 2=strong cry\n\n**Scoring:** 7-10=Good, 4-6=Moderate depression, 0-3=Severe depression`
  }

  if (q.includes('partograph') || q.includes('parto')) {
    return `**Partograph** is a graphical record of cervical dilatation and fetal progress during labour.\n\n**Key Components:**\n- Cervical dilatation (alert line and action line)\n- Fetal heart rate\n- Moulding\n- Membranes\n- Contractions\n- Urine output\n- Vital signs\n\n**Alert Line:** Plotted from 4cm dilatation, 1cm/hr\n**Action Line:** 4 hours to the right of alert line\n**If trace crosses action line:** escalate to senior midwife/doctor`
  }

  if (q.includes('contraception') || q.includes('family planning')) {
    return `**Family Planning Methods:**\n\n**Natural Methods:**\n- Lactation amenorrhea (LAM) - 98% effective first 6 months\n- Calendar/rhythm method\n- Basal body temperature\n\n**Barrier Methods:**\n- Male condom (85% typical use)\n- Female condom\n- Diaphragm\n\n**Hormonal:**\n- Combined oral pill (99% perfect use)\n- Progesterone-only pill\n- Injectable (Depo-Provera) - every 3 months\n- Implant (Nexplanon) - 3 years\n\n**Long-Acting (LARC):**\n- IUD (Copper T) - 5-10 years\n- IUS (Mirena) - 5 years\n\n**Permanent:**\n- Tubal ligation\n- Vasectomy`
  }

  if (q.includes(' stages of labour') || q.includes('labour')) {
    return `**Stages of Labour:**\n\n**First Stage (Dilatation):**\n- Latent phase: 0-4cm dilatation\n- Active phase: 4-10cm dilatation\n- Average: 1cm/hour for nulliparous\n\n**Second Stage (Expulsive):**\n- From full dilatation to delivery of baby\n- Average: 1-2 hours (nulliparous), 30-60 min (multiparous)\n\n**Third Stage (Placental):**\n- From delivery of baby to delivery of placenta\n- Average: 5-30 minutes\n- Active management: oxytocin injection, cord traction\n\n**Fourth Stage:**\n- First 1-2 hours after delivery\n- Monitor for PPH, vital signs`
  }

  if (q.includes('neonatal') || q.includes('newborn') || q.includes('resuscit')) {
    return `**Neonatal Resuscitation (NRP Algorithm):**\n\n**Step 1:** Dry, warm, stimulate\n**Step 2:** Position head neutral, clear airway if needed\n**Step 3:** Assess breathing and HR\n\n**If not breathing/HR<100:**\n- Positive pressure ventilation (PPV) - 40-60 breaths/min\n- Assess chest rise\n\n**If HR<60 after 30s PPV:**\n- Start chest compressions (3:1 ratio)\n- 100% oxygen\n\n**If HR<60 after 60s:**\n- Intubation\n- Epinephrine IV/IO\n\n**Remember: "Warm, Dry, Stimulate" is FIRST**`
  }

  if (q.includes('anatomy') || q.includes('uterus') || q.includes('reproductive')) {
    return `**Female Reproductive Anatomy:**\n\n**Uterus:**\n- Non-pregnant: 7.5cm long, 5cm wide, 2.5cm thick\n- Weight: 60-80g\n- Layers: Perimetrium, Myometrium, Endometrium\n- Blood supply: Uterine arteries (branches of internal iliac)\n\n**Fallopian Tubes:**\n- 10-12cm long\n- Parts: Infundibulum, Ampulla (fertilization site), Isthmus, Intramural\n\n**Ovaries:**\n- 3-5cm long, 1.5-3cm wide\n- Contains follicles at various stages\n\n**Cervix:**\n- 2.5-3cm long\n- Internal os (connects to uterus)\n- External os (connects to vagina)`
  }

  if (q.includes('drug') || q.includes('oxytocin') || q.includes('medication')) {
    return `**Key Drugs in Midwifery:**\n\n**Oxytocics:**\n- Oxytocin (Syntocinon): 5-10 IU IM/IV - PPH, labour augmentation\n- Misoprostol: 600-1000mcg sublingual - PPH prevention\n- Ergometrine: 0.5mg IM - PPH (avoid in hypertension)\n- Carboprost: 0.25mg IM - PPH unresponsive to oxytocin\n\n**Antihypertensives:**\n- Labetalol: 10-20mg IV - hypertensive emergency\n- Hydralazine: 5-10mg IV - severe hypertension\n- Magnesium sulfate: 4-6g IV loading - eclampsia\n\n**Antibiotics:**\n- Amoxicillin: safe in pregnancy\n- Metronidazole: avoid in first trimester\n- Gentamicin: ototoxic, nephrotoxic`
  }

  return `That's a great midwifery question! Let me help you understand this topic.\n\nBased on your question about "${question.substring(0, 50)}...", here are the key points to consider:\n\n1. **Foundation Knowledge**: Make sure you understand the basic anatomy and physiology involved\n2. **Clinical Application**: Think about how this applies in real midwifery practice\n3. **NMCN Relevance**: This topic is commonly tested in professional examinations\n\n**Study Tips:**\n- Use mnemonics to remember key points\n- Practice with past questions on this topic\n- Connect this knowledge to clinical scenarios\n\nWould you like me to explain any specific aspect in more detail? You can also ask about related topics like obstetric emergencies, normal labour management, or pharmacology.`
}
