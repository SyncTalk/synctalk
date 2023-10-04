import os
import json
import PyPDF2
import docx

import re
from nltk.tokenize import sent_tokenize


from django.conf import settings

punctuaction = ['.',';','?','!', ':']
right_side_enders = ['”','>','}',']',')']
"""break a block of text on up on punctuation and add these to a dictionary of sentences and write to a text file
where ach line corresponds to broken piece of text by puntuation. Return any left over strings from block to be 
processed seperately or returned to this function"""
def blockStringSplit(block, strSentence, sentenceLines):
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
            sentenceLines.write(strByChar + '\n')
            strByChar = ''
            sentence += 1
        index += 1
    str = strByChar
    return [sentence,str]


def tokenizeZH(para):
    para = re.sub('([。！？\?])([^”’])', r"\1\n\2", para)
    para = re.sub('(\.{6})([^”’])', r"\1\n\2", para)
    para = re.sub('(\…{2})([^”’])', r"\1\n\2", para)
    para = re.sub('([。！？\?][”’])([^，。！？\?])', r'\1\n\2', para)
    para = para.rstrip() 
    return para.split("\n")



def splitTextIntoSentences(file_path, lang):
    extension = file_path.split('.')[1]
    text = ''

    #read in text from files
    if(extension == 'txt'):
        a = open(file_path, 'r', encoding= "utf-8")
        text = a.read()
        a.close()

    elif (extension == 'pdf'):
        pdfFileObj = open(file_path, 'rb')
        pdfReader = PyPDF2.PdfReader(pdfFileObj)
        numPages = len(pdfReader.pages)
        for pageNum in range(numPages):
            pageobj = pdfReader.pages[pageNum]
            str = pageobj.extract_text()
            text = text+str
        pdfFileObj.close()
    elif (extension == 'docx'):
        docxFileObj = open(file_path, 'rb')
        document = docx.Document(docxFileObj)
        for para in document.paragraphs:
            str = para.text
            text = text+str
        docxFileObj.close()
    
    #remove extra lines
    text = text.replace('\n\n', ' ')
    text = re.sub('\s+',' ',text)


    #tokenize
    stringlist = []
    if (lang=="zh"): 
        #nltk's tokenizer doesn't support chinese
        stringlist = tokenizeZH(text)
    else:
        text = re.sub(r': ', r': \n', text)
        text = re.sub(r'” ', r'” \n', text)
        stringlist = sent_tokenize(text)

    print(stringlist)
    #save to file_pathtext.txt
    with (open(os.path.join(settings.MEDIA_ROOT, file_path + 'text.txt'), 'w', encoding= "utf-8") as file):
        for sentence in stringlist:
            # Write each sentence followed by a newline character
            file.write(sentence.strip() + '\n')
    
    #TODO: maybe remove original file?

    #return path to tokenized text file
    return os.path.join(settings.MEDIA_ROOT, file_path + 'text.txt')

def writeToresult(res_path,text_path):
    result = {}
    text = open(text_path,'r')
    lines = text.read().splitlines() # list of strings
    text.close()
    for i, line in enumerate(lines, start=1):
        result[str(i)] = {"text": line}
    
    with open(res_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False)
 

    #dump to res_path
    

    
    


    







"""takes original text files and splits it into chunks, so that the system memory is not overly stressed and pass each text
chunk to blockStringSplit"""
# def splitTextIntoSentences(file_path):
#     extension = file_path.split('.')[1]
#     strSentence = [1, '']
    
#     with (open(os.path.join(settings.MEDIA_ROOT, file_path + 'text.txt'), 'w', encoding= "utf-8") as sentenceLines):
#         if(extension == 'txt'):
#                 file = open(file_path, 'r', encoding= "utf-8")
#                 for line in file:
#                     strSentence = blockStringSplit(line, strSentence,sentenceLines)
#                 if(strSentence[1]) :
#                     sentenceLines.write(strSentence[1] + '\n')
        
#         elif (extension == 'pdf'):
#             pdfFileObj = open(file_path, 'rb')
#             pdfReader = PyPDF2.PdfReader(pdfFileObj)
#             numPages = len(pdfReader.pages)
#             for pageNum in range(numPages):
#                 pageobj = pdfReader.pages[pageNum]
#                 str = pageobj.extract_text()
#                 strSentence = blockStringSplit(str, strSentence,sentenceLines)
#             if(strSentence[1]) :
#                 sentenceLines.write(strSentence[1] + '\n')
        
#         elif (extension == 'docx'):
#             docxFileObj = open(file_path, 'rb')
#             document = docx.Document(docxFileObj)
#             for para in document.paragraphs:
#                 text = para.text
#                 strSentence = blockStringSplit(text, strSentence,sentenceLines)
#             if(strSentence[1]) :
#                 sentenceLines.write(strSentence[1] + '\n')
                

#         sentenceLines.close()
#     return os.path.join(settings.MEDIA_ROOT, file_path + 'text.txt')

