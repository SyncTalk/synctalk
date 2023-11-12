import whisper
import json
import os
import difflib
from difflib import SequenceMatcher 
from num2words import num2words

def getTimestamps(file_path, split_text_file_path,RESULT_PATH):
    #send data to whisper
    model = whisper.load_model('small')
    result = model.transcribe(file_path, word_timestamps = True ,fp16=False)
    result=result["segments"]
    
    #remove unnecessary fields
    fields_to_drop = ["seek", "tokens","temperature","avg_logprob","compression_ratio","no_speech_prob"]
    
    for field in fields_to_drop:
        for seg in result:
            del seg[field]
    
    words_info, words_count,words_list = getTranscribedWords(result)

    #save whisper result to json file for debugging
    with open(os.path.join(os.path.dirname(file_path),"whisper.json"), 'w') as json_file:
        json.dump(result, json_file,ensure_ascii=False)

    # get alignment result
    result = align(words_info, words_list, words_count, RESULT_PATH)
    #result = joinText(words_info, split_text_file_path,RESULT_PATH)

    #save to json file
    with open(RESULT_PATH, 'w') as json_file:
        json.dump(result, json_file,ensure_ascii=False)
    
    return result

def align(words_info, words_list, words_count, RESULT_PATH):
    temp = open(RESULT_PATH,'r',encoding="utf-8")
    result = json.load(temp)
    temp.close()

    sentence_sequences = []

    for entry in result:
        sentence_and_sequences = []
        sentence = entry['text']
        #first element is the original sentence, second element is the list of lists of possible sequences (start and end locations in words_info) and
        #similarity with original sentence
        #third value will be the final chosen start and end of sequence
        sentence_and_sequences[0] = sentence
        
        no_punctuation = removePunctuation(sentence)
        no_punctuation = no_punctuation.strip()
        words_in_sentence = no_punctuation.split()
        #for later checking of accuracy of found sequence
        no_spaces_sentence = ''.join(words_in_sentence)

        sentence_and_sequences[1] = getSequences(words_in_sentence, no_spaces_sentence,words_count, words_list)
        sentence_sequences.append(sentence_and_sequences)
    
    #find best combination of sentence sequences where order of sentences is maintained and there is no overlap of sequences
    finalSequences = orderSequences(sentence_sequences)
    index = 0
    for entry in result:
        entry['start'] = -1
        entry['end']= -1
        entry['words']= []
        for sentence in finalSequences[0]:
            similarity = SequenceMatcher(None, result['text'], sentence).ratio()
            if similarity >= finalSequences[1][index][2]:
                start = finalSequences[1][index][0]
                end = finalSequences[1][index][1]
                entry['start'] = words_info[start]
                entry['end']= words_info[start]
                entry['words']= words_info[start:end]
                index += 1
    return result

#builds a list of places where the sentence occurs in the list of transcribed words from audio. can then take this list of places
#for every sentence and pick the sequences where order is preserved and there is no overlap between different sentence locations
def getSequences(words_in_sentence, no_spaces_sentence, words_count, words_list):
    #each sequence is a list of start and end locations
    sentence_length = len(words_in_sentence)
    sequences = []
    #create list of sequences of sentence
    for word in words_in_sentence:
        word = word.replace(" " ,"")
        if word in words_count:
            locations = words_count[word]
            #first occurence of a word in the sentence
            if not sequences:
                for location in locations:
                    sequences.append([location,location])
            else:
                new_sequences = []
                for sequence in sequences:
                    for location in locations:
                        #and make sure the length to the end of the sequence will not exceed more than twice that of the original sentence
                        #becuase then the sequence will almost certainly not match the original. 2 times is arbitrary, a better number may be chosen
                        if ((location - sequence[1]) > 2*sentence_length):
                            #don't need to check any other locations because list is in order so everything else will also be greater
                            break

                        #make sure location is greater than the current ending place if we want to change that value
                        elif (location > sequence[1]):
                            new_sequences.append(sequence[0], location)
                            
                #can add a sequence starting with this word here
                #for location in locations :new_sequences.append(location,location)
                sequences.extend(new_sequences)     

    #only keep sequences with a greater than  65% match with original sentence
    more_accurate_sequences = []
    for seq in sequences:
        string = ''.join(words_list[seq[0]:seq[1]])
        similarity = SequenceMatcher(None, no_spaces_sentence, string).ratio()
        if similarity > 0.65:
            seq.append(similarity)
            more_accurate_sequences.append(seq)
    
    return more_accurate_sequences

