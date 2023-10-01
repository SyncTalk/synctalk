import os
import json
import PyPDF2
import docx


from django.conf import settings

punctuaction = ['.',';','?','!']
"""break a block of text on up on punctuation and add these to a dictionary of sentences and write to a text file
where ach line corresponds to broken piece of text by puntuation. Return any left over strings from block to be 
processed seperately or returned to this function"""
def blockStringSplit(block, sentenceDict,strSentence, sentenceLines):
    str = strSentence[1] + block
    sentence = strSentence[0]
    strByChar = ''
    length = len(str)
    for index in range(length):
        char = str[index]
        if (char == '\n' ):
            strByChar += ''
        else:
            strByChar += char
        if (char in punctuaction):
            if (index < (length - 1)):
                if(str[index+1] == ' ' or str[index+1] == '\n'):
                    sentenceDict[sentence] = strByChar
                    sentenceLines.write(strByChar + '\n')
                    strByChar = ''
                    sentence += 1
            else:
                sentenceDict[sentence] = strByChar
                sentenceLines.write(strByChar + '\n')
                strByChar = ''
                sentence += 1
    str = strByChar
    return [sentence,str]

"""takes original text files and splits it into chunks, so that the system memory is not overly stressed and pass each text
chunk to blockStringSplit"""

def splitTextIntoSentences(file_path):
    extension = file_path.split('.')[1]
    strSentence = [1, '']
    sentenceDict = {}
    with open(os.path.join(settings.MEDIA_ROOT, 'text.json'), 'w') as destination, open(os.path.join(settings.MEDIA_ROOT, 'text.txt'), 'w') as sentenceLines:
        if(extension == 'txt'):
                file = open(file_path, 'r')
                for line in file:
                    strSentence = blockStringSplit(line, sentenceDict, strSentence,sentenceLines)
                if(strSentence[1]) :
                    sentenceDict[strSentence[0]] = strSentence[1]  
                    sentenceLines.write(strSentence[1] + '\n')
        
        elif (extension == 'pdf'):
            pdfFileObj = open(file_path, 'rb')
            pdfReader = PyPDF2.PdfReader(pdfFileObj)
            numPages = len(pdfReader.pages)
            for pageNum in range(numPages):
                pageobj = pdfReader.pages[pageNum]
                str = pageobj.extract_text()
                strSentence = blockStringSplit(str, sentenceDict, strSentence,sentenceLines)
            if(strSentence[1]) :
                sentenceDict[strSentence[0]] = strSentence[1]
                sentenceLines.write(strSentence[1] + '\n')
        
        elif (extension == 'docx'):
            docxFileObj = open(file_path, 'rb')
            document = docx.Document(docxFileObj)
            for para in document.paragraphs:
                text = para.text
                strSentence = blockStringSplit(text, sentenceDict, strSentence,sentenceLines)
            if(strSentence[1]) :
                sentenceDict[strSentence[0]] = strSentence[1]
                sentenceLines.write(strSentence[1] + '\n')
                
        json.dump(sentenceDict, destination)
        destination.close()
        sentenceLines.close()
    return

