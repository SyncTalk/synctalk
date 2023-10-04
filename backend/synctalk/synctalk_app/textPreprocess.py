import os
import json
import PyPDF2
import docx


from django.conf import settings

punctuaction = ['.',';','?','!', ':']
right_side_enders = ['”','>','}',']',')']
"""break a block of text on up on punctuation and add these to a dictionary of sentences and write to a text file
where ach line corresponds to broken piece of text by puntuation. Return any left over strings from block to be 
processed seperately or returned to this function"""
def blockStringSplit(block, sentenceDict,strSentence, sentenceLines):
    str = strSentence[1] + block
    sentence = strSentence[0]
    strByChar = ''
    length = len(str)
    index = 0
    while index < length:
        char = str[index]
        #remove newline or tab characters as we will place the newline characters ourselves and no longer need tab for formatting
        if (char == '\n' or char == '\t'):
            strByChar += ''
        else:
            strByChar += char
        #characters in puctuation list determine when we have reached the end of a sentence
        if (char in punctuaction):
            #checking if current sentence is inside brackets or quotation. If it is add that puntuation to end of sentence and skip to next 
            #index so that the next index is not added again to next sentence
            if (index < length - 1):
                if (str[index + 1] in right_side_enders):
                    strByChar += str[index + 1]
                    index += 1
            sentenceDict[sentence] = strByChar
            sentenceLines.write(strByChar + '\n')
            strByChar = ''
            sentence += 1
        index += 1
    str = strByChar
    return [sentence,str]

"""takes original text files and splits it into chunks, so that the system memory is not overly stressed and pass each text
chunk to blockStringSplit"""

def splitTextIntoSentences(file_path):
    extension = file_path.split('.')[1]
    strSentence = [1, '']
    sentenceDict = {}
    with (open(os.path.join(settings.MEDIA_ROOT, file_path + 'text.json'), 'w') as destination, 
          open(os.path.join(settings.MEDIA_ROOT, file_path + 'text.txt'), 'w', encoding= "utf-8") as sentenceLines):
        if(extension == 'txt'):
                file = open(file_path, 'r', encoding= "utf-8")
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
    return os.path.join(settings.MEDIA_ROOT, file_path + 'text.txt')

