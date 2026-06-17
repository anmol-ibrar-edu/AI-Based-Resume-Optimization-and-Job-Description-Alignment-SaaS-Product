"""
File: ml/ai_generator.py
Purpose: Calls the Gemini API to perform intelligent ATS analysis, generate
         improved resume summaries, and produce actionable recommendations.
         Falls back gracefully to the local ML engine if the API is unavailable.
"""
import json
import re
from typing import Dict, Any, Optional, List
from app.config import settings
import httpx

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.0-flash:generateContent?key={key}"
)


class AIGenerator:
    """Calls Gemini for resume analysis and summary generation."""

    def __init__(self):
        self.google_api_key = settings.GOOGLE_API_KEY

    # ─────────────────────────────────────────────────────────────────────────
    # Public API
    # ─────────────────────────────────────────────────────────────────────────

    async def analyze_ats_match(
        self, resume_text: str, job_text: str
    ) -> Optional[Dict[str, Any]]:
        """
        Full ATS analysis via Gemini.
        Returns a dict with: ats_score, score_breakdown, matched_skills,
        missing_skills, extra_skills, matched_keywords, missing_keywords,
        recommendations, improved_summary.
        Returns None on any failure (triggers local ML fallback).
        """
        if not self.google_api_key or not resume_text or not job_text:
            return None

        prompt = self._build_ats_prompt(resume_text, job_text)
        raw = await self._call_gemini(prompt, max_tokens=2000, temperature=0.1,
                                      json_mode=True)
        if raw is None:
            return None

        result = self._parse_json(raw)
        if result and "ats_score" in result and "matched_skills" in result:
            # Deduplicate all skill lists returned by Gemini
            result["matched_skills"] = self._dedup(result.get("matched_skills", []))
            result["missing_skills"] = self._dedup(result.get("missing_skills", []))
            # Remove any missing skills that are already in matched
            matched_lower = {s.lower() for s in result["matched_skills"]}
            result["missing_skills"] = [
                s for s in result["missing_skills"]
                if s.lower() not in matched_lower
            ]
            result["extra_skills"] = self._dedup(result.get("extra_skills", []))
            result["matched_keywords"] = self._dedup(result.get("matched_keywords", []))
            result["missing_keywords"] = self._dedup(result.get("missing_keywords", []))
            matched_kw_lower = {k.lower() for k in result["matched_keywords"]}
            result["missing_keywords"] = [
                k for k in result["missing_keywords"]
                if k.lower() not in matched_kw_lower
            ]
            # Deduplicate recommendations (remove exact or near-duplicate sentences)
            result["recommendations"] = self._dedup_recommendations(
                result.get("recommendations", [])
            )
            return result
        return None

    async def generate_summary(self, data: Dict[str, Any]) -> str:
        """Generate a professional resume summary. Falls back to rule-based."""
        if not self.google_api_key:
            return self._fallback_summary(data)
        prompt = self._build_summary_prompt(data)
        result = await self._call_gemini(prompt, max_tokens=200, temperature=0.6)
        if result:
            return result.strip().strip('"')
        return self._fallback_summary(data)

    # ─────────────────────────────────────────────────────────────────────────
    # Prompt Builders
    # ─────────────────────────────────────────────────────────────────────────

    def _build_ats_prompt(self, resume_text: str, job_text: str) -> str:
        return f"""You are a senior ATS (Applicant Tracking System) expert and career coach.
Analyze the candidate's resume against the job description below.

═══════════════════════════════
JOB DESCRIPTION
═══════════════════════════════
{job_text[:3500]}

═══════════════════════════════
CANDIDATE RESUME
═══════════════════════════════
{resume_text[:3500]}

═══════════════════════════════
INSTRUCTIONS
═══════════════════════════════
Return ONLY a single valid JSON object (no markdown, no explanation, no extra text).
Use EXACTLY this structure:

{{
  "ats_score": <integer 0-100>,
  "score_breakdown": {{
    "skills_score": <integer 0-100>,
    "experience_score": <integer 0-100>,
    "keywords_score": <integer 0-100>,
    "format_score": <integer 0-100>,
    "achievements_score": <integer 0-100>
  }},
  "matched_skills": [<skills explicitly present in BOTH resume AND job — unique list, no duplicates>],
  "missing_skills": [<skills required by the job but NOT in the resume — unique, no overlap with matched_skills>],
  "extra_skills": [<skills in resume but NOT mentioned in job — unique list>],
  "matched_keywords": [<important job keywords found in resume — unique>],
  "missing_keywords": [<important job keywords missing from resume — unique, no overlap with matched_keywords>],
  "recommendations": [
    {{
      "priority": "high|medium|low",
      "category": "skills|experience|keywords|format|achievements",
      "title": "<short action title, max 10 words>",
      "message": "<specific, actionable advice referencing the actual job or resume — 1-2 sentences, unique>",
      "details": "<concrete example or next step — different from message>"
    }}
  ],
  "improved_summary": "<2-3 sentence professional summary tailored to this specific job, using active voice, no 'I/me/my'>"
}}

STRICT RULES:
- Every list must be deduplicated — the same skill/keyword must appear AT MOST ONCE across all lists.
- matched_skills and missing_skills must be MUTUALLY EXCLUSIVE.
- matched_keywords and missing_keywords must be MUTUALLY EXCLUSIVE.
- Provide 5-8 unique, specific recommendations. Each must address a DIFFERENT issue.
- Do NOT repeat the same advice across recommendations even with different wording.
- Scores must reflect the actual match quality — be critical and accurate.
- improved_summary must be specifically tailored to the job title and requirements above.
"""

    def _build_summary_prompt(self, data: Dict[str, Any]) -> str:
        title = data.get("title") or "Professional"
        skills = data.get("skills", [])
        experience = data.get("experience", [])
        recent_roles = [e.get("title", "") for e in experience[:2] if e.get("title")]
        return f"""Write a concise, highly professional 2-3 sentence resume summary for a {title}.
Rules: no "I/me/my", active voice, strong action verbs, no clichés like "passionate" or "dynamic".
Skills: {', '.join(skills[:8]) if skills else 'various technical skills'}
Recent roles: {', '.join(recent_roles) if recent_roles else 'varied positions'}
Output ONLY the summary text. No quotes, no intro, nothing else."""

    # ─────────────────────────────────────────────────────────────────────────
    # Gemini API Call
    # ─────────────────────────────────────────────────────────────────────────

    async def _call_gemini(
        self,
        prompt: str,
        max_tokens: int = 1000,
        temperature: float = 0.2,
        json_mode: bool = False,
    ) -> Optional[str]:
        url = GEMINI_URL.format(key=self.google_api_key)
        generation_config: Dict[str, Any] = {
            "temperature": temperature,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": max_tokens,
        }
        if json_mode:
            generation_config["responseMimeType"] = "application/json"

        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": generation_config,
        }
        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                response = await client.post(url, json=payload)
            if response.status_code != 200:
                print(f"Gemini API error {response.status_code}: {response.text[:300]}")
                return None
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            print(f"Gemini call failed: {e}")
            return None

    # ─────────────────────────────────────────────────────────────────────────
    # Helpers
    # ─────────────────────────────────────────────────────────────────────────

    @staticmethod
    def _parse_json(text: str) -> Optional[Dict]:
        text = text.strip()
        # Strip markdown fences if present
        text = re.sub(r"^```json\s*", "", text, flags=re.IGNORECASE)
        text = re.sub(r"^```\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
        try:
            return json.loads(text)
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e} — raw: {text[:200]}")
            return None

    @staticmethod
    def _dedup(lst: List[str]) -> List[str]:
        seen: set = set()
        out: List[str] = []
        for item in (lst or []):
            key = item.lower().strip()
            if key and key not in seen:
                seen.add(key)
                out.append(item)
        return out

    @staticmethod
    def _dedup_recommendations(recs) -> list:
        """Remove duplicate recommendations based on message similarity."""
        seen_messages: set = set()
        unique = []
        for rec in (recs or []):
            if isinstance(rec, dict):
                msg = rec.get("message", "").lower().strip()
            else:
                msg = str(rec).lower().strip()
            # Use first 60 chars as fingerprint
            fingerprint = msg[:60]
            if fingerprint not in seen_messages:
                seen_messages.add(fingerprint)
                unique.append(rec)
        return unique

    @staticmethod
    def _fallback_summary(data: Dict[str, Any]) -> str:
        title = (data.get("title") or "Professional").strip()
        skills = data.get("skills", [])
        if len(skills) >= 3:
            skill_str = f"expertise in {skills[0]}, {skills[1]}, and {skills[2]}"
        elif skills:
            skill_str = f"expertise in {skills[0]}"
        else:
            skill_str = "strong analytical and problem-solving skills"
        return (
            f"Results-oriented {title} with {skill_str}. "
            f"Proven ability to deliver high-quality solutions that drive measurable "
            f"business outcomes and contribute to organizational success."
        )


# Singleton
ai_generator = AIGenerator()
