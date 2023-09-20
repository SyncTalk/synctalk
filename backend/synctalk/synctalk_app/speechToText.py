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
    output_path = file_path + ".json"

    #save to json file
    with open(output_path, 'w') as json_file:
        json.dump(result, json_file)
    
    return result