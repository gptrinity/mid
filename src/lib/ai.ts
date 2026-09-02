import type { ChatMessage } from '../types'

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''

export function isAIEnabled(): boolean {
  return !!OPENAI_API_KEY
}

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

  if (q.includes('gestational diabetes') || q.includes('gestational diabetes mellitus') || q.includes('gdm')) {
    return `**Gestational Diabetes Mellitus (GDM):**\n\n**Definition:** Glucose intolerance first recognized during pregnancy (usually 2nd-3rd trimester).\n\n**Risk Factors:**\n- Obesity (BMI >30)\n- Family history of diabetes\n- Previous GDM\n- Age >35\n- Polycystic ovarian syndrome\n\n**Screening:** Oral glucose tolerance test (OGTT) at 24-28 weeks\n- Fasting: ≥7.0 mmol/L\n- 2hr: ≥7.8 mmol/L\n\n**Management:**\n- Diet modification (complex carbs, small frequent meals)\n- Exercise (30 min daily)\n- Blood glucose monitoring (4x daily)\n- Insulin if diet fails (metformin with caution)\n\n**Risks to baby:** Macrosomia, shoulder dystocia, neonatal hypoglycemia, birth trauma`
  }

  if (q.includes('cord prolapse') || q.includes('prolapsed cord')) {
    return `**Cord Prolapse** is an obstetric emergency where the umbilical cord descends ahead of the presenting part.\n\n**Types:**\n- **Overt:** Membranes ruptured, cord visible/palpable\n- **Occult:** Membranes intact, cord beside presenting part\n\n**Risk Factors:**\n- Malpresentation (breech, transverse lie)\n- Prematurity\n- Polyhydramnios\n- Long umbilical cord\n- Artificial rupture of membranes\n\n**Emergency Management:**\n1. Call for help immediately\n2. Position mother in Trendelenburg or knee-chest\n3. Push presenting part up off the cord (vaginal exam)\n4. Cover cord with warm sterile saline gauze\n5. Emergency delivery (C-section or assisted vaginal delivery)\n\n**Key point:** Time is critical — cord compression causes fetal hypoxia`
  }

  if (q.includes('shoulder dystocia')) {
    return `**Shoulder Dystocia** occurs when the fetal head is delivered but the anterior shoulder is impacted behind the symphysis pubis.\n\n**Definition:** Head-to-body delivery time >60 seconds, or need for manoeuvres.\n\n**HELPERR Mnemonic:**\n- **H** - Call for Help\n- **E** - Evaluate for episiotomy\n- **L** - Legs (McRoberts manoeuvre)\n- **P** - Suprapubic pressure\n- **E** - Enter manoeuvres (Wood's screw, Rubin's)\n- **R** - Remove posterior arm\n- **R** - Roll the patient\n\n**McRoberts:** Hyperflexion of thighs against abdomen\n**Suprapubic pressure:** Push behind symphysis to dislodge shoulder\n\n**Complications:** Brachial plexus injury, clavicle fracture, fetal hypoxia`
  }

  if (q.includes('wound care') || q.includes('episiotomy') || q.includes('repair')) {
    return `**Wound Care in Midwifery:**\n\n**Episiotomy:**\n- Mediolateral: most common in Nigeria (45-60 degree angle)\n- Indications: fetal distress, instrumental delivery, need for more space\n- Repair: Continuous or interrupted sutures, absorbable material\n\n**Perineal Tear Grading:**\n- 1st degree: Skin only\n- 2nd degree: Into perineal muscles\n- 3rd degree: Into anal sphincter\n- 4th degree: Into rectal mucosa\n\n**Wound Care Principles:**\n- Keep clean and dry\n- Perineal care after each pad change\n- Sitz baths (warm water) for comfort\n- Pain management (paracetamol, ibuprofen)\n- Signs of infection: redness, swelling, discharge, fever`
  }

  if (q.includes('breastfeed') || q.includes('lactation') || q.includes('latching')) {
    return `**Breastfeeding & Lactation Management:**\n\n**Benefits:**\n- Baby: immunity, ideal nutrition, bonding\n- Mother: uterine involution, weight loss, reduced cancer risk\n\n**Correct Latching:**\n1. Baby mouth wide open (like a yawn)\n2. Areola visible above and below lips\n3. Chin touches breast, nose free\n4. Rhythmic suck-swallow pattern\n5. No pain during feeding\n\n**Feeding Positions:**\n- Cradle hold (most common)\n- Cross-cradle hold (newborns)\n- Football/clutch hold (C-section)\n- Side-lying (bed rest)\n\n**Common Challenges:**\n- engorgement: warm compress, frequent feeding\n- Mastitis: antibiotics, continue feeding\n- Cracked nipples: lanolin, correct latch\n- Low milk supply: frequent feeding, hydration, galactagogues\n\n**Exclusive breastfeeding:** First 6 months (WHO recommendation)`
  }

  if (q.includes('mental health') || q.includes('postpartum depression') || q.includes('perinatal')) {
    return `**Perinatal Mental Health:**\n\n**Baby Blues (50-80%):**\n- Onset: Day 2-3 postpartum\n- Symptoms: tearfulness, mood swings, anxiety\n- Resolves: Within 2 weeks without treatment\n\n**Postpartum Depression (10-15%):**\n- Onset: Within first month, can appear up to 1 year\n- Symptoms: persistent sadness, hopelessness, inability to bond, sleep/appetite changes\n- Treatment: Counseling, SSRIs (sertraline preferred), support groups\n\n**Postpartum Psychosis (0.1-0.2%):**\n- Onset: First 2 weeks\n- Symptoms: confusion, hallucinations, delusions, mania\n- EMERGENCY: Requires psychiatric admission\n\n**Edinburgh Postnatal Depression Scale (EPDS):**\n- Screening tool, score ≥13 suggests depression\n- Ask: "How have you been feeling since the baby was born?"`
  }

  if (q.includes('infection') || q.includes('sterilization') || q.includes('aseptic')) {
    return `**Infection Prevention & Control:**\n\n**Chain of Infection:**\n1. Infectious agent\n2. Reservoir\n3. Portal of exit\n4. Mode of transmission\n5. Portal of entry\n6. Susceptible host\n\n**Universal Precautions:**\n- Hand hygiene (5 moments)\n- Personal protective equipment\n- Safe sharps disposal\n- Respiratory hygiene\n\n**Sterilization Methods:**\n- Autoclave (steam under pressure): 121°C for 15-30 min\n- Dry heat: 160°C for 2 hours\n- Chemical: glutaraldehyde for 10 hours\n- Sterilization indicators: biological and chemical\n\n**Wound Infection Signs:**\n- Redness, warmth, swelling, pain\n- Purulent discharge\n- Fever\n- Rising WBC count`
  }

  if (q.includes('vital signs') || q.includes('blood pressure') || q.includes('pulse')) {
    return `**Vital Signs in Midwifery:**\n\n**Normal Values (Adult):**\n- Temperature: 36.1-37.2°C\n- Pulse: 60-100 bpm\n- Respiratory rate: 12-20 breaths/min\n- Blood pressure: <120/80 mmHg\n- Oxygen saturation: 95-100%\n\n**Pregnancy Changes:**\n- BP: Drops in 1st trimester, returns to normal by 28 weeks\n- Pulse: May increase 10-15 bpm\n- Temperature: Slightly elevated\n- BP: ≥140/90 = hypertension in pregnancy\n\n**When to Escalate:**\n- BP ≥140/90 on two occasions (4 hours apart)\n- Temperature ≥38°C\n- Pulse >100 or <60\n- Respiratory rate >20\n- Oxygen saturation <95%`
  }

  if (q.includes('neonatal jaundice') || q.includes('jaundice') || q.includes('bilirubin')) {
    return `**Neonatal Jaundice:**\n\n**Types:**\n- Physiological (60% of term babies): Day 2-3, peaks Day 4-5\n- Pathological: Within 24 hours, or rising bilirubin >5mg/dL/day\n\n**Bilirubin Levels:**\n- <5 mg/dL: Normal\n- 5-10 mg/dL: Mild jaundice\n- 10-15 mg/dL: Moderate\n- >15 mg/dL: Severe - risk of kernicterus\n\n**Causes (Pathological):**\n- Blood group incompatibility (ABO, Rh)\n- Sepsis\n- Polycythemia\n- G6PD deficiency\n- Breastfeeding jaundice\n\n**Treatment:**\n- Phototherapy: blue light (425-475nm)\n- Exchange transfusion: if bilirubin >20 mg/dL\n- Encourage frequent feeding\n- Stop phototherapy when bilirubin <12 mg/dL`
  }

  if (q.includes('partograph') || q.includes('cervix') || q.includes('cervical')) {
    return `**Partograph - Detailed:**\n\n**Purpose:** Monitor labour progress, detect abnormalities early\n\n**Plotting:**\n- Start at 4cm cervical dilatation\n- Alert line: 1cm/hour progression\n- Action line: 4 hours to the right of alert line\n\n**What to Record:**\n- Cervical dilatation (cm)\n- Fetal head descent (stations)\n- Fetal heart rate (every 15-30 min)\n- Contractions (frequency, duration, intensity)\n- Membranes (intact, ruptured - note colour of liquor)\n- Moulding (overriding, touching, separated)\n- Maternal pulse, BP, temperature, urine output\n\n**Interpretation:**\n- If trace crosses action line: consider augmentation or C-section\n- If FHR abnormal: immediate assessment\n- Meconium-stained liquor: consider fetal distress`
  }

  if (q.includes('amniotic fluid') || q.includes('polyhydramnios') || q.includes('oligohydramnios')) {
    return `**Amniotic Fluid Disorders:**\n\n**Normal Volume:**\n- 20 weeks: ~300ml\n- 32 weeks: ~700ml\n- 36-38 weeks: ~1000ml (peak)\n- Term: ~800ml\n\n**Polyhydramnios (>2000ml):**\n- Causes: gestational diabetes, neural tube defects, GI abnormalities, idiopathic\n- Risks: preterm labour, cord prolapse, malpresentation\n- Management: therapeutic amniocentesis if severe\n\n**Oligohydramnios (<500ml):**\n- Causes: PPROM, IUGR, maternal dehydration, post-term\n- Risks: cord compression, limb contractures, pulmonary hypoplasia\n- Management: IV fluids, amnioinfusion, delivery if severe\n\n**Assessment:**\n- Ultrasound: AFI (amniotic fluid index)\n- Normal AFI: 5-25cm\n- Deep vertical pocket: 2-8cm`
  }

  if (q.includes('magnesium') || q.includes('mgso4') || q.includes('sulphate')) {
    return `**Magnesium Sulfate (MgSO4):**\n\n**Indications:**\n- Eclampsia prevention and treatment\n- Pre-eclampsia with severe features\n- Preterm labour (neuroprotection)\n\n**Dosing:**\n- Loading dose: 4-6g IV over 15-20 minutes\n- Maintenance: 1-2g/hour continuous infusion\n- IM: 5g in each buttock (if IV unavailable)\n\n**Monitoring:**\n- Deep tendon reflexes (patellar)\n- Respiratory rate (must be >12/min)\n- Urine output (must be >30ml/hr)\n- Respiratory rate <12 = toxicity\n- Loss of reflexes = toxicity\n\n**Antidote:** Calcium gluconate 10% - 10ml IV over 3 minutes\n\n**Toxicity Signs:**\n- Loss of deep tendon reflexes\n- Respiratory depression\n- Cardiac arrest\n- Flushing, drowsiness`
  }

  if (q.includes('physiological') || q.includes('pregnancy changes') || q.includes('antepartum')) {
    return `**Physiological Changes in Pregnancy:**\n\n**Cardiovascular:**\n- Blood volume: ↑ 40-50%\n- Cardiac output: ↑ 30-50%\n- Heart rate: ↑ 10-15 bpm\n- BP: ↓ in 1st trimester, returns by 28 weeks\n- Peripheral resistance: ↓\n\n**Respiratory:**\n- Tidal volume: ↑ 40%\n- O2 consumption: ↑ 20%\n- Diaphragm elevated 4cm\n\n**Haematological:**\n- Plasma volume ↑ more than RBC = physiological anaemia\n- WBC ↑ (10,000-16,000)\n- Clotting factors ↑ (hypercoagulable)\n\n**Renal:**\n- GFR: ↑ 50%\n- Urine frequency (especially 1st and 3rd trimesters)\n- Glycosuria (normal in pregnancy)\n\n**Gastrointestinal:**\n- Nausea/vomiting (1st trimester)\n- Constipation (progesterone effect)\n- Heartburn (relaxed lower esophageal sphincter)`
  }

  if (q.includes('leopold') || q.includes('fetal lie') || q.includes('presentation')) {
    return `**Leopold Maneuvers:**\n\n**Purpose:** Determine fetal lie, presentation, and position\n\n**Technique (4 Maneuvers):**\n\n**1st Maneuver (Fundal grip):**\n- Feel fundus\n- Determines what is in the fundus (head = hard, round, ballotable; breech = soft, irregular)\n\n**2nd Maneuver (Umbilical grip):**\n- Palpate sides of uterus\n- Identify fetal back (smooth, firm) and small parts (irregular, moving)\n\n**3rd Maneuver (Pawlik's grip):**\n- Above symphysis pubis\n- Determines presenting part and engagement\n\n**4th Maneuver (Pelvic grip):**\n- Face toward feet\n- Determines degree of flexion and attitude\n\n**Fetal Lie:**\n- Longitudinal: parallel to mother's spine (normal)\n- Transverse: perpendicular\n- Oblique: at angle`
  }

  if (q.includes('research') || q.includes('evidence-based') || q.includes('study design')) {
    return `**Research Methods in Midwifery:**\n\n**Evidence-Based Practice (EBP):**\n- Integration of best research evidence with clinical expertise and patient values\n- Steps: Ask, Acquire, Appraise, Apply, Assess\n\n**Study Designs (Hierarchy of Evidence):**\n1. Systematic reviews/Meta-analyses\n2. Randomized Controlled Trials (RCTs)\n3. Cohort studies\n4. Case-control studies\n5. Cross-sectional studies\n6. Case reports/series\n7. Expert opinion\n\n**Key Concepts:**\n- Validity: Internal (study design) vs External (generalizability)\n- Reliability: Consistency of results\n- Bias: Selection, information, confounding\n- Sample size: Power analysis determines needed sample\n- P-value: <0.05 = statistically significant\n\n**Sampling Methods:**\n- Random\n- Stratified\n- Systematic\n- Convenience`
  }

  if (q.includes('ethics') || q.includes('consent') || q.includes('confidentiality')) {
    return `**Midwifery Ethics & Law:**\n\n**Four Ethical Principles (Beauchamp & Childress):**\n1. **Autonomy** - Respect patient's right to decide\n2. **Beneficence** - Do good for the patient\n3. **Non-maleficence** - Do no harm\n4. **Justice** - Fair distribution of resources\n\n**Informed Consent Requirements:**\n- Patient must be competent (18+ years)\n- Information provided: diagnosis, treatment options, risks, benefits\n- Voluntary (no coercion)\n- Patient can withdraw consent at any time\n\n**Confidentiality:**\n- Patient information is private\n- Break confidentiality only when:\n  - Court order\n  - Notifiable diseases\n  - Child abuse/safeguarding\n  - Risk to others\n\n**Professional Boundaries:**\n- Maintain therapeutic relationship\n- No dual relationships\n- Document all care\n- Accountability for actions`
  }

  if (q.includes('leadership') || q.includes('ward management') || q.includes('team')) {
    return `**Midwifery Leadership & Administration:**\n\n**Leadership Styles:**\n- **Autocratic:** Leader makes decisions alone (crisis situations)\n- **Democratic:** Team input in decisions (preferred)\n- **Laissez-faire:** Minimal direction (experienced teams)\n- **Transformational:** Inspires and motivates\n\n**Ward Management:**\n- Staff allocation and rostering\n- Equipment and supplies management\n- Patient flow and bed management\n- Quality assurance and audit\n- Incident reporting and investigation\n\n**Team Coordination:**\n- Effective communication (SBAR: Situation, Background, Assessment, Recommendation)\n- Delegation of tasks\n- Conflict resolution\n- Staff development and mentoring\n\n**Quality Improvement:**\n- Audit cycle\n- Clinical governance\n- Patient satisfaction surveys\n- Evidence-based protocol development`
  }

  if (q.includes('safe motherhood') || q.includes('maternal mortality') || q.includes('mdg') || q.includes('sdg')) {
    return `**Safe Motherhood Programme:**\n\n**Goal:** Reduce maternal and neonatal mortality\n\n**MDG 5 (Millennium Development Goals):**\n- Improve maternal health\n- Target: Reduce maternal mortality by 75% between 1990-2015\n- Progress: Reduced by 45% globally\n\n**SDG 3.1:**\n- Reduce global maternal mortality to less than 70 per 100,000 live births by 2030\n\n**Key Strategies:**\n- Skilled birth attendance at every delivery\n- Emergency obstetric care (EmOC)\n- Antenatal care (4+ visits)\n- Postnatal care\n- Family planning\n- Prevention of unsafe abortion\n\n**Nigeria Context:**\n- Maternal mortality: ~576 per 100,000 live births\n- Leading causes: Haemorrhage, sepsis, hypertensive disorders\n- Barriers: Poverty, cultural beliefs, distance, inadequate facilities`
  }

  if (q.includes('perioperative') || q.includes('caesarean') || q.includes('surgery')) {
    return `**Perioperative Nursing in Midwifery:**\n\n**Caesarean Section Indications:**\n- Previous C-section (depending on type)\n- Malpresentation/breech\n- Fetal distress\n- Placenta previa\n- Failed induction\n- Cephalopelvic disproportion (CPD)\n\n**Pre-operative:**\n- Informed consent\n- NPO (nil per os) 6-8 hours\n- Skin preparation\n- IV access\n- Blood grouping and crossmatch\n- Fetal monitoring\n\n**Post-operative:**\n- Monitor vital signs every 15 min x4, then hourly\n- Assess wound and dressing\n- Monitor lochia (may be less than vaginal delivery)\n- Encourage early ambulation (6-8 hours)\n- Pain management\n- Wound care: keep clean and dry\n- Remove sutures: Day 7 (if non-absorbable)`
  }

  if (q.includes('male') || q.includes('vasectomy') || q.includes('male reproductive')) {
    return `**Male Reproductive Health:**\n\n**Male Reproductive Anatomy:**\n- Testes: Produce sperm and testosterone\n- Epididymis: Sperm maturation and storage\n- Vas deferens: Transport sperm\n- Seminal vesicles + Prostate: Produce seminal fluid\n- Penis: Copulatory organ\n\n**Male Infertility:**\n- Causes: Low sperm count, abnormal morphology, erectile dysfunction\n- Investigations: Semen analysis (WHO criteria)\n- Treatment: Lifestyle changes, medication, assisted reproduction\n\n**Vasectomy:**\n- Permanent male contraception\n- Procedure: Cut and seal vas deferens\n- Effective after: 12-16 weeks (clear sperm via ejaculation)\n- Success rate: >99%\n- Does NOT protect against STIs\n\n**Partner Counselling:**\n- Discuss both partners' fertility\n- Emotional support\n- Alternatives to vasectomy\n- Reversal success rate: 40-90%`
  }

  if (q.includes('cervical screening') || q.includes('pap smear') || q.includes('cervical cancer')) {
    return `**Cervical Screening:**\n\n**Purpose:** Early detection of cervical cancer and precancerous changes\n\n**Screening Methods:**\n- Pap smear (cytology)\n- HPV testing\n- Visual inspection with acetic acid (VIA) - common in low-resource settings\n\n**Screening Schedule:**\n- Start: 21 years old or 3 years after sexual debut\n- Every 3 years: Pap smear alone\n- Every 5 years: Pap + HPV co-testing (30-65 years)\n\n**HPV (Human Papillomavirus):**\n- Types 16 and 18 cause 70% of cervical cancers\n- Vaccination recommended: ages 9-26\n\n**Abnormal Results:**\n- ASCUS: Repeat in 1-2 years\n- LSIL: Colposcopy\n- HSIL: Colposcopy + biopsy\n- Cancer: Staging and treatment\n\n**VIA (Visual Inspection):**\n- Apply 3-5% acetic acid\n- White epithelium = positive (screen for colposcopy)`
  }

  if (q.includes('obstructed labour') || q.includes('cpd') || q.includes('cephalopelvic')) {
    return `**Obstructed Labour:**\n\n**Definition:** Failure to progress in labour due to mechanical problems despite good uterine contractions.\n\n**Causes:**\n- **Maternal:** CPD, pelvic abnormalities, soft tissue dystocia\n- **Fetal:** Malpresentation, macrosomia, hydrocephalus\n\n**Signs:**\n- Failure of cervical dilatation (1cm/hr in active phase)\n- Failure of descent\n- Maternal distress\n- Signs of uterine rupture (bandl's ring, maternal tachycardia)\n\n**Management:**\n- Cephalopelvic disproportion: C-section\n- Obstruction due to malpresentation: Reposition or C-section\n- Uterine rupture: Emergency laparotomy\n\n**Complications:**\n- Uterine rupture\n- Vesicovaginal fistula (VVF)\n- Fetal hypoxia and death\n- Postpartum haemorrhage`
  }

  if (q.includes('multip') || q.includes('twin') || q.includes('multiple pregnancy')) {
    return `**Multiple Pregnancy:**\n\n**Types:**\n- Dizygotic (fraternal): 2 eggs, 2 placentas\n- Monozygotic (identical): 1 egg, varies by timing of split\n\n**Incidence:**\n- Spontaneous: 1 in 80 pregnancies\n- Assisted reproduction: much higher\n\n**Increased Risk:**\n- Preterm labour\n- Pre-eclampsia\n- Gestational diabetes\n- Placenta previa\n- IUGR (especially TTTS)\n\n**Monitoring:**\n- More frequent antenatal visits\n- Ultrasound every 4 weeks\n- Monitor for TTTS (twin-to-twin transfusion syndrome)\n\n**Delivery:**\n- Most twins can be delivered vaginally\n- First twin: vertex presentation\n- Second twin: may need assistance\n- C-section if malpresentation or complications`
  }

  if (q.includes('uterine inversion') || q.includes('inversion')) {
    return `**Uterine Inversion:**\n\n**Definition:** The uterus turns inside out, usually after delivery.\n\n**Types:**\n- 1st degree: Fundus invaginates to cervix\n- 2nd degree: Fundus passes through cervix\n- 3rd degree: Complete inversion outside vagina\n\n**Causes:**\n- Excessive cord traction\n- Fundal pressure\n- Short cord\n- Placenta accreta\n\n**Signs:**\n- Sudden severe pain\n- Postpartum haemorrhage\n- Shock (out of proportion to blood loss)\n- Palpable mass at vaginal introitus\n\n**Emergency Management:**\n1. Call for help\n2. Treat shock (IV fluids, blood)\n3. Replace uterus immediately (before placenta removal)\n4. Oxytocin after replacement\n5. Antibiotics\n6. Manual removal only if replacement fails`
  }

  if (q.includes('breast engorgement') || q.includes('engorgement') || q.includes('blocked duct')) {
    return `**Breast Engorgement:**\n\n**Definition:** Overfilling of breast with milk, usually Day 3-5 postpartum.\n\n**Symptoms:**\n- Swollen, firm, painful breasts\n- Warm and tender\n- Difficulty latching\n- Low-grade fever\n\n**Management:**\n- Frequent feeding (8-12 times/day)\n- Warm compress before feeding\n- Cold compress after feeding\n- Gentle massage\n- Express if baby cannot latch\n- Analgesics (paracetamol, ibuprofen)\n\n**Blocked Duct:**\n- Tender, firm lump in breast\n- Continue feeding from affected side\n- Warm compress\n- Massage toward nipple\n- Antibiotics if develops into mastitis\n\n**Mastitis:**\n- Inflammation of breast tissue\n- Symptoms: redness, swelling, warmth, fever, flu-like symptoms\n- Treatment: Antibiotics (flucloxacillin), continue feeding, rest`
  }

  if (q.includes('foetal') || q.includes('fetal') || q.includes('fetal distress')) {
    return `**Fetal Distress:**\n\n**Definition:** Compromise of the fetus before, during, or after delivery.\n\n**Signs:**\n- Abnormal fetal heart rate (<110 or >160 bpm)\n- Meconium-stained liquor\n- Decreased fetal movements\n- Acidotic fetal blood (pH <7.2)\n\n**Causes:**\n- Cord prolapse/compression\n- Placental abruption\n- Maternal hypotension\n- Uterine hyperstimulation\n- Fetal anaemia\n\n**Management:**\n- Left lateral position\n- IV fluids\n- Stop oxytocin if running\n- Oxygen to mother\n- Prepare for emergency delivery\n- Continuous fetal monitoring\n\n**Cardiotocography (CTG):**\n- Baseline FHR: 110-160 bpm\n- Variability: 5-25 bpm (reassuring)\n- Accelerations: Present (reassuring)\n- Decelerations: Early (head compression), Late (placental insufficiency), Variable (cord compression)`
  }

  if (q.includes('lochia') || q.includes('involution') || q.includes('postnatal')) {
    return `**Normal Puerperium (Postnatal Care):**\n\n**Involution:**\n- Uterus involutes ~1cm per day\n- By Day 10: uterus not palpable above symphysis\n- By 6 weeks: returns to pre-pregnancy size\n\n**Lochia Stages:**\n- **Lochia rubra** (Day 1-4): Dark red, blood + decidua\n- **Lochia serosa** (Day 4-10): Brown/pink serous fluid\n- **Lochia alba** (Day 10+): White/yellowish, scant\n\n**Postnatal Assessment:**\n- Vital signs (BP, pulse, temperature)\n- Fundal height and tone\n- Lochia amount, colour, odour\n- Perineal assessment (tears/episiotomy)\n- Breast assessment\n- Emotional wellbeing\n- Urination and bowel function\n\n**Danger Signs (to report):**\n- Heavy lochia (soaking pad in <1 hour)\n- Foul-smelling lochia\n- Fever >38°C\n- Severe headache\n- Breast redness/pain`
  }

  if (q.includes('umbilical cord') || q.includes('cord care')) {
    return `**Umbilical Cord Care:**\n\n**Clamping:**\n- Delayed cord clamping: 1-3 minutes (WHO recommendation)\n- Benefits: Increased iron stores, reduced anaemia\n- Immediate clamping: Only if baby needs resuscitation\n\n**Cutting:**\n- Sterile scissors and clamps\n- Cut 2-3cm from base\n- Two clamps applied before cutting\n\n**Cord Care:**\n- Keep clean and dry\n- Fold diaper below cord stump\n- No application of substances (traditional practices)\n- Dry cord care (WHO recommendation)\n- Cord falls off: Day 7-14\n\n**Signs of Infection:**\n- Redness at base\n- Purulent discharge\n- Foul smell\n- Baby fever/lethargic\n\n**When to Seek Help:**\n- Bleeding from cord stump\n- Signs of infection\n- Cord not fallen off by Day 21`
  }

  if (q.includes('iron') || q.includes('anaemia') || q.includes('anemia')) {
    return `**Anaemia in Pregnancy:**\n\n**Definition:** Hb <11 g/dL in first trimester, <10.5 g/dL in 2nd/3rd trimester\n\n**Types:**\n- Iron deficiency (most common)\n- Folate deficiency\n- Vitamin B12 deficiency\n- Haemolytic anaemia\n- Physiological (dilutional)\n\n**Causes:**\n- Increased blood volume\n- Dietary deficiency\n- Chronic disease\n- Malaria\n- Repeated pregnancies\n\n**Assessment:**\n- Pallor (conjunctiva, palms, nail beds)\n- Fatigue, weakness\n- Tachycardia\n- Dizziness\n\n**Management:**\n- Iron supplementation: 60-120mg elemental iron daily\n- Folic acid: 5mg daily\n- Dietary advice: iron-rich foods\n- Severe anaemia: IV iron or blood transfusion\n- Treat underlying cause (malaria prophylaxis)`
  }

  if (q.includes('foetal movements') || q.includes('fetal movements') || q.includes('kick count')) {
    return `**Fetal Movements:**\n\n**When Felt:**\n- Primigravida: 18-20 weeks\n- Multigravida: 16-18 weeks\n\n**Assessment:**\n- Mother counts movements daily (from 28 weeks)\n- Normal: ≥10 movements in 2 hours\n- Decreased movements: Possible fetal compromise\n\n**Decreased Fetal Movements:**\n- Common causes: Fetal sleep, maternal activity\n- Serious causes: Fetal distress, IUGR, oligohydramnios\n- Assessment: CTG, ultrasound, biophysical profile\n\n**Management:**\n- Maternal position: Left lateral\n- Cold drink or food\n- Count for 1-2 hours\n- If <10 movements: urgent assessment\n- CTG monitoring\n- Ultrasound if needed`
  }

  if (q.includes('folic acid') || q.includes('supplement') || q.includes('iron supplement')) {
    return `**Supplements in Pregnancy:**\n\n**Folic Acid:**\n- Dose: 400-800mcg daily (before conception and first trimester)\n- Purpose: Prevent neural tube defects (spina bifida, anencephaly)\n- High risk: 5mg daily (previous NTD, epilepsy, diabetes)\n\n**Iron:**\n- Dose: 60-120mg elemental iron daily\n- Start: From 12 weeks (routine)\n- Anaemia: Higher dose, may need IV iron\n- Take on empty stomach with vitamin C\n\n**Calcium:**\n- Dose: 1500-2000mg daily (if dietary intake low)\n- Purpose: Prevent pre-eclampsia, fetal bone development\n\n**Vitamin D:**\n- Dose: 10-20mcg daily\n- Purpose: Bone health, immune function\n\n**Iodine:**\n- Purpose: Prevent cretinism, intellectual disability\n\n**Other:**\n- Omega-3: Brain and eye development\n- Vitamin C: Iron absorption`
  }

  if (q.includes('candida') || q.includes('thrush') || q.includes('vaginal infection')) {
    return `**Vaginal Infections in Pregnancy:**\n\n**Candidiasis (Thrush):**\n- Cause: Candida albicans (overgrowth)\n- Symptoms: White, thick, "cottage cheese" discharge\n- Intense itching\n- Burning during urination\n- Treatment: Topical azoles (clotrimazole), oral fluconazole\n\n**Bacterial Vaginosis:**\n- Cause: Overgrowth of Gardnerella vaginalis\n- Symptoms: Grey-white discharge, fishy odour\n- Treatment: Metronidazole\n\n**Trichomoniasis:**\n- Cause: Trichomonas vaginalis (STI)\n- Symptoms: Frothy, green-yellow discharge, malodorous\n- Treatment: Metronidazole (both partners)\n\n**Important:**\n- Vaginal discharge changes in pregnancy (normal leucorrhoea)\n- Treat symptomatic infections\n- Screen for STIs in antenatal care`
  }

  if (q.includes('epidural') || q.includes('analgesia') || q.includes('pain relief')) {
    return `**Pain Management in Labour:**\n\n**Non-Pharmacological:**\n- Breathing techniques\n- Massage and counter-pressure\n- Hydrotherapy (warm bath/shower)\n- Position changes\n- TENS machine\n- Hypnobirthing\n\n**Pharmacological:**\n- **Entonox** (50% N2O + 50% O2): Self-administered, quick onset\n- **Pethidine** 100mg IM: Reduces anxiety, may cause drowsiness\n- **Epidural:** Most effective, regional anaesthesia\n  - Continuous infusion or patient-controlled\n  - Risks: Hypotension, headache, urinary retention\n  - Can be extended for C-section\n\n**Epidural Setup:**\n- L3-L4 or L4-L5 interspace\n- Local anaesthetic + opioid\n- Test dose before bolus\n- Monitor BP every 5 minutes for 15 minutes\n\n**Contraindications:**\n- Patient refusal\n- Coagulopathy\n- Infection at insertion site\n- Severe hypovolaemia`
  }

  return `That's a great midwifery question! Let me help you understand this topic.\n\nBased on your question about "${question.substring(0, 50)}...", here are the key points to consider:\n\n1. **Foundation Knowledge**: Make sure you understand the basic anatomy and physiology involved\n2. **Clinical Application**: Think about how this applies in real midwifery practice\n3. **NMCN Relevance**: This topic is commonly tested in professional examinations\n\n**Study Tips:**\n- Use mnemonics to remember key points\n- Practice with past questions on this topic\n- Connect this knowledge to clinical scenarios\n\nWould you like me to explain any specific aspect in more detail? You can also ask about related topics like obstetric emergencies, normal labour management, or pharmacology.`
}
