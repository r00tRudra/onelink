from docx import Document


class ResumeParser:

    def extract_text_from_pdf(self, file_path: str) -> str:
        # leave PDF for later
        return ""

    def extract_text_from_docx(self, file_path: str) -> str:
        try:
            doc = Document(file_path)
            text = []
            for p in doc.paragraphs:
                if p.text.strip():
                    text.append(p.text.strip())
            return "\n".join(text)
        except Exception as e:
            print("DOCX ERROR:", e)
            return ""

    def parse_resume_text(self, text: str):
        return {
            "skills": [],
            "education": [],
            "experiences": []
        }


resume_parser = ResumeParser()



