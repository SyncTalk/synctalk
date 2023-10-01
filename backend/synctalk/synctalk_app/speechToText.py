import whisper
import json
import os

def getTimestamps(file_path):
    #send data to whisper
    model = whisper.load_model('small')
    result = model.transcribe(file_path, fp16=False)
    result=result["segments"]
    
    #remove unnecessary fields
    fields_to_drop = ["seek", "tokens","temperature","avg_logprob","compression_ratio","no_speech_prob"]
    
    for field in fields_to_drop:
        for seg in result:
            del seg[field]

    result = joinText(result)
    output_path = file_path + ".json"

    #save to json file
    with open(output_path, 'w') as json_file:
        json.dump(result, json_file)
    
    return result

''' join sentences that are not ending with punctuation specified below'''
def joinText(data):
    # Initialize an empty list to store the new data
    new_data = []
    punctuation = ['.','!','?','"']

    i=0
    while i<len(data):
        # If the text ends with a punctuation, add it to the new data as is
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
                i+=1
    #tidy up id
    i=0
    while i<len(new_data):
        new_data[i]['id'] = i
        i+=1
    return new_data