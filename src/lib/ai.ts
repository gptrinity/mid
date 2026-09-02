import type { ChatMessage } from '../types'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''

export type AIProvider = 'groq' | 'openai' | 'offline'

export function getAIProvider(): AIProvider {
  if (GROQ_API_KEY) return 'groq'
  if (OPENAI_API_KEY) return 'openai'
  return 'offline'
}

export function isAIEnabled(): boolean {
  return !!GROQ_API_KEY || !!OPENAI_API_KEY
}

const SYSTEM_PROMPT = `You are MidWise AI, an expert midwifery tutor. You help midwifery students understand concepts, prepare for exams, and clarify difficult topics. You are knowledgeable about:
- Anatomy and Physiology (especially reproductive system)
- Normal and complicated pregnancy, labour, and delivery
- Neonatal care and resuscitation
- Pharmacology for midwives
- Community midwifery and public health
- Midwifery ethics and law
- Obstetric emergencies
- Family planning and reproductive health

Always provide accurate, evidence-based information. Use simple language students can understand. When explaining, give examples and mnemonics where helpful. Reference the NMCN curriculum when relevant. Format responses with markdown for readability.`

export async function askAITutor(
  messages: ChatMessage[],
  context?: string
): Promise<string> {
  const systemMessage = `${SYSTEM_PROMPT}${context ? `\n\nAdditional context about the current topic: ${context}` : ''}`

  // Try Groq first (free, fast)
  if (GROQ_API_KEY) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemMessage },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.choices?.[0]?.message?.content
        if (content) return content
      }
      // If Groq fails, fall through to OpenAI
    } catch {
      // Fall through to OpenAI
    }
  }

  // Try OpenAI (paid fallback)
  if (OPENAI_API_KEY) {
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
      const content = data.choices?.[0]?.message?.content
      if (content) return content
    } catch {
      // Fall through to offline
    }
  }

  // Offline fallback
  return getFallbackResponse(messages[messages.length - 1]?.content || '')
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

  if (q.includes('stages of labour') || q.includes('labour')) {
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

  if (q.includes('gestational diabetes') || q.includes('gdm')) {
    return `**Gestational Diabetes Mellitus (GDM):**\n\n**Definition:** Glucose intolerance first recognized during pregnancy (usually 2nd-3rd trimester).\n\n**Risk Factors:**\n- Obesity (BMI >30)\n- Family history of diabetes\n- Previous GDM\n- Age >35\n- Polycystic ovarian syndrome\n\n**Screening:** Oral glucose tolerance test (OGTT) at 24-28 weeks\n- Fasting: ≥7.0 mmol/L\n- 2hr: ≥7.8 mmol/L\n\n**Management:**\n- Diet modification (complex carbs, small frequent meals)\n- Exercise (30 min daily)\n- Blood glucose monitoring (4x daily)\n- Insulin if diet fails (metformin with caution)\n\n**Risks to baby:** Macrosomia, shoulder dystocia, neonatal hypoglycemia, birth trauma`
  }

  if (q.includes('cord prolapse') || q.includes('prolapsed cord')) {
    return `**Cord Prolapse** is an obstetric emergency where the umbilical cord descends ahead of the presenting part.\n\n**Types:**\n- **Overt:** Membranes ruptured, cord visible/palpable\n- **Occult:** Membranes intact, cord beside presenting part\n\n**Risk Factors:**\n- Malpresentation (breech, transverse lie)\n- Prematurity\n- Polyhydramnios\n- Long umbilical cord\n- Artificial rupture of membranes\n\n**Emergency Management:**\n1. Call for help immediately\n2. Position mother in Trendelenburg or knee-chest\n3. Push presenting part up off the cord (vaginal exam)\n4. Cover cord with warm sterile saline gauze\n5. Emergency delivery (C-section or assisted vaginal delivery)\n\n**Key point:** Time is critical — cord compression causes fetal hypoxia`
  }

  if (q.includes('shoulder dystocia')) {
    return `**Shoulder Dystocia** occurs when the fetal head is delivered but the anterior shoulder is impacted behind the symphysis pubis.\n\n**Definition:** Head-to-body delivery time >60 seconds, or need for manoeuvres.\n\n**HELPERR Mnemonic:**\n- **H** - Call for Help\n- **E** - Evaluate for episiotomy\n- **L** - Legs (McRoberts manoeuvre)\n- **P** - Suprapubic pressure\n- **E** - Enter manoeuvres (Wood's screw, Rubin's)\n- **R** - Remove posterior arm\n- **R** - Roll the patient\n\n**McRoberts:** Hyperflexion of thighs against abdomen\n**Suprapubic pressure:** Push behind symphysis to dislodge shoulder\n\n**Complications:** Brachial plexus injury, clavicle fracture, fetal hypoxia`
  }

  if (q.includes('breastfeed') || q.includes('lactation') || q.includes('latching')) {
    return `**Breastfeeding & Lactation Management:**\n\n**Benefits:**\n- Baby: immunity, ideal nutrition, bonding\n- Mother: uterine involution, weight loss, reduced cancer risk\n\n**Correct Latching:**\n1. Baby mouth wide open (like a yawn)\n2. Areola visible above and below lips\n3. Chin touches breast, nose free\n4. Rhythmic suck-swallow pattern\n5. No pain during feeding\n\n**Feeding Positions:**\n- Cradle hold (most common)\n- Cross-cradle hold (newborns)\n- Football/clutch hold (C-section)\n- Side-lying (bed rest)\n\n**Common Challenges:**\n- Engorgement: warm compress, frequent feeding\n- Mastitis: antibiotics, continue feeding\n- Cracked nipples: lanolin, correct latch\n- Low milk supply: frequent feeding, hydration, galactagogues\n\n**Exclusive breastfeeding:** First 6 months (WHO recommendation)`
  }

  if (q.includes('mental health') || q.includes('postpartum depression') || q.includes('perinatal')) {
    return `**Perinatal Mental Health:**\n\n**Baby Blues (50-80%):**\n- Onset: Day 2-3 postpartum\n- Symptoms: tearfulness, mood swings, anxiety\n- Resolves: Within 2 weeks without treatment\n\n**Postpartum Depression (10-15%):**\n- Onset: Within first month, can appear up to 1 year\n- Symptoms: persistent sadness, hopelessness, inability to bond, sleep/appetite changes\n- Treatment: Counseling, SSRIs (sertraline preferred), support groups\n\n**Postpartum Psychosis (0.1-0.2%):**\n- Onset: First 2 weeks\n- Symptoms: confusion, hallucinations, delusions, mania\n- EMERGENCY: Requires psychiatric admission\n\n**Edinburgh Postnatal Depression Scale (EPDS):**\n- Screening tool, score ≥13 suggests depression\n- Ask: "How have you been feeling since the baby was born?"`
  }

  if (q.includes('magnesium') || q.includes('mgso4') || q.includes('sulphate')) {
    return `**Magnesium Sulfate (MgSO4):**\n\n**Indications:**\n- Eclampsia prevention and treatment\n- Pre-eclampsia with severe features\n- Preterm labour (neuroprotection)\n\n**Dosing:**\n- Loading dose: 4-6g IV over 15-20 minutes\n- Maintenance: 1-2g/hour continuous infusion\n- IM: 5g in each buttock (if IV unavailable)\n\n**Monitoring:**\n- Deep tendon reflexes (patellar)\n- Respiratory rate (must be >12/min)\n- Urine output (must be >30ml/hr)\n- Respiratory rate <12 = toxicity\n- Loss of reflexes = toxicity\n\n**Antidote:** Calcium gluconate 10% - 10ml IV over 3 minutes\n\n**Toxicity Signs:**\n- Loss of deep tendon reflexes\n- Respiratory depression\n- Cardiac arrest\n- Flushing, drowsiness`
  }

  if (q.includes('vital signs') || q.includes('blood pressure') || q.includes('pulse')) {
    return `**Vital Signs in Midwifery:**\n\n**Normal Values (Adult):**\n- Temperature: 36.1-37.2°C\n- Pulse: 60-100 bpm\n- Respiratory rate: 12-20 breaths/min\n- Blood pressure: <120/80 mmHg\n- Oxygen saturation: 95-100%\n\n**Pregnancy Changes:**\n- BP: Drops in 1st trimester, returns to normal by 28 weeks\n- Pulse: May increase 10-15 bpm\n- Temperature: Slightly elevated\n- BP: ≥140/90 = hypertension in pregnancy\n\n**When to Escalate:**\n- BP ≥140/90 on two occasions (4 hours apart)\n- Temperature ≥38°C\n- Pulse >100 or <60\n- Respiratory rate >20\n- Oxygen saturation <95%`
  }

  if (q.includes('leopold') || q.includes('fetal lie') || q.includes('presentation')) {
    return `**Leopold Maneuvers:**\n\n**Purpose:** Determine fetal lie, presentation, and position\n\n**Technique (4 Maneuvers):**\n\n**1st Maneuver (Fundal grip):**\n- Feel fundus\n- Determines what is in the fundus (head = hard, round, ballotable; breech = soft, irregular)\n\n**2nd Maneuver (Umbilical grip):**\n- Palpate sides of uterus\n- Identify fetal back (smooth, firm) and small parts (irregular, moving)\n\n**3rd Maneuver (Pawlik's grip):**\n- Above symphysis pubis\n- Determines presenting part and engagement\n\n**4th Maneuver (Pelvic grip):**\n- Face toward feet\n- Determines degree of flexion and attitude\n\n**Fetal Lie:**\n- Longitudinal: parallel to mother's spine (normal)\n- Transverse: perpendicular\n- Oblique: at angle`
  }

  if (q.includes('epidural') || q.includes('analgesia') || q.includes('pain relief')) {
    return `**Pain Management in Labour:**\n\n**Non-Pharmacological:**\n- Breathing techniques\n- Massage and counter-pressure\n- Hydrotherapy (warm bath/shower)\n- Position changes\n- TENS machine\n- Hypnobirthing\n\n**Pharmacological:**\n- **Entonox** (50% N2O + 50% O2): Self-administered, quick onset\n- **Pethidine** 100mg IM: Reduces anxiety, may cause drowsiness\n- **Epidural:** Most effective, regional anaesthesia\n  - Continuous infusion or patient-controlled\n  - Risks: Hypotension, headache, urinary retention\n  - Can be extended for C-section\n\n**Epidural Setup:**\n- L3-L4 or L4-L5 interspace\n- Local anaesthetic + opioid\n- Test dose before bolus\n- Monitor BP every 5 minutes for 15 minutes\n\n**Contraindications:**\n- Patient refusal\n- Coagulopathy\n- Infection at insertion site\n- Severe hypovolaemia`
  }

  if (q.includes('safe motherhood') || q.includes('maternal mortality') || q.includes('mdg')) {
    return `**Safe Motherhood Programme:**\n\n**Goal:** Reduce maternal and neonatal mortality\n\n**MDG 5 (Millennium Development Goals):**\n- Improve maternal health\n- Target: Reduce maternal mortality by 75% between 1990-2015\n\n**SDG 3.1:**\n- Reduce global maternal mortality to less than 70 per 100,000 live births by 2030\n\n**Key Strategies:**\n- Skilled birth attendance at every delivery\n- Emergency obstetric care (EmOC)\n- Antenatal care (4+ visits)\n- Postnatal care\n- Family planning\n- Prevention of unsafe abortion\n\n**Nigeria Context:**\n- Maternal mortality: ~576 per 100,000 live births\n- Leading causes: Haemorrhage, sepsis, hypertensive disorders\n- Barriers: Poverty, cultural beliefs, distance, inadequate facilities`
  }

  if (q.includes('perioperative') || q.includes('caesarean') || q.includes('surgery')) {
    return `**Perioperative Nursing in Midwifery:**\n\n**Caesarean Section Indications:**\n- Previous C-section (depending on type)\n- Malpresentation/breech\n- Fetal distress\n- Placenta previa\n- Failed induction\n- Cephalopelvic disproportion (CPD)\n\n**Pre-operative:**\n- Informed consent\n- NPO (nil per os) 6-8 hours\n- Skin preparation\n- IV access\n- Blood grouping and crossmatch\n- Fetal monitoring\n\n**Post-operative:**\n- Monitor vital signs every 15 min x4, then hourly\n- Assess wound and dressing\n- Monitor lochia (may be less than vaginal delivery)\n- Encourage early ambulation (6-8 hours)\n- Pain management\n- Wound care: keep clean and dry\n- Remove sutures: Day 7 (if non-absorbable)`
  }

  return `That's a great midwifery question! Let me help you understand this topic.\n\nBased on your question about "${question.substring(0, 50)}...", here are the key points to consider:\n\n1. **Foundation Knowledge**: Make sure you understand the basic anatomy and physiology involved\n2. **Clinical Application**: Think about how this applies in real midwifery practice\n3. **NMCN Relevance**: This topic is commonly tested in professional examinations\n\n**Study Tips:**\n- Use mnemonics to remember key points\n- Practice with past questions on this topic\n- Connect this knowledge to clinical scenarios\n\nWould you like me to explain any specific aspect in more detail? You can also ask about related topics like obstetric emergencies, normal labour management, or pharmacology.`
}
