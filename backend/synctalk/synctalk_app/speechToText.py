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
    print(words_count)

    #save whisper result to json file for debugging
    with open(os.path.join(os.path.dirname(file_path),"whisper.json"), 'w') as json_file:
        json.dump(result, json_file,ensure_ascii=False)

    # get alignment result

    result = align(words_info, words_list, words_count, RESULT_PATH)


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
        sentence_and_sequences = [None] * 2
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
    print(finalSequences)
    index = 0
    for entry in result:
        entry['start'] = -1
        entry['end']= -1
        entry['words']= []
        for sentence in finalSequences[0]:
            similarity = SequenceMatcher(None, entry['text'], sentence).ratio()
            if len(finalSequences[1]) > index:
                if similarity >= finalSequences[1][index][2]:
                    start = finalSequences[1][index][0]
                    end = finalSequences[1][index][1]
                    entry['start'] = words_info[start]['start']
                    entry['end']= words_info[end]['end']
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
        word = word.replace(" " ,"").lower()
        print(word + '\n')
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
                            new_sequences.append([sequence[0], location])
                            
                #can add a sequence starting with this word here
                #for location in locations :new_sequences.append(location,location)
                sequences.extend(new_sequences)     
                #remove duplicates
                no_duplicates = []
                [no_duplicates.append(seq) for seq in sequences if seq not in no_duplicates]
                sequences = no_duplicates

    #only keep sequences with a greater than  65% match with original sentence
    more_accurate_sequences = []
    for seq in sequences:
        string = ''.join(words_list[seq[0]:seq[1]])
        similarity = SequenceMatcher(None, no_spaces_sentence.lower(), string).ratio()
        if similarity > 0.65:
            seq.append(similarity)
            more_accurate_sequences.append(seq)
    
    return more_accurate_sequences

#find best combination of sentence sequences where order of sentences is maintained and there is no overlap of sequences
#assumption is that the sentences are correct and are present in both the text and audio. This assumption comes from
#earlier step where any additional or lost sentences should not have made it into the sequences of accuracy above 65%
def orderSequences(sentence_sequences):
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
            text_sequences.extend(new_text_sequences)
            no_duplicates = []
            [no_duplicates.append(seq) for seq in text_sequences if seq not in no_duplicates]
            text_sequences = no_duplicates

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
            word_info['word'] = removePunctuation(word_info['word']).replace(" " ,"").lower()
            #use word as a key and make a list of all the indexes where the word is in the original data
            if word_info['word'] in words_count:
                words_count[word_info['word']].append(index)
            else:
                words_count[word_info['word']] = [index]
            words_list.append(word_info['word'])
            words_info.append(word_info)
            index += 1
    return words_info, words_count,words_list