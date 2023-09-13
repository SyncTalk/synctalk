
import os
import json
import PyPDF2
import docx 
from django.conf import settings

def blockStringSplit(block, sentenceDict,strSentence):
    str = strSentence[1] + block
    sentence = strSentence[0]
    strByChar = ''
    length = len(str)
    for index in range(length):
        char = str[index]
        strByChar += char
        if (char == '.'):
            if (index < (length - 1)):
                if(str[index-1].isnumeric() and str[index+1].isnumeric()):
                    continue
            sentenceDict[sentence] = strByChar
            strByChar = ''
            sentence += 1
    str = strByChar
    return [sentence,str]

def splitTextIntoSentences(file_path):
    extension = file_path.split('.')[1]
    strSentence = [1, '']
    sentenceDict = {}
    with open(os.path.join(settings.MEDIA_ROOT, 'text.json'), 'w') as destination:
        if(extension == 'txt'):
                file = open(file_path, 'r')
                for line in file:
                    strSentence = blockStringSplit(line, sentenceDict, strSentence)
                if(strSentence[1]) :
                    sentenceDict[strSentence[0]] = strSentence[1]  
        elif (extension == 'pdf'):
            pdfFileObj = open(file_path, 'rb')
            pdfReader = PyPDF2.PdfReader(pdfFileObj)
            numPages = len(pdfReader.pages)
            for pageNum in range(numPages):
                pageobj = pdfReader.pages[pageNum]
                str = pageobj.extract_text()
                strSentence = blockStringSplit(str, sentenceDict, strSentence)
            if(strSentence[1]) :
                sentenceDict[strSentence[0]] = strSentence[1]
        json.dump(sentenceDict, destination)
    return