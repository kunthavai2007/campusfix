/**
 * AI Service for CampusFix AI
 * Supports Google Gemini API (when GEMINI_API_KEY is provided)
 * and an intelligent deterministic rule-based fallback analyzer.
 */

export async function analyzeComplaintWithAI(complaint) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 0 && apiKey !== 'your_gemini_api_key_here') {
    try {
      const geminiResult = await callGeminiAPI(complaint, apiKey.trim());
      if (geminiResult && geminiResult.category && geminiResult.priority) {
        return {
          ...geminiResult,
          source: 'Gemini AI',
        };
      }
    } catch (error) {
      console.warn('⚠️ Gemini API request failed, switching to deterministic fallback analyzer:', error.message);
    }
  }

  // Fallback to deterministic analyzer
  const fallbackResult = deterministicFallbackAnalyzer(complaint);
  return {
    ...fallbackResult,
    source: 'Deterministic AI Engine (Fallback)',
  };
}

/**
 * Calls the Google Gemini API with structured JSON output formatting
 */
async function callGeminiAPI(complaint, apiKey) {
  const prompt = `You are the lead AI triage system for CampusFix AI (a college complaint management system).
Analyze the following student campus complaint and return a strictly valid JSON object.

Complaint Details:
- Title: "${complaint.title || ''}"
- Description: "${complaint.description || ''}"
- Student-Selected Category: "${complaint.category || 'Other'}"
- Location: "${complaint.location || 'Unknown'}"

Allowed Categories:
"Classroom", "Laboratory", "Hostel", "WiFi / Network", "Infrastructure", "Transportation", "Cleanliness", "Library", "Other"

Allowed Priorities:
"Low", "Medium", "High", "Critical"

Expected JSON Schema:
{
  "category": "<One of the allowed categories>",
  "priority": "<One of the allowed priorities>",
  "department": "<Responsible campus department, e.g. IT Support, Facilities & Maintenance, Hostel Administration, AV Support, Sanitation>",
  "summary": "<Short concise 1-sentence summary of the core issue>",
  "suggestedAction": "<Actionable next step for the response team>"
}

Only return raw JSON without Markdown formatting or backticks if possible.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        maxOutputTokens: 600,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API HTTP ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Empty response from Gemini API');
  }

  // Parse JSON
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  const parsed = JSON.parse(cleaned);

  // Validate allowed priority
  const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
  let priority = parsed.priority || 'Medium';
  if (!validPriorities.includes(priority)) {
    const matched = validPriorities.find(p => p.toLowerCase() === priority.toLowerCase());
    priority = matched || 'Medium';
  }

  return {
    category: parsed.category || complaint.category || 'Other',
    priority,
    department: parsed.department || 'Campus Facilities',
    summary: parsed.summary || `${complaint.title} at ${complaint.location}`,
    suggestedAction: parsed.suggestedAction || 'Campus staff should inspect the reported area.',
  };
}

/**
 * Deterministic rule-based fallback analyzer that matches exact specifications
 */
export function deterministicFallbackAnalyzer(complaint) {
  const text = `${complaint.title || ''} ${complaint.description || ''} ${complaint.location || ''}`.toLowerCase();

  let category = complaint.category || 'Other';
  let department = 'General Administration';
  let priority = 'Medium';
  let summary = '';
  let suggestedAction = '';

  // 1. Department and Category Detection
  if (/\b(wifi|wi-fi|internet|network|router|ethernet|slow internet|broadband|dns|ping|access point)\b/i.test(text)) {
    category = 'WiFi / Network';
    department = 'IT Support';
    suggestedAction = 'IT support team should inspect the network access points and verify gateway connectivity.';
  } else if (/\b(computer|pc|laptop|workstation|lab|laboratory|system|terminal|monitor|cpu|mouse|keyboard|coding|robotics)\b/i.test(text)) {
    category = 'Laboratory';
    department = 'Lab Technician & IT Hardware';
    suggestedAction = 'Lab technician should run hardware diagnostics and check system configurations.';
  } else if (/\b(water|pipe|leak|leaking|leakage|bathroom|washroom|toilet|tap|sink|drainage|flush|plumbing)\b/i.test(text)) {
    category = 'Infrastructure';
    department = 'Maintenance & Plumbing Team';
    suggestedAction = 'Plumbing maintenance should inspect pipe seals and shut off affected riser valves.';
  } else if (/\b(electrical|electricity|power|short circuit|spark|shock|light|fan|ac|air conditioner|switch|socket|wire|blackout)\b/i.test(text)) {
    category = 'Infrastructure';
    department = 'Electrical Maintenance Department';
    suggestedAction = 'Certified electrician must inspect power breakers and repair faulty wiring.';
  } else if (/\b(hostel|room|mess|warden|dining|cafeteria|food|dorm|bed|mattress)\b/i.test(text)) {
    category = 'Hostel';
    department = 'Hostel Administration';
    suggestedAction = 'Hostel warden and floor supervisors should visit the room and initiate immediate repairs.';
  } else if (/\b(bus|transport|shuttle|commute|parking|driver|van|vehicle|traffic)\b/i.test(text)) {
    category = 'Transportation';
    department = 'Transport Department';
    suggestedAction = 'Transport manager should review route schedules and dispatch replacement vehicle.';
  } else if (/\b(projector|classroom|podium|desk|bench|blackboard|whiteboard|mic|speaker|board|audio|visual)\b/i.test(text)) {
    category = 'Classroom';
    department = 'AV Support & Classroom Facilities';
    suggestedAction = 'Facilities team should test projector lamp/cables and replace defective equipment.';
  } else if (/\b(clean|cleanliness|garbage|trash|dustbin|dirty|sweeping|stink|smell|litter|hygiene)\b/i.test(text)) {
    category = 'Cleanliness';
    department = 'Sanitation & Housekeeping';
    suggestedAction = 'Housekeeping staff should deploy a cleaning crew to sanitize and clear the area.';
  } else if (/\b(book|library|journal|reading room|librarian|borrow|shelf)\b/i.test(text)) {
    category = 'Library';
    department = 'Library Administration';
    suggestedAction = 'Library staff should inspect catalog records and resolve facility complaints.';
  }

  // 2. Priority Rules
  // Critical: danger, fire, electrical, emergency, unsafe, spark, shock, explosion, flood
  if (/\b(danger|dangerous|fire|electrical hazard|emergency|unsafe|spark|sparking|shock|hazard|smoke|explosion|flood|burst|gas leak)\b/i.test(text)) {
    priority = 'Critical';
  }
  // High: not working, broken, multiple students, urgent, exam, leaking, down, failed, completely, severe
  else if (/\b(not working|broken|multiple students|urgent|exam|leaking|leakage|down|failed|unreachable|outage|many students|everyone)\b/i.test(text)) {
    priority = 'High';
  }
  // Low: suggestion, feedback, idea, minor, improvement, cosmetic, request, prefer, optional
  else if (/\b(suggestion|suggest|feedback|idea|minor|improvement|cosmetic|request|prefer|optional|enhancement|query)\b/i.test(text)) {
    priority = 'Low';
  }
  // Medium: default for normal complaints
  else {
    priority = 'Medium';
  }

  // 3. Summary Construction
  const title = complaint.title || 'Campus Issue';
  const location = complaint.location ? ` in ${complaint.location}` : '';
  if (category === 'WiFi / Network') {
    summary = `WiFi connectivity is unavailable or degraded${location}.`;
  } else if (category === 'Hostel') {
    summary = `Hostel facility issue reported${location} requiring prompt attention.`;
  } else if (category === 'Laboratory') {
    summary = `Hardware/software disruption on laboratory equipment${location}.`;
  } else if (category === 'Infrastructure') {
    summary = `Infrastructure maintenance defect detected${location}.`;
  } else if (category === 'Classroom') {
    summary = `Classroom audio-visual or seating impediment${location}.`;
  } else {
    summary = `${title}${location}.`;
  }

  if (!suggestedAction) {
    suggestedAction = `${department} should inspect the reported location and resolve the issue.`;
  }

  return {
    category,
    priority,
    department,
    summary,
    suggestedAction,
  };
}