#find best combination of sentence sequences where order of sentences is maintained and there is no overlap of sequences
#assumption is that the sentences are correct and are present in both the text and audio. This assumption comes from
#earlier step where any additional or lost sentences should not have made it into the sequences of accuracy above 65%
def orderSequences(sentence_sequences):
    text_sequences_and_list_of_sentence_sequences_in_it = []
    text_sequences = []
    number_of_sentences = 0
    for sentence_sequence in sentence_sequences:
        number_of_sentences += 1
        #if its the first sentence add all possible start locations for that sentence
        if not text_sequences:
            for sequence in sentence_sequence[1]:
                #last two values is average similarity and number of sentences used
                text_sequences.append([[sentence_sequence[0]], [sequence], sequence[2], 1])
        else:
            new_text_sequences = []
            for text_sequence in text_sequences:
                for sequence in sentence_sequence[1]:
                    if sequence[0] > text_sequence[1][-1][1]:
                        old_sequence = text_sequence
                        old_sequence[0].append(sentence_sequence[0])
                        old_sequence[1].append(sequence)
                        old_sequence[2] += sequence[2]
                        old_sequence[3] += 1
                        new_text_sequences.append(old_sequence)
            #assumint text is made of every text sequence. possibly a more naive approach to save time.
            
            #can add a text sequence starting with this sentence here
            #for for sequence in sentence_sequence[1]: text_sequences.append([[sentence_sequence[0]], [sequence], sequence[2], 1])
            text_sequences = new_text_sequences

    #find text sequence with highest number of sentences used and highest similarity
    highest  = 0
    final_text_sequence = []
    for text_sequence in text_sequences:
        if text_sequence[3] > highest:
            final_text_sequence = text_sequence
        elif text_sequence[3] == highest:
            if text_sequence[2] > final_text_sequence[2]:
                final_text_sequence = text_sequence
    
    return final_text_sequence





def joinText(data, split_text_file_path,RESULT_PATH):
    # Initialize an empty list to store the new data
    new_data = []
    punctuation = ['.','!','?','"']
    word_error_tolerance = 0.8
    error_limit = 3
    gap_limit = 4

    data_length = len(data)
    word_no = 0

    temp = open(RESULT_PATH,'r',encoding="utf-8")
    result = json.load(temp)
    temp.close()

    #file = open(split_text_file_path, 'r', encoding= "utf-8")
    for entry in result: 
        line = entry["text"]
        print(line)

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
        new_dict['start'] = "-1"
        new_dict['end'] = "-1"
        
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

        #append align result to result.json
        entry['start'] = new_dict['start']
        entry['end']=new_dict['end']
        entry['words']=new_dict['words']
        
        #tidy up id
    i=0
    
    while i<len(new_data):
        new_data[i]['id'] = i
        i+=1
    #return new_data
    return result

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
    index = 0
    words_count = {}
    words_info = []
    words_list = []
    for segment in data:
        for word_info in segment['words']:
            #remove punctuation from word for better checking of match
            word_info['word'] = removePunctuation(word_info['word']).replace(" " ,"")
            #use word as a key and make a list of all the indexes where the word is in the original data
            if word_info['word'] in words_count:
                words_count[word_info['word']].append(index)
            else:
                words_count[word_info['word']] = [index]
            words_list.append(word_info['word'])
            words_info.append(word_info)
            index += 1
    return words_info, words_count,words_list