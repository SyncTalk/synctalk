
import os
import json
from django.conf import settings

def splitTextIntoSentences(file):
    file_type = file.name
    extension = file_type.split('.')[1]
    if(extension == 'txt'):
        sentence = 1
        str = ''
        sentenceDict = {}
        with open(os.path.join(settings.MEDIA_ROOT, 'text.json'), 'w') as destination:
            for chunk in file.chunks():
                str = str + chunk.decode()
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
            if(str) :
                sentenceDict[sentence] = strByChar    
            print(sentenceDict)
            json.dump(sentenceDict, destination)
    return