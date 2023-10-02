import whisper
import json
import os
import difflib
from difflib import SequenceMatcher 

def getTimestamps(file_path, split_text_file_path):
    #send data to whisper
    model = whisper.load_model('small')
    result = model.transcribe(file_path, word_timestamps = True ,fp16=False)
    result=result["segments"]
    
    #remove unnecessary fields
    fields_to_drop = ["seek", "tokens","temperature","avg_logprob","compression_ratio","no_speech_prob"]
    
    for field in fields_to_drop:
        for seg in result:
            del seg[field]

    result = joinText(result, split_text_file_path)
    output_path = file_path + ".json"

    #save to json file
    with open(output_path, 'w') as json_file:
        json.dump(result, json_file)
    
    return result

''' join sentences that are not ending with punctuation specified below'''
def joinText(data, split_text_file_path):
    # Initialize an empty list to store the new data
    new_data = []
    punctuation = ['.','!','?','"']
    word_error_tolerance = 0.8

    segment_no = 0
    word_no = 0

    file = open(split_text_file_path, 'r', encoding= "utf-8")
    for line in file: 
        original = line
        no_punctuation = removePunctuation(line)
        no_punctuation = no_punctuation.strip()
        words_in_sentence = no_punctuation.split()
        new_dict = {}
        new_dict['text'] = original
        new_dict['words'] = []
        index = 0
        
        break_outer = False
        #check each word in each segment whether they are in the sentence text
        while segment_no<len(data):
            while word_no < len(data[segment_no]['words']):
                if(index < len(words_in_sentence)):
                    word = removePunctuation(data[segment_no]['words'][word_no]['word']).replace(" " ,"")
                    print(SequenceMatcher(None, word, words_in_sentence[index]).ratio())
                    print(SequenceMatcher(None, word, words_in_sentence[index]).ratio(), ': '+ word + ':' + words_in_sentence[index])
                    if (SequenceMatcher(None, word, words_in_sentence[index]).ratio() > word_error_tolerance):
                        print('2: '+ word + ':' + words_in_sentence[0])
                        new_dict['words'].append(data[segment_no]['words'][word_no])
                        if (SequenceMatcher(None, word, words_in_sentence[0]).ratio() > word_error_tolerance): 
                            new_dict['start'] = data[segment_no]['words'][word_no]['start']
                        elif (SequenceMatcher(None, word, words_in_sentence[-1]).ratio() > word_error_tolerance): 
                            new_dict['end'] = data[segment_no]['words'][word_no]['end']
                            break_outer = True
                            word_no += 1
                            break
                word_no += 1
                index +=1
            if break_outer:
                break
            segment_no += 1
            word_no = 0
            
        new_data.append(new_dict)

    '''# If the text ends with a punctuation, add it to the new data as is
            if data[i]['text'][-1] in punctuation:
                new_data.append(data[i])
                i+=1
            # If the text does not end with a comma or somthing else, join it with the next text
            else:
                print(data[i]['id'])
                print(data[i]['text'])
                # Check if i is not the last index
                if i < len(data) - 1:
                    # Join the texts
                    joined_text = data[i]['text'] + ' ' + data[i+1]['text']
                    # Recalculate the start and end times
                    start = data[i]['start']
                    end = data[i+1]['end']
                    # Add the new entry to the new data
                    new_data.append({'id': data[i]['id'], 'start': start, 'end': end, 'text': joined_text})
                    # Skip the next entry as it has been joined with the current one
                    i += 2
                else:
                    # If i is the last index, add it to the new data as is
                    new_data.append(data[i])
                    i+=1  '''
            
        #tidy up id
    i=0
    
    while i<len(new_data):
        new_data[i]['id'] = i
        i+=1
    return new_data

def removePunctuation(string):
    # initializing punctuations string
    punc = '''“”!()-[]{};:'"\,<>./?@#$%^&*_~'''
    # Removing punctuations in string
    # Using loop + punctuation string
    for char in string:
        if char in punc:
            string = string.replace(char, "")
    
    return string