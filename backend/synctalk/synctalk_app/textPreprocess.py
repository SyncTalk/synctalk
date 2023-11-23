import os
import json
import PyPDF2
import docx

import re
from nltk.tokenize import sent_tokenize


from django.conf import settings



def tokenizeZH(para):
    para = re.sub("([。！？\?])([^”’])", r"\1\n\2", para)
    para = re.sub("(\.{6})([^”’])", r"\1\n\2", para)
    para = re.sub("(\…{2})([^”’])", r"\1\n\2", para)
    para = re.sub("([。！？\?][”’])([^，。！？\?])", r"\1\n\2", para)
    para = para.rstrip()
    return para.split("\n")


def splitTextIntoSentences(file_path, lang):
    extension = file_path.split(".")[1]
    text = ""

    # read in text from files
    if extension == "txt":
        a = open(file_path, "r", encoding="utf-8")
        text = a.read()
        a.close()

    elif extension == "pdf":
        pdfFileObj = open(file_path, "rb")
        pdfReader = PyPDF2.PdfReader(pdfFileObj)
        numPages = len(pdfReader.pages)
        for pageNum in range(numPages):
            pageobj = pdfReader.pages[pageNum]
            str = pageobj.extract_text()
            text = text + str
        pdfFileObj.close()
    elif extension == "docx":
        docxFileObj = open(file_path, "rb")
        document = docx.Document(docxFileObj)
        for para in document.paragraphs:
            str = para.text
            text = text + str
        docxFileObj.close()

    # remove extra lines
    text = text.replace("\n\n", " ")
    text = re.sub("\s+", " ", text)

    # tokenize
    stringlist = []
    if lang == "zh":
        # nltk's tokenizer doesn't support chinese
        stringlist = tokenizeZH(text)
    else:
        text = re.sub(r": ", r": \n", text)
        text = re.sub(r"” ", r"” \n", text)
        stringlist = sent_tokenize(text)

    # print(stringlist)
    # save to file_pathtext.txt
    with open(
        os.path.join(settings.MEDIA_ROOT, file_path + "text.txt"), "w", encoding="utf-8"
    ) as file:
        for sentence in stringlist:
            # Write each sentence followed by a newline character
            file.write(sentence.strip() + "\n")

    # TODO: maybe remove original file?

    # return path to tokenized text file
    return os.path.join(settings.MEDIA_ROOT, file_path + "text.txt")


def writeToresult(res_path, text_path):
    result = []
    text = open(text_path,'r', encoding='utf-8')
    lines = text.read().splitlines() # list of strings
    text.close()
    for i, line in enumerate(lines, start=1):
        result.append({"id": i, "text": line})

    with open(res_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False)

    # dump to res_path
