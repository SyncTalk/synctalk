import whisper
import json
import os
import difflib
from difflib import SequenceMatcher 
from num2words import num2words

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
    
    words = getTranscribedWords(result)

    result = joinText(words, split_text_file_path)
    output_path = file_path + ".json"

    #save to json file
    with open(output_path, 'w') as json_file:
        json.dump(result, json_file,encoding = 'utf-8')
    
    return result

''' join sentences that are not ending with punctuation specified below'''
def joinText(data, split_text_file_path):
    # Initialize an empty list to store the new data
    new_data = []
    punctuation = ['.','!','?','"']
    word_error_tolerance = 0.8
    error_limit = 3
    gap_limit = 4

    data_length = len(data)
    word_no = 0

    file = open(split_text_file_path, 'r', encoding= "utf-8")
    for line in file: 
        original = line
        no_punctuation = removePunctuation(line)
        no_punctuation = no_punctuation.strip()
        words_in_sentence = no_punctuation.split()
        sentence_length = len(words_in_sentence)

        print(sentence_length)
        print(words_in_sentence)
        
        new_dict = {}
        new_dict['text'] = original
        new_dict['words'] = []
        
        index = 0
        no_critical_mistakes = 0
        number_matches = 0
        number_loops = 0
        '''check each word that was transcribed by whisper and see whether they are in the sentence text and in the correct spot
        Assumptions about the audio file: A transcribed sentence will not have more than two critical mistakes, because this would
        mean the sentence has lost its intended meaning.
        Critical mistakes are sequence of extra words in the audio that aren't in the text or sequence of subtracted words that are
        in the text but not the audio. The assumption on these sequences is they will not be longer than three words, as after this
        the sentence has again lost its original meaning.
        Most common mistake is that the transcpition is a similar sounding but not intended word eg: boa transcribed as bow. The assumption
        is that whisper is quite accurate and so there will not be more than three of these types of mistakes in a row. Will still be comparing
        similarity between words looking for greater than 50%, as they should still be similar.
        Another mistake in audio is words being out of order, assumption here is that this cannot occur at the same time as a critical mistake
        as then the sentence would most probably lost its meaning. Will not be dealing with this mistake directly.
        Another common mistake is either the transcript having extra sentences or fewer sentences than the text.
        If audio does break these assumtions then either the start or end time or both of sentence will not be shown and only the words that were found 
        will have their timestamps'''
        break_no = word_no
        while break_no < data_length:
            word_match = False
            #if statement is too make sure we don't get an index error
            if(index < sentence_length):
                word = removePunctuation(data[word_no]['word']).replace(" " ,"")
                similarity = SequenceMatcher(None, word, words_in_sentence[index]).ratio()
                
                if (similarity > word_error_tolerance):
                    print('similar: ')
                    word_match = True
                #check for common mistake. Check next two elements for similarity. Do so if current similarity is greater that 50%
                if(similarity > 0.498 and not word_match):
                    #if we are in last few words just assume it is a mistake in transription
                    if(word_no == data_length - error_limit):
                        word_match = True
                    else:
                        word_two =  removePunctuation(data[word_no + 1]['word']).replace(" " ,"")
                        word_three = removePunctuation(data[word_no + 2]['word']).replace(" " ,"")
                        print('mistake' + word_two + ':' + word_three)
                        if (index < sentence_length - 1):
                            similarity_two = SequenceMatcher(None, word_two, words_in_sentence[index + 1]).ratio()
                            if (similarity_two > word_error_tolerance > word_error_tolerance):
                                word_match = True
                        if (index < sentence_length - 2):
                            similarity_three = SequenceMatcher(None, word_three, words_in_sentence[index + 2]).ratio()
                            if (similarity_three > word_error_tolerance):
                                word_match = True
                        #if it is the last word in the sentence and similarity score is 50% just assume the match
                        else:
                            print("line101: ")
                            word_match = True

                if(no_critical_mistakes >= error_limit):
                    break
                #check if additional words were added or subrtracted
                if(no_critical_mistakes < error_limit and not word_match):
                    print('critical mistake')
                    #if we are in last few words just assume it is a mistake in transription
                    if(word_no == data_length - gap_limit):
                        word_match = True
                    else:
                        #test for added word
                        for i in range(1,gap_limit):
                            word_added =  removePunctuation(data[word_no + i]['word']).replace(" " ,"")
                            similarity = SequenceMatcher(None, word_added, words_in_sentence[index]).ratio()
                            if (similarity > word_error_tolerance):
                                word_match = True
                                word_no = word_no + i
                                no_critical_mistakes += 1
                                break
                        #if didn't find a match when testing for added words test for subracted word in transcript
                        if (not word_match):
                            for i in range(1,gap_limit):
                                if((index + i) < sentence_length):
                                    word_in_sentence = words_in_sentence[index + i]
                                    similarity = SequenceMatcher(None, word, word_in_sentence).ratio()
                                    if (similarity > word_error_tolerance):
                                        word_match = True
                                        index = index + i
                                        no_critical_mistakes += 1
                                        break
                                #if it is the last word in the sentence assume it was deleted and finish
                                else:
                                    word_match = True
                                    break
            #check if it is the start or end word
            if word_match: 
                number_matches += 1 
                print(similarity, ': '+ word + ':' + words_in_sentence[index])
                new_dict['words'].append(data[word_no])
                #if index is zero that means we found the first word in the sentence
                if (index == 0): 
                    print('start: ')
                    new_dict['start'] = data[word_no]['start']
                #if index last element that means we have found last word in sentence
                elif (index == (sentence_length - 1)): 
                    print('end: ')
                    new_dict['end'] = data[word_no]['end']
                    word_no += 1
                    break
                word_no += 1
                index += 1
            elif(number_matches == 0 and (number_loops > index or number_loops > 2*error_limit)):
                break
            break_no += 1
            number_loops += 1
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
    punc = '''“”!()[]{};:'"\,<>./?@#$%^&*_~'''
    whitespace_punc = '''-'''
    # Removing punctuations in string
    # Using loop + punctuation string
    for char in string:
        if char in punc:
            string = string.replace(char, "")
        elif char in whitespace_punc:
            string = string.replace(char, " ")
        elif char.isdigit():
            string=string.replace(char, num2words(int(char)))
    return string

def getTranscribedWords(data):
    words = []
    for segment in data:
        for word in segment['words']:
            words.append(word)
    return words