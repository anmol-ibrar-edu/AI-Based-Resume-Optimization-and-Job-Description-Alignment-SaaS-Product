"""
File: ml/resume_parser.py
Purpose: Extracts text and structured data (skills, experience, education, etc.) from PDF and DOCX resume files using PyMuPDF and python-docx.
Missing Impact: The system would be unable to read or process any uploaded resumes, effectively breaking the entire application's data pipeline.
"""
import re
import os
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import fitz  # PyMuPDF
from docx import Document

from app.ml.skills_database import find_skills_in_text, categorize_skills
from app.ml.resume_validator import ResumeValidator


class ResumeParser:
    """
    Complete resume parser that extracts structured data from PDF/DOCX resumes
    
    Features:
    - Text extraction from PDF/DOCX
    - Contact information extraction
    - Skills extraction (1500+ skills)
    - Experience extraction with dates
    - Education extraction
    - Certification extraction
    - Project extraction
    - Resume validation integration
    """
    
    def __init__(self, use_api: bool = False):
        """
        Initialize parser
        
        Args:
            use_api: Whether to use AI APIs for enhanced parsing (optional)
        """
        self.validator = ResumeValidator()
        self.use_api = use_api
        
        # Section headers patterns
        self.section_patterns = {
            "experience": [
                r'(?:professional\s+)?(?:work\s+)?experience',
                r'employment(?:\s+history)?',
                r'work\s+history',
                r'career\s+history',
                r'professional\s+background',
            ],
            "education": [
                r'education(?:al\s+background)?',
                r'academic\s+(?:background|qualifications)',
                r'qualifications',
            ],
            "skills": [
                r'(?:technical\s+)?skills',
                r'core\s+competencies',
                r'expertise',
                r'technologies',
            ],
            "projects": [
                r'projects?',
                r'portfolio',
                r'personal\s+projects',
            ],
            "certifications": [
                r'certifications?',
                r'certificates?',
                r'licenses?',
                r'credentials?',
            ],
            "summary": [
                r'(?:professional\s+)?summary',
                r'profile',
                r'objective',
                r'about\s+me',
            ],
        }
    
    def parse(self, file_path: str, file_type: str = None) -> Tuple[str, Dict]:
        """
        Complete parsing pipeline
        
        Args:
            file_path: Path to resume file
            file_type: File extension (pdf/docx), auto-detected if None
            
        Returns:
            Tuple of (raw_text, parsed_data dict)
        """
        # Extract text
        raw_text = self.extract_text(file_path, file_type)
        
        # Validate
        validation = self.validator.validate(raw_text)
        
        if not validation["is_valid"]:
            return raw_text, {
                "is_valid": False,
                "validation_message": validation["reason"],
                "issues": validation["issues"],
                "suggestions": validation["suggestions"],
            }
        
        # Extract all sections
        parsed_data = {
            "is_valid": True,
            "validation_message": "Valid resume detected",
            "validation_confidence": validation["confidence"],
            "raw_text": raw_text,
            "contact_info": self.extract_contact_info(raw_text),
            "summary": self.extract_summary(raw_text),
            "skills": self.extract_skills(raw_text),
            "experience": self.extract_experience(raw_text),
            "education": self.extract_education(raw_text),
            "certifications": self.extract_certifications(raw_text),
            "projects": self.extract_projects(raw_text),
            "total_experience_years": 0,  # Calculated from experience
            "parsing_confidence": 0.85,
        }
        
        # Calculate total experience
        parsed_data["total_experience_years"] = self._calculate_total_experience(parsed_data["experience"])
        
        return raw_text, parsed_data
    
    def extract_text(self, file_path: str, file_type: str = None) -> str:
        """
        Extract text from PDF or DOCX file
        
        Args:
            file_path: Path to file
            file_type: File type (pdf/docx)
            
        Returns:
            Extracted text
        """
        if not file_type:
            file_type = os.path.splitext(file_path)[1].lower().replace('.', '')
        
        try:
            if file_type == 'pdf':
                return self._extract_from_pdf(file_path)
            elif file_type in ['docx', 'doc']:
                return self._extract_from_docx(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_type}")
        except Exception as e:
            raise Exception(f"Failed to extract text: {str(e)}")
    
    def _extract_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF using PyMuPDF, with OCR fallback for image-based PDFs"""
        try:
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                # sort=True reads blocks in reading order (top→bottom, left→right)
                # which fixes multi-column and designed/template PDFs
                page_text = page.get_text("text", sort=True)
                if page_text.strip():
                    text += page_text
            doc.close()

            # Fallback to OCR for scanned/image-only PDFs
            if not text.strip():
                text = self._extract_with_ocr(file_path)

            return text.strip()
        except Exception as e:
            raise Exception(f"PDF extraction failed: {str(e)}")

    def _extract_with_ocr(self, file_path: str) -> str:
        """Use OCR to extract text from image-based (scanned) PDFs"""
        try:
            import pytesseract
            from PIL import Image
            import io

            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                # 150 DPI is sufficient for OCR and avoids OOM on large pages
                mat = fitz.Matrix(150 / 72, 150 / 72)
                pix = page.get_pixmap(matrix=mat)
                img = Image.open(io.BytesIO(pix.tobytes("png")))
                page_text = pytesseract.image_to_string(img, lang="eng", config="--psm 1")
                if page_text.strip():
                    text += page_text + "\n"
            doc.close()
            return text.strip()
        except Exception as e:
            raise Exception(f"OCR extraction failed: {str(e)}")
    
    def _extract_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX"""
        try:
            doc = Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text.strip()
        except Exception as e:
            raise Exception(f"DOCX extraction failed: {str(e)}")
    
    def extract_contact_info(self, text: str) -> Dict:
        """
        Extract contact information
        
        Returns:
            Dict with name, email, phone, linkedin, github, location
        """
        contact = {
            "name": self._extract_name(text),
            "email": self._extract_email(text),
            "phone": self._extract_phone(text),
            "linkedin": self._extract_linkedin(text),
            "github": self._extract_github(text),
            "location": self._extract_location(text),
            "website": self._extract_website(text),
        }
        
        return {k: v for k, v in contact.items() if v}  # Remove None values
    
    def _extract_name(self, text: str) -> Optional[str]:
        """Extract candidate name (usually first line)"""
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        if lines:
            # First non-empty line is usually the name
            first_line = lines[0]
            # Should be 2-5 words, no numbers
            if 5 < len(first_line) < 50 and not any(char.isdigit() for char in first_line):
                return first_line
        return None
    
    def _extract_email(self, text: str) -> Optional[str]:
        """Extract email address"""
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        match = re.search(email_pattern, text)
        return match.group(0) if match else None
    
    def _extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number"""
        phone_patterns = [
            r'[\+]?[1-9][0-9]{0,2}[-\s\.]?\(?\d{3}\)?[-\s\.]?\d{3}[-\s\.]?\d{4}',
            r'\(?\d{3}\)?[-\s\.]?\d{3}[-\s\.]?\d{4}',
        ]
        for pattern in phone_patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(0)
        return None
    
    def _extract_linkedin(self, text: str) -> Optional[str]:
        """Extract LinkedIn URL"""
        linkedin_pattern = r'(?:https?://)?(?:www\.)?linkedin\.com/in/[\w-]+'
        match = re.search(linkedin_pattern, text, re.IGNORECASE)
        return match.group(0) if match else None
    
    def _extract_github(self, text: str) -> Optional[str]:
        """Extract GitHub URL"""
        github_pattern = r'(?:https?://)?(?:www\.)?github\.com/[\w-]+'
        match = re.search(github_pattern, text, re.IGNORECASE)
        return match.group(0) if match else None
    
    def _extract_website(self, text: str) -> Optional[str]:
        """Extract personal website/portfolio"""
        # Look for URLs that aren't LinkedIn/GitHub/email
        url_pattern = r'(?:https?://)?(?:www\.)?[\w-]+\.[\w.-]+(?:/[\w.-]*)*'
        matches = re.findall(url_pattern, text.lower())
        for url in matches:
            if 'linkedin' not in url and 'github' not in url and '@' not in url:
                return url
        return None
    
    def _extract_location(self, text: str) -> Optional[str]:
        """Extract location/address"""
        # Look for common location patterns
        location_patterns = [
            r'(?:^|\n)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})',  # City, ST
            r'(?:^|\n)([A-Z][a-z]+,\s*[A-Z][a-z]+)',  # City, Country
        ]
        for pattern in location_patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1)
        return None
    
    def extract_summary(self, text: str) -> Optional[str]:
        """Extract professional summary/objective"""
        section_text = self._extract_section(text, self.section_patterns["summary"])
        if section_text:
            # Get first paragraph (usually the summary)
            paragraphs = [p.strip() for p in section_text.split('\n\n') if p.strip()]
            if paragraphs:
                return paragraphs[0][:500]  # Limit to 500 chars
        return None
    
    def extract_skills(self, text: str) -> Dict:
        """
        Extract and categorize skills
        
        Returns:
            Dict with categorized skills
        """
        # Find all skills in entire text
        all_skills = find_skills_in_text(text)
        
        # Categorize them
        categorized = categorize_skills(all_skills)
        categorized["all_skills"] = all_skills
        
        return categorized
    
    def extract_experience(self, text: str) -> List[Dict]:
        """
        Extract work experience entries
        
        Returns:
            List of experience dicts
        """
        section_text = self._extract_section(text, self.section_patterns["experience"])
        if not section_text:
            return []
        
        experiences = []
        
        # Split by common delimiters (double newline, or position headers)
        entries = re.split(r'\n\s*\n', section_text)
        
        for entry in entries:
            if len(entry.strip()) < 20:  # Skip very short entries
                continue
            
            exp = {
                "company": self._extract_company(entry),
                "position": self._extract_position(entry),
                "start_date": None,
                "end_date": None,
                "duration_months": 0,
                "description": entry.strip(),
                "achievements": self._extract_achievements(entry),
                "skills_used": find_skills_in_text(entry)[:10],  # Limit to 10
            }
            
            # Extract dates
            dates = self._extract_dates(entry)
            if dates:
                exp["start_date"] = dates.get("start")
                exp["end_date"] = dates.get("end")
                exp["duration_months"] = dates.get("duration_months", 0)
            
            experiences.append(exp)
        
        return experiences[:10]  # Limit to 10 experiences
    
    def _extract_company(self, text: str) -> Optional[str]:
        """Extract company name from experience entry"""
        # Usually follows "at" or appears in first line
        at_pattern = r'(?:at|@)\s+([A-Z][A-Za-z\s&,\.]+?)(?:\s*,|\s*\n|\s*\|)'
        match = re.search(at_pattern, text)
        if match:
            return match.group(1).strip()
        
        # Try first line
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        if lines and len(lines[0]) < 100:
            return lines[0]
        
        return None
    
    def _extract_position(self, text: str) -> Optional[str]:
        """Extract job position/title"""
        # Usually in first line or before company name
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        if lines:
            first_line = lines[0]
            # If it contains common job titles
            job_keywords = ['engineer', 'developer', 'manager', 'analyst', 'designer', 
                           'specialist', 'consultant', 'architect', 'lead', 'senior', 'junior']
            if any(keyword in first_line.lower() for keyword in job_keywords):
                return first_line
        
        return None
    
    def _extract_dates(self, text: str) -> Optional[Dict]:
        """Extract start and end dates"""
        # Pattern: Jan 2020 - Present, 2020 - 2023, etc.
        date_patterns = [
            r'((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4})\s*[-–]\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}|present|current)',
            r'(\d{4})\s*[-–]\s*(\d{4}|present|current)',
            r'(\d{1,2}/\d{4})\s*[-–]\s*(\d{1,2}/\d{4}|present|current)',
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                start = match.group(1)
                end = match.group(2)
                
                # Calculate duration (approximate)
                duration_months = self._calculate_duration(start, end)
                
                return {
                    "start": start,
                    "end": end if end.lower() not in ['present', 'current'] else 'Present',
                    "duration_months": duration_months
                }
        
        return None
    
    def _calculate_duration(self, start: str, end: str) -> int:
        """Calculate duration in months (approximate)"""
        # Simple calculation based on years
        try:
            start_year = int(re.search(r'\d{4}', start).group())
            if end.lower() in ['present', 'current']:
                end_year = datetime.now().year
            else:
                end_year = int(re.search(r'\d{4}', end).group())
            
            return (end_year - start_year) * 12
        except:
            return 0
    
    def _extract_achievements(self, text: str) -> List[str]:
        """Extract achievement bullet points"""
        achievements = []
        
        # Look for bullet points or numbered lists
        bullet_pattern = r'(?:^|\n)\s*[•\-\*·][ \t]+(.+?)(?=\n\s*[•\-\*·]|\n\n|\Z)'
        bullets = re.findall(bullet_pattern, text, re.MULTILINE)
        
        # Filter to achievements (quantifiable results)
        achievement_keywords = ['increased', 'improved', 'reduced', 'achieved', 'delivered',
                               'developed', 'implemented', 'led', 'managed', 'created']
        
        for bullet in bullets:
            if any(keyword in bullet.lower() for keyword in achievement_keywords):
                achievements.append(bullet.strip())
        
        return achievements[:10]  # Limit to 10
    
    def extract_education(self, text: str) -> List[Dict]:
        """Extract education entries"""
        section_text = self._extract_section(text, self.section_patterns["education"])
        if not section_text:
            return []
        
        education = []
        entries = re.split(r'\n\s*\n', section_text)
        
        for entry in entries:
            if len(entry.strip()) < 15:
                continue
            
            edu = {
                "institution": self._extract_institution(entry),
                "degree": self._extract_degree(entry),
                "field": self._extract_field(entry),
                "year": self._extract_year(entry),
                "gpa": self._extract_gpa(entry),
            }
            
            education.append({k: v for k, v in edu.items() if v})
        
        return education[:5]  # Limit to 5
    
    def _extract_institution(self, text: str) -> Optional[str]:
        """Extract university/college name"""
        # Usually contains "University", "College", "Institute"
        institution_pattern = r'([A-Z][A-Za-z\s]+(?:University|College|Institute|School)[A-Za-z\s]*)'
        match = re.search(institution_pattern, text)
        return match.group(1).strip() if match else None
    
    def _extract_degree(self, text: str) -> Optional[str]:
        """Extract degree type"""
        degree_patterns = [
            r'(Bachelor|Master|PhD|Doctorate|Associate|B\.?S\.?|M\.?S\.?|M\.?B\.?A\.?|Ph\.?D\.?)',
            r'(B\.?A\.?|M\.?A\.?|B\.?E\.?|M\.?E\.?|B\.?Tech|M\.?Tech)',
        ]
        
        for pattern in degree_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1)
        return None
    
    def _extract_field(self, text: str) -> Optional[str]:
        """Extract field of study"""
        field_pattern = r'(?:in|of)\s+([A-Z][A-Za-z\s]+?)(?:\s*,|\s*\n|\s*\Z)'
        match = re.search(field_pattern, text)
        if match:
            field = match.group(1).strip()
            if len(field) < 50:  # Reasonable field name length
                return field
        return None
    
    def _extract_year(self, text: str) -> Optional[str]:
        """Extract graduation year"""
        year_pattern = r'(19|20)\d{2}'
        years = re.findall(year_pattern, text)
        return years[-1] if years else None  # Last year mentioned
    
    def _extract_gpa(self, text: str) -> Optional[str]:
        """Extract GPA"""
        gpa_pattern = r'GPA:?\s*(\d\.\d+)'
        match = re.search(gpa_pattern, text, re.IGNORECASE)
        return match.group(1) if match else None
    
    def extract_certifications(self, text: str) -> List[Dict]:
        """Extract certifications"""
        section_text = self._extract_section(text, self.section_patterns["certifications"])
        if not section_text:
            return []
        
        certs = []
        lines = [l.strip() for l in section_text.split('\n') if l.strip()]
        
        for line in lines[:10]:  # Limit to 10
            if len(line) > 10:
                cert = {
                    "name": line,
                    "issuer": None,
                    "date": self._extract_year(line),
                }
                certs.append(cert)
        
        return certs
    
    def extract_projects(self, text: str) -> List[Dict]:
        """Extract projects"""
        section_text = self._extract_section(text, self.section_patterns["projects"])
        if not section_text:
            return []
        
        projects = []
        entries = re.split(r'\n\s*\n', section_text)
        
        for entry in entries[:5]:  # Limit to 5
            if len(entry.strip()) < 20:
                continue
            
            project = {
                "name": entry.split('\n')[0].strip(),
                "description": entry.strip(),
                "technologies": find_skills_in_text(entry)[:10],
            }
            projects.append(project)
        
        return projects
    
    def _extract_section(self, text: str, patterns: List[str]) -> Optional[str]:
        """
        Extract a section from resume text
        
        Args:
            text: Full resume text
            patterns: List of regex patterns for section headers
            
        Returns:
            Section text or None
        """
        for pattern in patterns:
            # Find section header
            header_pattern = rf'(?:^|\n)\s*({pattern})\s*:?\s*\n'
            match = re.search(header_pattern, text, re.IGNORECASE | re.MULTILINE)
            
            if match:
                start = match.end()
                
                # Find next section header (or end of text)
                next_section_pattern = r'\n\s*([A-Z][A-Za-z\s]+)\s*:?\s*\n'
                next_match = re.search(next_section_pattern, text[start:])
                
                if next_match:
                    end = start + next_match.start()
                else:
                    end = len(text)
                
                return text[start:end].strip()
        
        return None
    
    def _calculate_total_experience(self, experiences: List[Dict]) -> float:
        """Calculate total years of experience"""
        total_months = sum(exp.get("duration_months", 0) for exp in experiences)
        return round(total_months / 12, 1)


    def parse_resume(self, file_path: str, file_type: str = None) -> Dict:
        """
        Parse resume and return only parsed data (without validation)
        
        Args:
            file_path: Path to resume file
            file_type: File extension (pdf/docx)
            
        Returns:
            Parsed data dictionary
        """
        raw_text = self.extract_text(file_path, file_type)
        
        # Extract all sections (skip validation, it's done separately)
        parsed_data = {
            "is_valid": True,
            "raw_text": raw_text,
            "contact_info": self.extract_contact_info(raw_text),
            "summary": self.extract_summary(raw_text),
            "skills": self.extract_skills(raw_text),
            "experience": self.extract_experience(raw_text),
            "education": self.extract_education(raw_text),
            "certifications": self.extract_certifications(raw_text),
            "projects": self.extract_projects(raw_text),
            "total_experience_years": 0,
        }
        
        # Calculate total experience
        parsed_data["total_experience_years"] = self._calculate_total_experience(parsed_data["experience"])
        
        return parsed_data


# Convenience function
def parse_resume(file_path: str) -> Tuple[str, Dict]:
    """
    Quick resume parsing
    
    Args:
        file_path: Path to resume file
        
    Returns:
        Tuple of (raw_text, parsed_data)
    """
    parser = ResumeParser()
    return parser.parse(file_path)
